/*
 * 20261026000000_schema.sql
 *
 * The tables of the multi-user version: who is who (profiles, clients,
 * invitations), the routines (programs -> days -> steps), the workout log
 * (sessions -> sets) and the "request a new exercise" inbox.
 *
 * Who can read or write each table is NOT here: see the next migration
 * (security). Every table gets row level security switched on there.
 *
 * The exercise catalog stays in the app code (src/data/exercises.js and one
 * animation file per exercise). The database only stores exercise ids as
 * text ("sentadilla-barra"). An id is never deleted; a renamed one goes to
 * src/data/renamedIds.js, and the app maps old ids when it reads.
 */

/* ---- People ---- */

create type public.app_role as enum ('superadmin', 'trainer', 'client');

/*
 * One row per login (auth.users), created by a trigger on sign-up.
 * Everybody starts as "client"; accepting a trainer invitation turns the
 * role into "trainer". Only the superadmin changes roles after that.
 */
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  role               public.app_role not null default 'client',
  full_name          text not null default '',
  email              text,
  -- The trainer who curates the catalog with you: sees and resolves exercise requests.
  can_curate_catalog boolean not null default false,
  -- A disabled user keeps their data but every permission check fails.
  disabled_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

/*
 * A trainer's client. Exists BEFORE the person has an account, so the
 * trainer can create the client, assign a routine and only then send the
 * link. user_id is filled in when the client accepts the invitation.
 * A person training with two trainers has two rows, one per trainer.
 */
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles (id) on delete cascade,
  user_id    uuid references public.profiles (id) on delete set null,
  full_name  text not null check (length(trim(full_name)) > 0),
  email      text,
  notes      text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trainer_id, user_id),
  -- Lets programs point at (client, trainer) together, see programs below.
  unique (id, trainer_id)
);
create index clients_user_id_idx on public.clients (user_id);

/*
 * A one-use link. The token travels only in the link; the table keeps its
 * SHA-256, so reading this table never reveals a usable link.
 * role "client" invitations point at the clients row they will claim.
 */
create table public.invitations (
  id          uuid primary key default gen_random_uuid(),
  token_hash  bytea not null unique,
  role        public.app_role not null check (role in ('trainer', 'client')),
  client_id   uuid references public.clients (id) on delete cascade,
  email       text,
  invited_by  uuid not null references public.profiles (id) on delete cascade,
  expires_at  timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  accepted_by uuid references public.profiles (id) on delete set null,
  revoked_at  timestamptz,
  created_at  timestamptz not null default now(),
  check ((role = 'client') = (client_id is not null))
);
create index invitations_client_id_idx on public.invitations (client_id);

/* ---- Routines ---- */

/*
 * One table for both kinds of routine:
 *   client_id null      a template in the trainer's library
 *   client_id set       the copy assigned to that client (assign_program()
 *                       makes it), with that client's own sets and kilos
 * source_program_id remembers which template a copy came from.
 * The (client_id, trainer_id) foreign key makes it impossible for a routine
 * to be assigned to a client of another trainer.
 */
create table public.programs (
  id                uuid primary key default gen_random_uuid(),
  trainer_id        uuid not null references public.profiles (id) on delete cascade,
  client_id         uuid,
  source_program_id uuid references public.programs (id) on delete set null,
  name              text not null check (length(trim(name)) > 0),
  focus             text not null default '',
  -- One of the DISCIPLINES keys in src/data/exercises.js.
  discipline        text not null default 'gym',
  starts_on         date,
  ends_on           date,
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  foreign key (client_id, trainer_id) references public.clients (id, trainer_id) on delete cascade,
  -- Lets workout sessions point at (program, client) together.
  unique (id, client_id)
);
create index programs_trainer_id_idx on public.programs (trainer_id);
create index programs_client_id_idx on public.programs (client_id);

create table public.program_days (
  id         uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  position   int not null default 0,
  name       text not null default '',
  focus      text not null default ''
);
create index program_days_program_id_idx on public.program_days (program_id);

/*
 * One step of a day, same idea as the steps in src/data/routines.js:
 * either exerciseIds (one, or several for a superset) or a vuelta key.
 * The prescription is structured so the trainer can change sets and kilos
 * per client; prescription_text keeps the free-text form the app uses today.
 */
create table public.program_steps (
  id                uuid primary key default gen_random_uuid(),
  day_id            uuid not null references public.program_days (id) on delete cascade,
  position          int not null default 0,
  exercise_ids      text[] not null default '{}',
  vuelta            text,
  note              text not null default '',
  sets              int check (sets > 0),
  reps              text,
  load_kg           numeric(6, 2) check (load_kg >= 0),
  secs              int check (secs > 0),
  rest_sec          int check (rest_sec >= 0),
  tempo             text,
  prescription_text text not null default '',
  check ((cardinality(exercise_ids) > 0) <> (vuelta is not null))
);
create index program_steps_day_id_idx on public.program_steps (day_id);

/* ---- Workout log ---- */

/*
 * One time a client trained a day. The id comes from the phone (like
 * newId() today), so retrying an upload after a dropped connection updates
 * the same row instead of creating a duplicate.
 * program_name / day_name keep what was trained even if the routine is
 * later edited or deleted. The (program_id, client_id) foreign key means a
 * session can only log a routine assigned to that same client.
 */
create table public.workout_sessions (
  id           uuid primary key,
  client_id    uuid not null references public.clients (id) on delete cascade,
  program_id   uuid,
  day_id       uuid references public.program_days (id) on delete set null,
  program_name text not null default '',
  day_name     text not null default '',
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  updated_at   timestamptz not null default now(),
  foreign key (program_id, client_id) references public.programs (id, client_id)
    on delete set null (program_id)
);
create index workout_sessions_client_id_idx on public.workout_sessions (client_id, started_at desc);

/*
 * One set. kg/reps/secs are what was done; planned_* are what the routine
 * asked for at that moment, so history stays true after the trainer edits.
 */
create table public.workout_sets (
  id              uuid primary key,
  session_id      uuid not null references public.workout_sessions (id) on delete cascade,
  step_id         uuid references public.program_steps (id) on delete set null,
  exercise_id     text not null,
  set_index       int not null check (set_index >= 0),
  kg              numeric(6, 2) check (kg >= 0),
  reps            int check (reps >= 0),
  secs            int check (secs >= 0),
  planned_sets    int,
  planned_reps    text,
  planned_load_kg numeric(6, 2),
  updated_at      timestamptz not null default now()
);
create index workout_sets_session_id_idx on public.workout_sets (session_id);
create index workout_sets_exercise_id_idx on public.workout_sets (exercise_id);

/* ---- Catalog requests ---- */

-- "Solicitar un ejercicio nuevo": a trainer asks, you add it in code and
-- mark it accepted with the id it got.
create table public.exercise_requests (
  id                   uuid primary key default gen_random_uuid(),
  requested_by         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name                 text not null check (length(trim(name)) > 0),
  description          text not null default '',
  video_url            text,
  status               text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  resolved_exercise_id text,
  resolved_by          uuid references public.profiles (id) on delete set null,
  resolved_at          timestamptz,
  created_at           timestamptz not null default now()
);

/* ---- updated_at ---- */

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();
create trigger programs_touch before update on public.programs
  for each row execute function public.touch_updated_at();
create trigger workout_sessions_touch before update on public.workout_sessions
  for each row execute function public.touch_updated_at();
create trigger workout_sets_touch before update on public.workout_sets
  for each row execute function public.touch_updated_at();

/* ---- A profile for every new login ---- */

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
