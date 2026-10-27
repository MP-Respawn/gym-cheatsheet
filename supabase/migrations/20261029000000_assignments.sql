/*
 * 20261029000000_assignments.sql
 *
 * One kind of routine. Until now assigning a routine copied it to the client
 * (programs.client_id = "the copy"), so the trainer had templates on one side
 * and copies on the other. Now a routine always belongs to the trainer, and
 * assigning it links it to a client:
 *
 *   programs             the trainer's routines (days and steps as before)
 *   program_assignments  routine <-> client. Archived = taken away.
 *   assignment_steps     that client's own sets, reps and kilos for a step,
 *                        only where they differ from the routine
 *
 * Editing a routine reaches every client who has it at once; each keeps their
 * own numbers. A client who needs other exercises gets a duplicate of the
 * routine (the app copies it with save_program) assigned only to them.
 *
 * The routines and workouts saved so far were test data: they are deleted.
 * Accounts, clients and invitations stay.
 */

/* ---- 1. The test data ---- */

delete from public.workout_sessions;  -- their sets go with them
delete from public.programs;          -- their days and steps go with them

/* ---- 2. Routines lose the copy columns ---- */

-- A session pointed at (routine, client) together, which only worked for copies.
alter table public.workout_sessions drop constraint workout_sessions_program_id_client_id_fkey;
alter table public.workout_sessions
  add constraint workout_sessions_program_id_fkey
  foreign key (program_id) references public.programs (id) on delete set null;

drop policy "programs: trainer manages own" on public.programs;
drop policy "programs: client reads assigned" on public.programs;

alter table public.programs drop column client_id, drop column source_program_id;
-- Lets an assignment point at (routine, trainer) together.
alter table public.programs add constraint programs_id_trainer_id_key unique (id, trainer_id);

/* ---- 3. Assignments ---- */

/*
 * The (program_id, trainer_id) and (client_id, trainer_id) foreign keys make
 * it impossible to give a routine to a client of another trainer.
 */
create table public.program_assignments (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null,
  client_id   uuid not null,
  trainer_id  uuid not null references public.profiles (id) on delete cascade,
  archived_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (program_id, client_id),
  foreign key (program_id, trainer_id) references public.programs (id, trainer_id) on delete cascade,
  foreign key (client_id, trainer_id) references public.clients (id, trainer_id) on delete cascade
);
create index program_assignments_client_id_idx on public.program_assignments (client_id);

create trigger program_assignments_touch before update on public.program_assignments
  for each row execute function public.touch_updated_at();

-- A client's own numbers for one step. Missing (or null) = the routine's.
create table public.assignment_steps (
  assignment_id uuid not null references public.program_assignments (id) on delete cascade,
  step_id       uuid not null references public.program_steps (id) on delete cascade,
  sets          int check (sets > 0),
  reps          text,
  load_kg       numeric(6, 2) check (load_kg >= 0),
  primary key (assignment_id, step_id)
);
create index assignment_steps_step_id_idx on public.assignment_steps (step_id);

/* ---- 4. Helpers ---- */

-- A routine I have now (assigned to me and not taken away).
create function private.is_assigned_to_me(p_program_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.program_assignments a
    where a.program_id = p_program_id and a.archived_at is null and private.is_me_as_client(a.client_id)
  )
$$;

-- This routine was ever given to this client (taken away counts: a workout
-- done before can still be uploaded after).
create function private.was_assigned(p_program_id uuid, p_client_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.program_assignments where program_id = p_program_id and client_id = p_client_id
  )
$$;

create or replace function private.can_read_program(p_program_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.programs p
    where p.id = p_program_id
      and ((p.trainer_id = auth.uid() and private.is_trainer()) or private.is_superadmin())
  ) or private.is_assigned_to_me(p_program_id)
$$;

create function private.can_read_assignment(p_assignment_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.program_assignments a
    where a.id = p_assignment_id
      and (
        (a.trainer_id = auth.uid() and private.is_trainer())
        or private.is_me_as_client(a.client_id)
        or private.is_superadmin()
      )
  )
$$;

create function private.can_write_assignment(p_assignment_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.program_assignments a
    where a.id = p_assignment_id
      and ((a.trainer_id = auth.uid() and private.is_trainer()) or private.is_superadmin())
  )
$$;

-- The step is part of the routine of that assignment.
create function private.step_in_assignment(p_step_id uuid, p_assignment_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.program_steps s
    join public.program_days d on d.id = s.day_id
    join public.program_assignments a on a.program_id = d.program_id
    where s.id = p_step_id and a.id = p_assignment_id
  )
$$;

/* ---- 5. Privileges and policies ---- */

-- Assignments are made by assign_program(), taken away by archiving, never deleted
-- from the app.
revoke insert, update, delete on public.program_assignments from authenticated;
grant insert (id, program_id, client_id, trainer_id) on public.program_assignments to authenticated;
grant update (archived_at) on public.program_assignments to authenticated;

alter table public.program_assignments enable row level security;
alter table public.assignment_steps    enable row level security;

create policy "programs: trainer manages own"
  on public.programs for all to authenticated
  using (trainer_id = auth.uid() and private.is_trainer())
  with check (trainer_id = auth.uid() and private.is_trainer());

create policy "programs: client reads assigned"
  on public.programs for select to authenticated
  using (private.is_assigned_to_me(id));

create policy "program_assignments: trainer manages own"
  on public.program_assignments for all to authenticated
  using (trainer_id = auth.uid() and private.is_trainer())
  with check (trainer_id = auth.uid() and private.is_trainer() and private.is_my_client(client_id));

create policy "program_assignments: client reads own"
  on public.program_assignments for select to authenticated
  using (private.is_me_as_client(client_id));

create policy "program_assignments: superadmin all"
  on public.program_assignments for all to authenticated
  using (private.is_superadmin()) with check (private.is_superadmin());

create policy "assignment_steps: read" on public.assignment_steps for select to authenticated
  using (private.can_read_assignment(assignment_id));
create policy "assignment_steps: insert" on public.assignment_steps for insert to authenticated
  with check (private.can_write_assignment(assignment_id) and private.step_in_assignment(step_id, assignment_id));
create policy "assignment_steps: update" on public.assignment_steps for update to authenticated
  using (private.can_write_assignment(assignment_id))
  with check (private.can_write_assignment(assignment_id) and private.step_in_assignment(step_id, assignment_id));
create policy "assignment_steps: delete" on public.assignment_steps for delete to authenticated
  using (private.can_write_assignment(assignment_id));

-- A client logs only routines they were given.
drop policy "workout_sessions: client manages own" on public.workout_sessions;
create policy "workout_sessions: client manages own"
  on public.workout_sessions for all to authenticated
  using (private.is_me_as_client(client_id))
  with check (
    private.is_me_as_client(client_id)
    and (program_id is null or private.was_assigned(program_id, client_id))
    and private.day_in_program(day_id, program_id)
  );

/* ---- 6. Functions the app calls ---- */

/*
 * Gives a routine to one or more clients (all or nothing), or changes the
 * numbers of clients who already have it. p_overrides holds each client's
 * own numbers, per step of the routine, only where they differ from it:
 *   { "<client id>": { "<step id>": { "sets": 4, "reps": "8", "load_kg": 40 } } }
 * For every client in p_client_ids the overrides REPLACE what they had (a
 * client missing from p_overrides goes back to the routine's numbers). A
 * routine that had been taken away is given back.
 * Runs as the caller (SECURITY INVOKER): the policies decide, so a trainer
 * only gives their own routines to their own clients.
 * Returns the assignments' ids, in the order of p_client_ids.
 */
create or replace function public.assign_program(
  p_program_id uuid,
  p_client_ids uuid[],
  p_overrides jsonb default '{}'
) returns uuid[]
language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_program public.programs;
  v_client uuid;
  v_assignment uuid;
  v_result uuid[] := '{}';
begin
  select * into v_program from public.programs where id = p_program_id;
  if not found then
    raise exception 'program not found' using errcode = 'P0002';
  end if;

  foreach v_client in array p_client_ids loop
    insert into public.program_assignments (program_id, client_id, trainer_id)
      values (v_program.id, v_client, v_program.trainer_id)
      on conflict (program_id, client_id) do update set archived_at = null
      returning id into v_assignment;

    delete from public.assignment_steps where assignment_id = v_assignment;
    insert into public.assignment_steps (assignment_id, step_id, sets, reps, load_kg)
      select v_assignment, s.id, (o.value ->> 'sets')::int, nullif(o.value ->> 'reps', ''), (o.value ->> 'load_kg')::numeric
      from jsonb_each(coalesce(p_overrides -> v_client::text, '{}'::jsonb)) o
      join public.program_steps s on s.id = o.key::uuid
      join public.program_days d on d.id = s.day_id and d.program_id = v_program.id;

    v_result := v_result || v_assignment;
  end loop;

  return v_result;
end;
$$;

/*
 * save_program() without client_id: the builder only saves the trainer's
 * routines now. Same as in 20261028000000_program_builder.sql otherwise.
 */
create or replace function public.save_program(p_program jsonb) returns uuid
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
  insert into public.programs (id, trainer_id, name, focus, discipline)
  values (
    v_id,
    auth.uid(),
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

  -- What the builder removed (deleting a day also deletes its steps, and a
  -- step takes the clients' numbers for it along).
  delete from public.program_steps where day_id = any(v_day_ids) and not (id = any(v_step_ids));
  delete from public.program_days where program_id = v_id and not (id = any(v_day_ids));
  -- Saving only steps or days still counts as editing the routine.
  update public.programs set updated_at = now() where id = v_id;
  return v_id;
end;
$$;
