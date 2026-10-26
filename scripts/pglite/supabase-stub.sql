/*
 * supabase-stub.sql
 *
 * The few pieces of a Supabase database the migrations rely on, so
 * scripts/test-db.mjs can run them in PGlite (Postgres inside Node, no
 * Docker): the API roles, auth.users, auth.uid(), and Supabase's default
 * grants (every new table and function in public is open to anon and
 * authenticated until a migration revokes it, exactly like on Supabase).
 *
 * Never applied to a real Supabase project: there these already exist.
 */

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;

create table auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text
);

-- Same body as Supabase's: the user id from the request's JWT claims.
create function auth.uid() returns uuid
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
grant execute on function auth.uid() to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
