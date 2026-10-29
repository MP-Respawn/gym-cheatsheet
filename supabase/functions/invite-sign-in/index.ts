/*
 * invite-sign-in: the first sign-in from an invitation link, with no email code.
 *
 * The coach's link is already a secret, one-use key that expires in 7 days,
 * so the first time it is enough to open it, type an email and tap
 * "Entrar": this function creates the account and hands the app a one-use
 * sign-in token (no email is sent). The app opens the session with it
 * (verifyOtp) and then accepts the invitation as before (accept_invitation),
 * which links the account to the coach. From another phone, later, the
 * person signs in with the usual email code.
 *
 * Only for emails WITHOUT an account. An email that already has one (a client
 * of another coach, a coach, the superadmin) gets { existing: true } and the
 * app asks for the usual email code: otherwise anyone holding an invitation
 * link could sign in as someone else by typing their email.
 *
 * What it gives up: the first time, nobody checks that the email is theirs.
 * A typo means they can't sign in from another phone later, so the app asks
 * them to check it.
 *
 * Request: { token, email }. Answers: { token_hash } | { existing: true } |
 * { error } (400 for a used, revoked or expired link).
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
 * Deploy: npx supabase functions deploy invite-sign-in --use-api
 */
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const LINK_GONE = "Este link ya se usó o venció. Pedile uno nuevo a quien te invitó.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!token) return json({ error: LINK_GONE }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ error: "Revisá el email: parece que no es válido." }, 400);
  }

  // 1. The link must be an open invitation.
  const { data: invitation, error: lookupError } = await db.rpc("open_invitation", { p_token: token }).maybeSingle();
  if (lookupError) {
    console.error(lookupError);
    return json({ error: "No pudimos revisar el link. Probá de nuevo en un rato." }, 500);
  }
  if (!invitation) return json({ error: LINK_GONE }, 400);

  // 2. A new account only. An email that already has one signs in with a code.
  const { error: createError } = await db.auth.admin.createUser({ email, email_confirm: true });
  if (createError) {
    if (createError.code === "email_exists" || /already (been )?registered/i.test(createError.message)) {
      return json({ existing: true });
    }
    console.error(createError);
    return json({ error: "No pudimos crear la cuenta. Probá de nuevo en un rato." }, 500);
  }

  // 3. A one-use sign-in token for that account (nothing is emailed).
  const { data: link, error: linkError } = await db.auth.admin.generateLink({ type: "magiclink", email });
  if (linkError || !link?.properties?.hashed_token) {
    console.error(linkError);
    return json({ error: "La cuenta quedó creada, pero no pudimos abrir la sesión. Entrá con el código por email." }, 500);
  }
  return json({ token_hash: link.properties.hashed_token });
});
