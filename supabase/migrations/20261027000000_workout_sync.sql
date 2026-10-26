/*
 * 20261027000000_workout_sync.sql
 *
 * Uploading a workout from the phone in one call.
 *
 * The app logs a workout on the phone first (the gym has bad signal) and
 * uploads it when it can, maybe several times if the connection drops
 * halfway. save_workout_session() makes that safe: it writes the session and
 * replaces all its sets in one transaction, so uploading the same workout
 * twice leaves exactly one copy, never half of one.
 */

-- The phone does not give sets ids of its own: the server makes them.
alter table public.workout_sets alter column id set default gen_random_uuid();

-- Which exercise of the session a set belongs to (0, 1, 2...). Needed because
-- an exercise can appear twice in one workout (a vuelta done with each arm).
alter table public.workout_sets add column entry_index int not null default 0 check (entry_index >= 0);

/*
 * p_session, as the app sends it:
 *   { id, client_id, program_id, day_id, program_name, day_name,
 *     started_at, finished_at,
 *     sets: [{ entry_index, set_index, exercise_id, step_id, kg, reps, secs,
 *              planned_sets, planned_reps, planned_load_kg }] }
 * Runs as the caller (SECURITY INVOKER): the policies decide, so a client
 * can only save their own sessions.
 * A routine, day or step the trainer deleted while the workout waited to be
 * uploaded is saved as null instead of failing: the names and the planned
 * values in the session keep what was trained.
 */
create function public.save_workout_session(p_session jsonb) returns void
language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_id uuid := (p_session ->> 'id')::uuid;
  v_program uuid := (select id from public.programs where id = (p_session ->> 'program_id')::uuid);
  v_day uuid := (select id from public.program_days where id = (p_session ->> 'day_id')::uuid and program_id = v_program);
begin
  insert into public.workout_sessions (
    id, client_id, program_id, day_id, program_name, day_name, started_at, finished_at
  ) values (
    v_id,
    (p_session ->> 'client_id')::uuid,
    v_program,
    v_day,
    coalesce(p_session ->> 'program_name', ''),
    coalesce(p_session ->> 'day_name', ''),
    coalesce((p_session ->> 'started_at')::timestamptz, now()),
    (p_session ->> 'finished_at')::timestamptz
  )
  on conflict (id) do update set
    client_id    = excluded.client_id,
    program_id   = excluded.program_id,
    day_id       = excluded.day_id,
    program_name = excluded.program_name,
    day_name     = excluded.day_name,
    started_at   = excluded.started_at,
    finished_at  = excluded.finished_at;

  delete from public.workout_sets where session_id = v_id;

  insert into public.workout_sets (
    session_id, entry_index, set_index, exercise_id, step_id, kg, reps, secs,
    planned_sets, planned_reps, planned_load_kg
  )
  select v_id, s.entry_index, s.set_index, s.exercise_id, step.id, s.kg, s.reps, s.secs,
         s.planned_sets, s.planned_reps, s.planned_load_kg
  from jsonb_to_recordset(coalesce(p_session -> 'sets', '[]'::jsonb)) as s (
    entry_index int, set_index int, exercise_id text, step_id uuid,
    kg numeric, reps int, secs int,
    planned_sets int, planned_reps text, planned_load_kg numeric
  )
  left join public.program_steps step on step.id = s.step_id;
end;
$$;

revoke execute on function public.save_workout_session(jsonb) from public, anon;
grant execute on function public.save_workout_session(jsonb) to authenticated;
