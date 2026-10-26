/*
 * permissions.test.sql
 *
 * Walks the whole life of the app as each role and checks the database
 * allows exactly what it should: the superadmin invites a trainer, the
 * trainer creates clients and routines and assigns them, a client accepts
 * the link, reads the routine and logs a workout... and every forbidden
 * move fails.
 *
 * Run with `npm run test:db` (PGlite, no Docker) or `supabase test db`.
 * Everything runs inside one transaction that is rolled back at the end.
 *
 * Fixed ids, so the steps can refer to each other:
 *   a0…  superadmin          b1… trainer 1        b2… trainer 2
 *   c1…  client login 1      c2… client login 2
 *   d1…  trainer 1's client "Ana"   d2… trainer 1's client "Beto"
 *   d3…  trainer 2's client "Caro"
 *   e1…  trainer 1's template routine, f1… its day, 51…/52… its steps
 *   5e…  Ana's workout session, 5e1… one set
 */
begin;
create extension if not exists pgtap with schema extensions;

select plan(41);

/* ---- Test helpers (rolled back with everything else) ---- */

create schema tests;
grant usage on schema tests to authenticated;

-- Act as this user from now on, as the Supabase API would with their JWT.
create function tests.login(p_user uuid) returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_user, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);
end;
$$;
grant execute on function tests.login(uuid) to authenticated;

-- Invitation links handed from one user to the next.
create table tests.tokens (name text primary key, token text not null);
grant all on tests.tokens to authenticated;

/* ---- Six logins (the trigger gives each a "client" profile) ---- */

insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000000', 'admin@test'),
  ('b1000000-0000-0000-0000-000000000000', 'trainer1@test'),
  ('b2000000-0000-0000-0000-000000000000', 'trainer2@test'),
  ('c1000000-0000-0000-0000-000000000000', 'ana@test'),
  ('c2000000-0000-0000-0000-000000000000', 'beto@test');
-- The superadmin is set by hand once (see README).
update public.profiles set role = 'superadmin' where id = 'a0000000-0000-0000-0000-000000000000';

/* ---- Superadmin invites trainer 1 ---- */

select tests.login('a0000000-0000-0000-0000-000000000000');
insert into tests.tokens select 'trainer1', public.create_trainer_invitation('trainer1@test');
select lives_ok(
  $$ select public.admin_update_profile('b2000000-0000-0000-0000-000000000000', 'trainer') $$,
  'superadmin turns trainer 2 into a trainer directly'
);
select throws_ok(
  $$ select public.admin_update_profile('a0000000-0000-0000-0000-000000000000', p_disabled => true) $$,
  'P0001', null, 'superadmin cannot disable themselves'
);

select tests.login('b1000000-0000-0000-0000-000000000000');
select throws_ok(
  $$ select public.create_trainer_invitation() $$,
  '42501', null, 'a client cannot invite trainers'
);
select "is"(
  public.accept_invitation((select token from tests.tokens where name = 'trainer1')) ->> 'role',
  'trainer', 'trainer 1 accepts the link'
);
select "is"(
  (select role::text from public.profiles where id = auth.uid()),
  'trainer', 'trainer 1 is now a trainer'
);
select throws_ok(
  $$ select public.accept_invitation((select token from tests.tokens where name = 'trainer1')) $$,
  'P0001', null, 'a used link does not work again'
);
select throws_ok(
  $$ update public.profiles set role = 'superadmin' where id = auth.uid() $$,
  '42501', null, 'nobody changes their own role'
);

/* ---- Trainers create clients ---- */

select lives_ok(
  $$ insert into public.clients (id, trainer_id, full_name, email) values
       ('d1000000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 'Ana', 'ana@test'),
       ('d2000000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 'Beto', 'beto@test') $$,
  'trainer 1 creates two clients'
);
select throws_ok(
  $$ insert into public.clients (trainer_id, full_name)
       values ('b2000000-0000-0000-0000-000000000000', 'Intruso') $$,
  '42501', null, 'trainer 1 cannot create a client for trainer 2'
);

select tests.login('b2000000-0000-0000-0000-000000000000');
select lives_ok(
  $$ insert into public.clients (id, trainer_id, full_name)
       values ('d3000000-0000-0000-0000-000000000000', 'b2000000-0000-0000-0000-000000000000', 'Caro') $$,
  'trainer 2 creates a client'
);
select "is"((select count(*)::int from public.clients), 1, 'trainer 2 only sees their own client');

/* ---- Trainer 1 builds a routine and assigns it ---- */

select tests.login('b1000000-0000-0000-0000-000000000000');
select lives_ok(
  $$
    insert into public.programs (id, trainer_id, name)
      values ('e1000000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 'Bloque A');
    insert into public.program_days (id, program_id, position, name)
      values ('f1000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000000', 0, 'Día 1');
    insert into public.program_steps (id, day_id, position, exercise_ids, sets, reps, load_kg) values
      ('51000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000000', 0,
       '{sentadilla-barra}', 3, '6-8', 40);
    insert into public.program_steps (id, day_id, position, vuelta) values
      ('52000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000000', 1, 'pelota');
  $$,
  'trainer 1 creates a template with one day and two steps'
);
select throws_ok(
  $$ insert into public.program_steps (day_id, exercise_ids, vuelta)
       values ('f1000000-0000-0000-0000-000000000000', '{sentadilla-barra}', 'pelota') $$,
  '23514', null, 'a step is either exercises or a vuelta, not both'
);
select "is"(
  cardinality(public.assign_program(
    'e1000000-0000-0000-0000-000000000000',
    '{d1000000-0000-0000-0000-000000000000,d2000000-0000-0000-0000-000000000000}',
    '{"d1000000-0000-0000-0000-000000000000": {"51000000-0000-0000-0000-000000000000": {"sets": 4, "load_kg": 50}}}'
  )),
  2, 'trainer 1 assigns the template to Ana and Beto'
);
select "is"(
  (select array[s.sets::numeric, s.load_kg] from public.program_steps s
     join public.program_days d on d.id = s.day_id
     join public.programs p on p.id = d.program_id
   where p.client_id = 'd1000000-0000-0000-0000-000000000000' and s.position = 0),
  array[4, 50]::numeric[], 'Ana''s copy has her own sets and kilos'
);
select "is"(
  (select array[s.sets::numeric, s.load_kg] from public.program_steps s
     join public.program_days d on d.id = s.day_id
     join public.programs p on p.id = d.program_id
   where p.client_id = 'd2000000-0000-0000-0000-000000000000' and s.position = 0),
  array[3, 40]::numeric[], 'Beto''s copy keeps the template values'
);
select throws_ok(
  $$ select public.assign_program('e1000000-0000-0000-0000-000000000000', '{d3000000-0000-0000-0000-000000000000}') $$,
  '42501', null, 'trainer 1 cannot assign to trainer 2''s client'
);

select tests.login('b2000000-0000-0000-0000-000000000000');
select "is"((select count(*)::int from public.programs), 0, 'trainer 2 sees none of trainer 1''s routines');
select throws_ok(
  $$ select public.assign_program('e1000000-0000-0000-0000-000000000000', '{d3000000-0000-0000-0000-000000000000}') $$,
  'P0002', null, 'trainer 2 cannot copy trainer 1''s template'
);

/* ---- Ana accepts her link ---- */

select tests.login('b1000000-0000-0000-0000-000000000000');
insert into tests.tokens select 'ana', public.create_client_invitation('d1000000-0000-0000-0000-000000000000');

select tests.login('c1000000-0000-0000-0000-000000000000');
select "is"(
  public.accept_invitation((select token from tests.tokens where name = 'ana')) ->> 'client_id',
  'd1000000-0000-0000-0000-000000000000', 'Ana accepts her link'
);

select tests.login('c2000000-0000-0000-0000-000000000000');
select throws_ok(
  $$ select public.accept_invitation((select token from tests.tokens where name = 'ana')) $$,
  'P0001', null, 'Beto cannot reuse Ana''s link'
);

/* ---- Ana reads, but cannot change, her routine ---- */

select tests.login('c1000000-0000-0000-0000-000000000000');
select "is"(
  (select array_agg(client_id::text) from public.programs),
  array['d1000000-0000-0000-0000-000000000000'], 'Ana sees only her own routine (not the template, not Beto''s)'
);
select "is"((select count(*)::int from public.program_steps), 2, 'Ana sees the steps of her routine');
update public.program_steps set load_kg = 200;
select "is"(
  (select max(load_kg) from public.program_steps), 50::numeric(6, 2), 'Ana''s attempt to change her kilos changes nothing'
);
select throws_ok(
  $$ insert into public.programs (trainer_id, name) values ('c1000000-0000-0000-0000-000000000000', 'Mi rutina') $$,
  '42501', null, 'Ana cannot create routines'
);
select throws_ok(
  $$ update public.clients set user_id = null $$,
  '42501', null, 'Ana cannot unlink or relink client records'
);
select throws_ok(
  $$ insert into public.exercise_requests (name) values ('Sentadilla búlgara') $$,
  '42501', null, 'clients cannot request exercises'
);

/* ---- Ana logs a workout ---- */

select lives_ok(
  $$
    insert into public.workout_sessions (id, client_id, program_id, day_id)
      select '5e000000-0000-0000-0000-000000000000', p.client_id, p.id, d.id
      from public.programs p join public.program_days d on d.program_id = p.id;
    insert into public.workout_sets (id, session_id, exercise_id, set_index, kg, reps)
      values ('5e100000-0000-0000-0000-000000000000', '5e000000-0000-0000-0000-000000000000', 'sentadilla-barra', 0, 50, 8);
  $$,
  'Ana logs a session with one set'
);
select throws_ok(
  $$ insert into public.workout_sessions (id, client_id)
       values (gen_random_uuid(), 'd2000000-0000-0000-0000-000000000000') $$,
  '42501', null, 'Ana cannot log a session as Beto'
);

-- The phone uploads the same session twice (a retry after a dropped
-- connection), once with a step the trainer has since deleted.
select lives_ok(
  $$
    select public.save_workout_session(jsonb_build_object(
      'id', '5e000000-0000-0000-0000-000000000000',
      'client_id', 'd1000000-0000-0000-0000-000000000000',
      'finished_at', now(),
      'sets', jsonb_build_array(jsonb_build_object(
        'entry_index', 0, 'set_index', 0, 'exercise_id', 'sentadilla-barra',
        'step_id', gen_random_uuid(), 'kg', 50, 'reps', 8))));
    select public.save_workout_session(jsonb_build_object(
      'id', '5e000000-0000-0000-0000-000000000000',
      'client_id', 'd1000000-0000-0000-0000-000000000000',
      'finished_at', now(),
      'sets', jsonb_build_array(jsonb_build_object(
        'entry_index', 0, 'set_index', 0, 'exercise_id', 'sentadilla-barra',
        'step_id', gen_random_uuid(), 'kg', 50, 'reps', 8))));
  $$,
  'Ana uploads the same session twice'
);
select "is"(
  (select count(*)::int from public.workout_sets where session_id = '5e000000-0000-0000-0000-000000000000'),
  1, 'uploading twice leaves one copy of each set'
);
select throws_ok(
  $$ select public.save_workout_session(jsonb_build_object(
       'id', gen_random_uuid(), 'client_id', 'd2000000-0000-0000-0000-000000000000')) $$,
  '42501', null, 'Ana cannot upload a session as Beto'
);

select tests.login('b1000000-0000-0000-0000-000000000000');
select "is"((select count(*)::int from public.workout_sets), 1, 'trainer 1 sees Ana''s log');
update public.workout_sets set kg = 999;
select "is"((select max(kg) from public.workout_sets), 50::numeric(6, 2), 'trainer 1 cannot edit Ana''s log');

select tests.login('b2000000-0000-0000-0000-000000000000');
select "is"((select count(*)::int from public.workout_sets), 0, 'trainer 2 does not see Ana''s log');

/* ---- Exercise requests ---- */

select tests.login('b1000000-0000-0000-0000-000000000000');
select lives_ok(
  $$ insert into public.exercise_requests (name, description) values ('Sentadilla búlgara', 'Con mancuernas') $$,
  'trainer 1 requests a new exercise'
);
update public.exercise_requests set status = 'accepted';
select "is"(
  (select status from public.exercise_requests), 'pending', 'trainer 1 cannot resolve their own request'
);

select tests.login('b2000000-0000-0000-0000-000000000000');
select "is"((select count(*)::int from public.exercise_requests), 0, 'trainer 2 does not see trainer 1''s request');

select tests.login('a0000000-0000-0000-0000-000000000000');
select lives_ok(
  $$ update public.exercise_requests set status = 'accepted', resolved_exercise_id = 'sentadilla-bulgara' $$,
  'the superadmin resolves the request'
);

/* ---- Disabling and logged-out access ---- */

select public.admin_update_profile('b1000000-0000-0000-0000-000000000000', p_disabled => true);
select tests.login('b1000000-0000-0000-0000-000000000000');
select "is"((select count(*)::int from public.clients), 0, 'a disabled trainer sees nothing');

reset role;
set local role anon;
select throws_ok(
  $$ select * from public.programs $$,
  '42501', null, 'logged-out visitors cannot read routines'
);

reset role;
select * from finish();
rollback;
