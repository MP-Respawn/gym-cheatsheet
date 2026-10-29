/*
 * auth.js
 *
 * Who is signed in, and the sign-in itself. People never have a password:
 *   1. sendCode(email)       Supabase emails a one-time code
 *   2. verifyCode(email, c)  the code typed in the app signs them in
 * Only someone a trainer invited can create an account. The first time, the
 * invitation link signs a new email in with no code (enterWithInvitation);
 * an email that already has an account still gets a code. The normal
 * sign-in never creates accounts, so an unknown email gets a clear "ask your
 * trainer for the link" instead.
 *
 * When the person changes (sign-in, sign-out, a login restored on open),
 * storage switches to their box and remote.js downloads their data.
 *
 * Screens read the state with useAuth() (useStore.js):
 *   { status: "loading" | "signed-out" | "signed-in", user }
 */
import { refreshAll } from "./remote.js";
import { setStorageUser } from "./storage.js";
import { supabase } from "./supabase.js";

let state = { status: "loading", user: null };
const listeners = new Set();

export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getAuth = () => state;

/*
 * The login saved on this phone, read directly. Opening the app without
 * signal after the token expired (it lasts an hour), Supabase cannot renew
 * it and reports "nobody" at start, but it keeps the login saved (it only
 * deletes it when the server rejects it). So the person stays signed in with
 * the phone's copy, and Supabase renews the token when the signal returns.
 */
function savedUser() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(supabase.auth.storageKey) ?? "null");
    return saved?.user ?? null;
  } catch {
    return null;
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  const user = session?.user ?? (event === "INITIAL_SESSION" ? savedUser() : null);
  const changed = user?.id !== state.user?.id;
  // A token refresh brings the same person back: nothing to redo.
  if (!changed && state.status !== "loading") return;
  setStorageUser(user?.id ?? null);
  state = { status: user ? "signed-in" : "signed-out", user };
  listeners.forEach((listener) => listener());
  // Supabase asks not to call it again from inside this callback.
  if (user) setTimeout(() => refreshAll(user.id), 0);
  if (user) keepStorage();
});

/*
 * Asks the browser not to clear this site's storage to make room (the
 * phone's copy of the routines and of workouts not uploaded yet). Installed
 * apps usually get it; elsewhere the browser may say no, and nothing changes.
 */
let askedToKeep = false;
function keepStorage() {
  if (askedToKeep || !navigator.storage?.persist) return;
  askedToKeep = true;
  navigator.storage.persist().catch(() => {});
}

// Keep the phone's copy fresh: when the signal comes back, and when the app
// comes back to the screen (at most once a minute).
let lastRefresh = 0;
function refreshSoon() {
  if (!state.user || Date.now() - lastRefresh < 60_000) return;
  lastRefresh = Date.now();
  refreshAll(state.user.id);
}
if (typeof window !== "undefined") {
  window.addEventListener("online", () => state.user && refreshAll(state.user.id));
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && refreshSoon());
}

/* ---- Signing in ---- */

// Supabase's errors, said the way the app speaks.
function friendly(error) {
  const code = error?.code ?? "";
  const message = error?.message ?? "";
  if (!navigator.onLine || error instanceof TypeError) return "Sin conexión. Probá de nuevo cuando tengas señal.";
  if (code === "otp_disabled" || /signups not allowed/i.test(message)) {
    return "Ese email no tiene cuenta. Pedile a tu entrenador el link de invitación y entrá desde ahí.";
  }
  if (code === "email_address_not_authorized") {
    return "Todavía no podemos mandar emails a esa dirección. Avisale a tu entrenador.";
  }
  if (error?.status === 429 || /rate limit/i.test(message)) {
    return "Pediste muchos códigos seguidos. Esperá unos minutos y probá de nuevo.";
  }
  if (code === "otp_expired" || /expired|invalid/i.test(message)) {
    return "El código no es correcto o ya venció. Revisalo o pedí uno nuevo.";
  }
  if (code === "email_address_invalid" || /invalid.*email|email.*invalid/i.test(message)) {
    return "Revisá el email: parece que no es válido.";
  }
  if (/sending/i.test(message)) return "No pudimos mandar el email. Probá de nuevo en un rato.";
  return "Algo salió mal. Probá de nuevo en un rato.";
}

// Emails a sign-in code. Returns null when sent, or a message to show.
export async function sendCode(email, { newAccount = false } = {}) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: newAccount },
    });
    return error ? friendly(error) : null;
  } catch (error) {
    return friendly(error);
  }
}

// Signs in with the emailed code. Returns null when signed in, or a message.
export async function verifyCode(email, code) {
  try {
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    return error ? friendly(error) : null;
  } catch (error) {
    return friendly(error);
  }
}

/*
 * The first sign-in from an invitation link, with no code: the
 * invite-sign-in function creates the account and returns a one-use sign-in
 * token, which opens the session right here. Returns:
 *   { signedIn: true }        the session is open (Invitation.jsx then
 *                             accepts the invitation, as with a code)
 *   { existing: true }        that email already has an account: a code was
 *                             emailed instead, to check it is theirs
 *   { problem: "..." }        a message to show
 */
export async function enterWithInvitation(token, email) {
  try {
    const { data, error } = await supabase.functions.invoke("invite-sign-in", { body: { token, email: email.trim() } });
    if (error) {
      let problem = "Algo salió mal. Probá de nuevo en un rato.";
      try {
        problem = (await error.context?.json())?.error ?? problem;
      } catch {
        problem = friendly(error);
      }
      return { problem };
    }
    if (data?.existing) {
      const problem = await sendCode(email, { newAccount: true });
      return problem ? { problem } : { existing: true };
    }
    const { error: openError } = await supabase.auth.verifyOtp({ token_hash: data.token_hash, type: "email" });
    return openError ? { problem: friendly(openError) } : { signedIn: true };
  } catch (error) {
    return { problem: friendly(error) };
  }
}

export async function signOut() {
  await supabase.auth.signOut();
}

/* ---- Invitations ---- */

/*
 * Accepts a trainer's link for the signed-in person (see
 * accept_invitation in the database). Returns null on success, or a message.
 */
export async function acceptInvitation(token) {
  try {
    const { error } = await supabase.rpc("accept_invitation", { p_token: token });
    if (!error) {
      await refreshAll(state.user.id);
      return null;
    }
    if (/already a client/i.test(error.message)) return "Ya sos cliente de este entrenador: tus rutinas están en Rutinas.";
    return "Este link ya se usó o venció. Pedile uno nuevo a tu entrenador.";
  } catch {
    return "Sin conexión. Probá de nuevo cuando tengas señal.";
  }
}
