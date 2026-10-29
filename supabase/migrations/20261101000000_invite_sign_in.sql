/*
 * 20261101000000_invite_sign_in.sql
 *
 * Signing in straight from an invitation link, with no email code the first
 * time (supabase/functions/invite-sign-in). That function, which runs with
 * the service role, first checks the link with open_invitation(): the
 * invitation behind a token, if it is still open (not used, not revoked, not
 * expired). Nobody else may call it: the app never sees invitations it did
 * not send (see accept_invitation for the rest of the flow).
 */
create function public.open_invitation(p_token text)
returns table (id uuid, role public.app_role, client_id uuid)
language sql stable security definer set search_path = '' as $$
  select i.id, i.role, i.client_id
  from public.invitations i
  where i.token_hash = private.hash_invitation_token(p_token)
    and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
$$;

revoke execute on function public.open_invitation(text) from public, anon, authenticated;
grant execute on function public.open_invitation(text) to service_role;
