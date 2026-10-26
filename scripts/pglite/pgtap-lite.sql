/*
 * pgtap-lite.sql
 *
 * The handful of pgTAP functions the tests in supabase/tests use (plan, ok,
 * is, lives_ok, throws_ok, finish), for running them in PGlite, which has
 * no pgTAP. Same names, arguments and "ok N - description" output, so the
 * same test files also run unchanged with `supabase test db`.
 *
 * Loaded by scripts/test-db.mjs after the migrations.
 */

-- Test numbers. A sequence, so a test that fails inside a rolled-back
-- subtransaction still uses up its number.
create sequence tap_seq;

create function plan(n int) returns text
language plpgsql as $$
begin
  perform setval('tap_seq', 1, false);
  perform set_config('tap.planned', n::text, false);
  return '1..' || n;
end;
$$;

create function ok(pass boolean, descr text default '') returns text
language sql as $$
  select case when coalesce(pass, false) then '' else 'not ' end
    || 'ok ' || nextval('tap_seq') || ' - ' || descr
$$;

create function "is"(have anyelement, want anyelement, descr text default '') returns text
language sql as $$
  select ok(have is not distinct from want, descr)
    || case when have is not distinct from want then ''
            else E'\n#   have: ' || coalesce(have::text, 'NULL') || E'\n#   want: ' || coalesce(want::text, 'NULL') end
$$;

create function lives_ok(sql text, descr text default '') returns text
language plpgsql as $$
begin
  execute sql;
  return ok(true, descr);
exception when others then
  return ok(false, descr) || E'\n#   died: ' || sqlstate || ': ' || sqlerrm;
end;
$$;

-- errmsg null = only the error code is checked (as in pgTAP).
create function throws_ok(sql text, errcode text, errmsg text, descr text) returns text
language plpgsql as $$
begin
  execute sql;
  return ok(false, descr) || E'\n#   no exception thrown';
exception when others then
  if sqlstate = errcode and (errmsg is null or sqlerrm = errmsg) then
    return ok(true, descr);
  end if;
  return ok(false, descr) || E'\n#   caught: ' || sqlstate || ': ' || sqlerrm
    || E'\n#   wanted: ' || errcode || coalesce(': ' || errmsg, '');
end;
$$;

create function finish() returns setof text
language plpgsql as $$
declare
  planned int := nullif(current_setting('tap.planned', true), '')::int;
  ran int := (select last_value from tap_seq) - case when (select is_called from tap_seq) then 0 else 1 end;
begin
  if planned is not null and planned <> ran then
    return next '# Looks like you planned ' || planned || ' tests but ran ' || ran;
  end if;
end;
$$;
