/*
 * 20261026000100_security.sql
 *
 * Who can do what. The app hides buttons, but THIS is what actually stops a
 * client from editing a routine: row level security (RLS) makes Postgres
 * check every read and write against the logged-in user (auth.uid()).
 *
 *   superadmin  everything
 *   trainer     their clients, their routines (templates and assigned
 *               copies), reads their clients' workout log, asks for
 *               new exercises
 *   client      reads the routines assigned to them, writes their own
 *               workout log. Nothing else.
 *
 * A disabled user (profiles.disabled_at) fails every check below, because
 * current_app_role() returns null for them.
 *
 * Writes that need more than one table, or must not be open to anybody
 * (invitations, roles), go through the functions at the end of this file.
 */

/* ------------------------------------------------------------------ */
/* 1. Helpers used by the policies                                     */
/* ------------------------------------------------------------------ */
/*
 * SECURITY DEFINER so they can read profiles/clients/programs without
 * going through those tables' own policies (which call these helpers:
 * without it they would loop). They live in the "private" schema, which
 * the Supabase API does not expose, so the app cannot call them directly.
 */

create schema private;
grant usage on schema private to authenticated;

-- The logged-in user's role, or null if not logged in or disabled.
create function private.current_app_role() returns public.app_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and disabled_at is null
$$;

create function private.is_superadmin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(private.current_app_role() = 'superadmin', false)
$$;

create function private.is_trainer() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(private.current_app_role() = 'trainer', false)
$$;

-- The superadmin, or the trainer who curates the catalog with them.
create function private.is_catalog_curator() returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_superadmin() or exists (
    select 1 from public.profiles
    where id = auth.uid() and disabled_at is null and can_curate_catalog
  )
$$;

-- This clients row belongs to me, the logged-in trainer.
create function private.is_my_client(p_client_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_trainer() and exists (
    select 1 from public.clients where id = p_client_id and trainer_id = auth.uid()
  )
$$;

-- This clients row is me (I am the client who accepted that invitation).
create function private.is_me_as_client(p_client_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.current_app_role() is not null and exists (
    select 1 from public.clients where id = p_client_id and user_id = auth.uid()
  )
$$;

create function private.can_read_program(p_program_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.programs p
    where p.id = p_program_id
      and (
        (p.trainer_id = auth.uid() and private.is_trainer())
        or (p.client_id is not null and private.is_me_as_client(p.client_id))
        or private.is_superadmin()
      )
  )
$$;

create function private.can_write_program(p_program_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.programs p
    where p.id = p_program_id
      and ((p.trainer_id = auth.uid() and private.is_trainer()) or private.is_superadmin())
  )
$$;

create function private.program_of_day(p_day_id uuid) returns uuid
language sql stable security definer set search_path = '' as $$
  select program_id from public.program_days where id = p_day_id
$$;

-- A session's day must be a day of that session's routine.
create function private.day_in_program(p_day_id uuid, p_program_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select p_day_id is null or exists (
    select 1 from public.program_days where id = p_day_id and program_id = p_program_id
  )
$$;

create function private.can_read_session(p_session_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workout_sessions s
    where s.id = p_session_id
      and (private.is_me_as_client(s.client_id) or private.is_my_client(s.client_id) or private.is_superadmin())
  )
$$;

-- Only the client who trained (or the superadmin) writes the log.
create function private.can_write_session(p_session_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workout_sessions s
    where s.id = p_session_id
      and (private.is_me_as_client(s.client_id) or private.is_superadmin())
  )
$$;

/* ------------------------------------------------------------------ */
/* 2. Table privileges                                                 */
/* ------------------------------------------------------------------ */
/*
 * Logged-out visitors (anon) get nothing: the catalog ships with the app.
 * Some columns are closed to direct writes even where the row is allowed:
 * nobody changes their own role, and clients.user_id is only set by
 * accept_invitation().
 */
revoke all on all tables in schema public from anon;

revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;
revoke insert, delete on public.profiles from authenticated;

-- Clients are archived, never deleted from the app: deleting would take
-- their whole workout history with it.
revoke insert, update, delete on public.clients from authenticated;
grant insert (id, trainer_id, full_name, email, notes) on public.clients to authenticated;
grant update (full_name, email, notes, archived_at) on public.clients to authenticated;

-- Invitations are only created, revoked and accepted through the functions below.
revoke insert, update, delete on public.invitations from authenticated;

/* ------------------------------------------------------------------ */
/* 3. Policies                                                         */
/* ------------------------------------------------------------------ */

alter table public.profiles          enable row level security;
alter table public.clients           enable row level security;
alter table public.invitations       enable row level security;
alter table public.programs          enable row level security;
alter table public.program_days      enable row level security;
alter table public.program_steps     enable row level security;
alter table public.workout_sessions  enable row level security;
alter table public.workout_sets      enable row level security;
alter table public.exercise_requests enable row level security;

/* ---- profiles ---- */

create policy "profiles: read own, my clients', or all as superadmin"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or private.is_superadmin()
    or (private.is_trainer() and exists (
      select 1 from public.clients c where c.user_id = profiles.id and c.trainer_id = auth.uid()
    ))
  );

create policy "profiles: edit own name"
  on public.profiles for update to authenticated
  using (id = auth.uid() and private.current_app_role() is not null)
  with check (id = auth.uid());

/* ---- clients ---- */

create policy "clients: trainer manages own"
  on public.clients for all to authenticated
  using (trainer_id = auth.uid() and private.is_trainer())
  with check (trainer_id = auth.uid() and private.is_trainer());

create policy "clients: client reads own"
  on public.clients for select to authenticated
  using (user_id = auth.uid() and private.current_app_role() is not null);

create policy "clients: superadmin all"
  on public.clients for all to authenticated
  using (private.is_superadmin()) with check (private.is_superadmin());

/* ---- invitations ---- */

create policy "invitations: read the ones I sent"
  on public.invitations for select to authenticated
  using (invited_by = auth.uid() or private.is_superadmin());

/* ---- programs ---- */

create policy "programs: trainer manages own"
  on public.programs for all to authenticated
  using (trainer_id = auth.uid() and private.is_trainer())
  with check (
    trainer_id = auth.uid() and private.is_trainer()
    and (client_id is null or private.is_my_client(client_id))
  );

create policy "programs: client reads assigned"
  on public.programs for select to authenticated
  using (client_id is not null and private.is_me_as_client(client_id));

create policy "programs: superadmin all"
  on public.programs for all to authenticated
  using (private.is_superadmin()) with check (private.is_superadmin());

/* ---- program_days / program_steps: follow their program ---- */

create policy "program_days: read" on public.program_days for select to authenticated
  using (private.can_read_program(program_id));
create policy "program_days: insert" on public.program_days for insert to authenticated
  with check (private.can_write_program(program_id));
create policy "program_days: update" on public.program_days for update to authenticated
  using (private.can_write_program(program_id)) with check (private.can_write_program(program_id));
create policy "program_days: delete" on public.program_days for delete to authenticated
  using (private.can_write_program(program_id));

create policy "program_steps: read" on public.program_steps for select to authenticated
  using (private.can_read_program(private.program_of_day(day_id)));
create policy "program_steps: insert" on public.program_steps for insert to authenticated
  with check (private.can_write_program(private.program_of_day(day_id)));
create policy "program_steps: update" on public.program_steps for update to authenticated
  using (private.can_write_program(private.program_of_day(day_id)))
  with check (private.can_write_program(private.program_of_day(day_id)));
create policy "program_steps: delete" on public.program_steps for delete to authenticated
  using (private.can_write_program(private.program_of_day(day_id)));

/* ---- workout_sessions / workout_sets ---- */

create policy "workout_sessions: client manages own"
  on public.workout_sessions for all to authenticated
  using (private.is_me_as_client(client_id))
  with check (private.is_me_as_client(client_id) and private.day_in_program(day_id, program_id));

create policy "workout_sessions: trainer reads clients'"
  on public.workout_sessions for select to authenticated
  using (private.is_my_client(client_id));

create policy "workout_sessions: superadmin all"
  on public.workout_sessions for all to authenticated
  using (private.is_superadmin()) with check (private.is_superadmin());

create policy "workout_sets: read" on public.workout_sets for select to authenticated
  using (private.can_read_session(session_id));
create policy "workout_sets: insert" on public.workout_sets for insert to authenticated
  with check (private.can_write_session(session_id));
create policy "workout_sets: update" on public.workout_sets for update to authenticated
  using (private.can_write_session(session_id)) with check (private.can_write_session(session_id));
create policy "workout_sets: delete" on public.workout_sets for delete to authenticated
  using (private.can_write_session(session_id));

/* ---- exercise_requests ---- */

create policy "exercise_requests: trainer asks"
  on public.exercise_requests for insert to authenticated
  with check (
    requested_by = auth.uid() and status = 'pending'
    and (private.is_trainer() or private.is_superadmin())
  );

create policy "exercise_requests: read own or as curator"
  on public.exercise_requests for select to authenticated
  using (requested_by = auth.uid() or private.is_catalog_curator());

create policy "exercise_requests: curator resolves"
  on public.exercise_requests for update to authenticated
  using (private.is_catalog_curator()) with check (private.is_catalog_curator());

/* ------------------------------------------------------------------ */
/* 4. Functions the app calls (supabase.rpc)                           */
/* ------------------------------------------------------------------ */

-- A fresh one-use token: two random UUIDs, 244 random bits.
create function private.new_invitation_token() returns text
language sql volatile set search_path = '' as $$
  select replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
$$;

create function private.hash_invitation_token(p_token text) returns bytea
language sql immutable set search_path = '' as $$
  select sha256(convert_to(p_token, 'UTF8'))
$$;

/*
 * A trainer (or the superadmin) gets a link for one of their clients.
 * Any earlier unused link for that client stops working. Returns the token;
 * the app builds the URL (…/invite/<token>) and the trainer sends it.
 */
create function public.create_client_invitation(p_client_id uuid) returns text
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_client public.clients;
  v_token text := private.new_invitation_token();
begin
  select * into v_client from public.clients where id = p_client_id;
  if not found or not (private.is_my_client(p_client_id) or private.is_superadmin()) then
    raise exception 'client not found' using errcode = 'P0002';
  end if;
  if v_client.user_id is not null then
    raise exception 'client already has an account' using errcode = 'P0001';
  end if;

  update public.invitations set revoked_at = now()
    where client_id = p_client_id and accepted_at is null and revoked_at is null;

  insert into public.invitations (token_hash, role, client_id, email, invited_by)
    values (private.hash_invitation_token(v_token), 'client', p_client_id, v_client.email, auth.uid());
  return v_token;
end;
$$;

-- The superadmin gets a link that turns whoever accepts it into a trainer.
create function public.create_trainer_invitation(p_email text default null) returns text
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_token text := private.new_invitation_token();
begin
  if not private.is_superadmin() then
    raise exception 'only the superadmin invites trainers' using errcode = '42501';
  end if;
  insert into public.invitations (token_hash, role, email, invited_by)
    values (private.hash_invitation_token(v_token), 'trainer', p_email, auth.uid());
  return v_token;
end;
$$;

create function public.revoke_invitation(p_invitation_id uuid) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  update public.invitations set revoked_at = now()
    where id = p_invitation_id and accepted_at is null and revoked_at is null
      and ((invited_by = auth.uid() and private.current_app_role() is not null) or private.is_superadmin());
end;
$$;

/*
 * Called right after the person logs in from the link (email code).
 * Client link: links this login to the trainer's clients row.
 * Trainer link: turns this login into a trainer (a superadmin stays one).
 * Returns { role, client_id }. Fails the same way for an unknown, used,
 * revoked or expired token, so the error says nothing about which.
 */
create function public.accept_invitation(p_token text) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_inv public.invitations;
  v_me uuid := auth.uid();
begin
  if private.current_app_role() is null then
    raise exception 'not logged in' using errcode = '42501';
  end if;

  select * into v_inv from public.invitations
    where token_hash = private.hash_invitation_token(p_token)
      and accepted_at is null and revoked_at is null and expires_at > now()
    for update;
  if not found then
    raise exception 'invitation invalid or expired' using errcode = 'P0001';
  end if;

  if v_inv.role = 'client' then
    if exists (
      select 1 from public.clients c
      where c.user_id = v_me
        and c.trainer_id = (select trainer_id from public.clients where id = v_inv.client_id)
    ) then
      raise exception 'already a client of this trainer' using errcode = 'P0001';
    end if;
    update public.clients set user_id = v_me where id = v_inv.client_id and user_id is null;
    if not found then
      raise exception 'invitation invalid or expired' using errcode = 'P0001';
    end if;
  else
    update public.profiles set role = 'trainer' where id = v_me and role = 'client';
  end if;

  update public.invitations set accepted_at = now(), accepted_by = v_me where id = v_inv.id;
  return jsonb_build_object('role', v_inv.role, 'client_id', v_inv.client_id);
end;
$$;

/*
 * Copies a routine to one or more clients in one go (all or nothing).
 * p_overrides changes values per client and per step of the original:
 *   { "<client id>": { "<step id>": { "sets": 4, "reps": "8", "load_kg": 40 } } }
 * Accepted keys: sets, reps, load_kg, secs, rest_sec, tempo, note, prescription_text.
 * Runs as the caller (SECURITY INVOKER), so the policies above decide:
 * a trainer can only copy their own routines to their own clients.
 * Returns the ids of the new routines, in the order of p_client_ids.
 */
create function public.assign_program(
  p_program_id uuid,
  p_client_ids uuid[],
  p_overrides jsonb default '{}'
) returns uuid[]
language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_src public.programs;
  v_day public.program_days;
  v_client uuid;
  v_new_program uuid;
  v_new_day uuid;
  v_result uuid[] := '{}';
begin
  select * into v_src from public.programs where id = p_program_id;
  if not found then
    raise exception 'program not found' using errcode = 'P0002';
  end if;

  foreach v_client in array p_client_ids loop
    insert into public.programs (trainer_id, client_id, source_program_id, name, focus, discipline)
      values (v_src.trainer_id, v_client, v_src.id, v_src.name, v_src.focus, v_src.discipline)
      returning id into v_new_program;

    for v_day in select * from public.program_days where program_id = v_src.id order by position loop
      insert into public.program_days (program_id, position, name, focus)
        values (v_new_program, v_day.position, v_day.name, v_day.focus)
        returning id into v_new_day;

      insert into public.program_steps (
        day_id, position, exercise_ids, vuelta, note,
        sets, reps, load_kg, secs, rest_sec, tempo, prescription_text
      )
      select
        v_new_day, s.position, s.exercise_ids, s.vuelta,
        coalesce(o.v ->> 'note', s.note),
        coalesce((o.v ->> 'sets')::int, s.sets),
        coalesce(o.v ->> 'reps', s.reps),
        coalesce((o.v ->> 'load_kg')::numeric, s.load_kg),
        coalesce((o.v ->> 'secs')::int, s.secs),
        coalesce((o.v ->> 'rest_sec')::int, s.rest_sec),
        coalesce(o.v ->> 'tempo', s.tempo),
        coalesce(o.v ->> 'prescription_text', s.prescription_text)
      from public.program_steps s
      cross join lateral (select p_overrides -> v_client::text -> s.id::text as v) o
      where s.day_id = v_day.id;
    end loop;

    v_result := v_result || v_new_program;
  end loop;

  return v_result;
end;
$$;

/*
 * The superadmin's switches on a user. Null leaves a field as it is.
 * The superadmin cannot disable or demote themselves by accident.
 */
create function public.admin_update_profile(
  p_user_id uuid,
  p_role public.app_role default null,
  p_disabled boolean default null,
  p_can_curate_catalog boolean default null
) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  if not private.is_superadmin() then
    raise exception 'only the superadmin' using errcode = '42501';
  end if;
  if p_user_id = auth.uid() and (coalesce(p_role <> 'superadmin', false) or coalesce(p_disabled, false)) then
    raise exception 'cannot demote or disable yourself' using errcode = 'P0001';
  end if;
  update public.profiles set
    role = coalesce(p_role, role),
    disabled_at = case when p_disabled is null then disabled_at
                       when p_disabled then coalesce(disabled_at, now())
                       else null end,
    can_curate_catalog = coalesce(p_can_curate_catalog, can_curate_catalog)
  where id = p_user_id;
end;
$$;

/* ---- Function privileges ---- */

-- Postgres lets everyone execute new functions; only logged-in users may
-- call these, and the trigger functions are not part of the API.
revoke execute on all functions in schema public from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon;
grant execute on function
  public.create_client_invitation(uuid),
  public.create_trainer_invitation(text),
  public.revoke_invitation(uuid),
  public.accept_invitation(text),
  public.assign_program(uuid, uuid[], jsonb),
  public.admin_update_profile(uuid, public.app_role, boolean, boolean)
to authenticated;
-- The policies run as the user, so the helpers they call must be executable too.
grant execute on function
  private.current_app_role(),
  private.is_superadmin(),
  private.is_trainer(),
  private.is_catalog_curator(),
  private.is_my_client(uuid),
  private.is_me_as_client(uuid),
  private.can_read_program(uuid),
  private.can_write_program(uuid),
  private.program_of_day(uuid),
  private.day_in_program(uuid, uuid),
  private.can_read_session(uuid),
  private.can_write_session(uuid)
to authenticated;
