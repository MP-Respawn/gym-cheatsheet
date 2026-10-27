/*
 * 20261028000000_program_builder.sql
 *
 * Saving a routine from the trainer's builder in one call.
 *
 * The builder edits a whole routine at once (its name, days and steps) and
 * saves it with save_program(): one transaction, so the routine is never
 * left half saved. Rows keep their ids between saves (the builder sends
 * them), so a step that was only moved or retouched is updated in place and
 * the workouts logged against it keep pointing at it. Days and steps that
 * are no longer in the routine are deleted.
 */

/*
 * p_program, as the builder sends it:
 *   { id, client_id, name, focus, discipline,
 *     days: [{ id, name, focus,
 *              steps: [{ id, exercise_ids, vuelta, note, sets, reps, load_kg,
 *                        secs, rest_sec, tempo, prescription_text }] }] }
 * Positions come from the order of the arrays. client_id only counts when
 * the routine is new (a routine never moves to another client).
 * Runs as the caller (SECURITY INVOKER): the policies decide, so a trainer
 * only saves their own routines and a client none.
 * Returns the routine's id.
 */
create function public.save_program(p_program jsonb) returns uuid
language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_id uuid := coalesce((p_program ->> 'id')::uuid, gen_random_uuid());
  v_day jsonb;
  v_step jsonb;
  v_day_id uuid;
  v_step_id uuid;
  v_day_pos int := 0;
  v_step_pos int;
  v_day_ids uuid[] := '{}';
  v_step_ids uuid[] := '{}';
begin
  insert into public.programs (id, trainer_id, client_id, name, focus, discipline)
  values (
    v_id,
    auth.uid(),
    (p_program ->> 'client_id')::uuid,
    p_program ->> 'name',
    coalesce(p_program ->> 'focus', ''),
    coalesce(p_program ->> 'discipline', 'gym')
  )
  on conflict (id) do update set
    name       = excluded.name,
    focus      = excluded.focus,
    discipline = excluded.discipline;

  for v_day in select * from jsonb_array_elements(coalesce(p_program -> 'days', '[]'::jsonb)) loop
    v_day_id := coalesce((v_day ->> 'id')::uuid, gen_random_uuid());
    insert into public.program_days (id, program_id, position, name, focus)
    values (v_day_id, v_id, v_day_pos, coalesce(v_day ->> 'name', ''), coalesce(v_day ->> 'focus', ''))
    on conflict (id) do update set
      program_id = excluded.program_id,
      position   = excluded.position,
      name       = excluded.name,
      focus      = excluded.focus;
    v_day_ids := v_day_ids || v_day_id;

    v_step_pos := 0;
    for v_step in select * from jsonb_array_elements(coalesce(v_day -> 'steps', '[]'::jsonb)) loop
      v_step_id := coalesce((v_step ->> 'id')::uuid, gen_random_uuid());
      insert into public.program_steps (
        id, day_id, position, exercise_ids, vuelta, note,
        sets, reps, load_kg, secs, rest_sec, tempo, prescription_text
      ) values (
        v_step_id,
        v_day_id,
        v_step_pos,
        coalesce(array(select jsonb_array_elements_text(v_step -> 'exercise_ids')), '{}'),
        nullif(v_step ->> 'vuelta', ''),
        coalesce(v_step ->> 'note', ''),
        (v_step ->> 'sets')::int,
        nullif(v_step ->> 'reps', ''),
        (v_step ->> 'load_kg')::numeric,
        (v_step ->> 'secs')::int,
        (v_step ->> 'rest_sec')::int,
        nullif(v_step ->> 'tempo', ''),
        coalesce(v_step ->> 'prescription_text', '')
      )
      on conflict (id) do update set
        day_id            = excluded.day_id,
        position          = excluded.position,
        exercise_ids      = excluded.exercise_ids,
        vuelta            = excluded.vuelta,
        note              = excluded.note,
        sets              = excluded.sets,
        reps              = excluded.reps,
        load_kg           = excluded.load_kg,
        secs              = excluded.secs,
        rest_sec          = excluded.rest_sec,
        tempo             = excluded.tempo,
        prescription_text = excluded.prescription_text;
      v_step_ids := v_step_ids || v_step_id;
      v_step_pos := v_step_pos + 1;
    end loop;

    v_day_pos := v_day_pos + 1;
  end loop;

  -- What the builder removed (deleting a day also deletes its steps).
  delete from public.program_steps where day_id = any(v_day_ids) and not (id = any(v_step_ids));
  delete from public.program_days where program_id = v_id and not (id = any(v_day_ids));
  -- Saving only steps or days still counts as editing the routine.
  update public.programs set updated_at = now() where id = v_id;
  return v_id;
end;
$$;

revoke execute on function public.save_program(jsonb) from public, anon;
grant execute on function public.save_program(jsonb) to authenticated;
