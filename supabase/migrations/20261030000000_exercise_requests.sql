/*
 * 20261030000000_exercise_requests.sql
 *
 * "Pedir un ejercicio", stage 4. A coach asks for an exercise the catalog
 * does not have; you (or the coach who curates the catalog with you) add it
 * in code and mark the request "accepted" with the new exercise's id, or
 * "rejected", with a note for the coach. Emails go out through the
 * exercise-request-email function (supabase/functions/), which marks here
 * what it already sent so nothing is sent twice.
 */

alter table public.exercise_requests
  -- What you tell the coach when resolving ("Ya está", "Usá X en su lugar"...).
  add column resolution_note text not null default '',
  -- When you were emailed about the request / the coach about its answer.
  -- Written only by the email function (service role), never by the app.
  add column admin_notified_at     timestamptz,
  add column requester_notified_at timestamptz,
  add constraint exercise_requests_accepted_has_id
    check (status <> 'accepted' or resolved_exercise_id is not null);

create index exercise_requests_status_idx on public.exercise_requests (status, created_at desc);

/*
 * Who resolved it and when, filled in by the database, not the app. A new
 * answer (or going back to pending) means the coach has not been told yet.
 */
create function private.stamp_request_resolution() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'pending' then
      new.resolved_by := null;
      new.resolved_at := null;
    else
      new.resolved_by := auth.uid();
      new.resolved_at := now();
    end if;
    new.requester_notified_at := null;
  end if;
  return new;
end;
$$;

create trigger exercise_requests_resolution before update on public.exercise_requests
  for each row execute function private.stamp_request_resolution();

-- The app writes only these columns; the rest come from defaults, the
-- trigger above, or the email function.
revoke insert, update, delete on public.exercise_requests from authenticated;
grant insert (name, description, video_url) on public.exercise_requests to authenticated;
grant update (status, resolved_exercise_id, resolution_note) on public.exercise_requests to authenticated;

-- The coach who curates the catalog sees who asked (the superadmin already sees everyone).
create policy "profiles: curators read who asked for exercises"
  on public.profiles for select to authenticated
  using (
    private.is_catalog_curator()
    and exists (select 1 from public.exercise_requests r where r.requested_by = profiles.id)
  );
