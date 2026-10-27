/*
 * admin.js
 *
 * The superadmin's side of the database (the coaches: invite, turn off,
 * let one curate the catalog) and the "Pedir un ejercicio" requests (a
 * coach asks; you, or the coach who curates with you, answer).
 *
 * Reads go through the same cache as the coach's screens (useQuery in
 * trainer.js). Keys: "coaches", "coach-invitations", "requests".
 * The database enforces who may do what (see the migrations); the app only
 * shows each person their buttons.
 */
import { getAuth } from "./auth.js";
import { supabase } from "./supabase.js";
import { invalidate, inviteUrl, must } from "./trainer.js";

const me = () => getAuth().user?.id;

/* ---- Coaches (superadmin) ---- */

// Every coach (and you), by name, with how many clients they have.
export const fetchCoaches = async () =>
  must(
    await supabase
      .from("profiles")
      .select("id, email, full_name, role, disabled_at, can_curate_catalog, created_at, clients!clients_trainer_id_fkey(count)")
      .in("role", ["trainer", "superadmin"])
      .order("full_name"),
  );

// Coach invitation links you made that nobody used yet and are still valid.
export const fetchCoachInvitations = async () =>
  must(
    await supabase
      .from("invitations")
      .select("id, email, created_at, expires_at")
      .eq("role", "trainer")
      .is("accepted_at", null)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false }),
  );

// A link that makes whoever opens it (and signs in) a coach. Returns the link.
export async function inviteCoach(email) {
  const token = must(await supabase.rpc("create_trainer_invitation", { p_email: email.trim() || null }));
  invalidate("coach-invitations");
  return inviteUrl(token, "?rol=entrenador");
}

export async function revokeInvitation(id) {
  must(await supabase.rpc("revoke_invitation", { p_invitation_id: id }));
  invalidate("coach-invitations");
}

// Turns a coach off (they keep their data but can do nothing) or back on.
export async function setCoachDisabled(userId, disabled) {
  must(await supabase.rpc("admin_update_profile", { p_user_id: userId, p_disabled: disabled }));
  invalidate("coaches");
}

// Lets a coach see and answer the exercise requests with you.
export async function setCurator(userId, curator) {
  must(await supabase.rpc("admin_update_profile", { p_user_id: userId, p_can_curate_catalog: curator }));
  invalidate("coaches");
}

/* ---- Exercise requests ---- */

/*
 * The requests this person can see: their own (a coach), or everybody's
 * (you and the curator), newest first, with who asked.
 */
export const fetchRequests = async () =>
  must(
    await supabase
      .from("exercise_requests")
      .select(
        "id, name, description, video_url, status, resolved_exercise_id, resolution_note, resolved_at, created_at, requested_by, profiles!exercise_requests_requested_by_fkey(full_name, email)",
      )
      .order("created_at", { ascending: false }),
  );

// Asks the email function to send what is due. Its failure never blocks the
// request or the answer (they are saved); the next call sends it.
async function sendEmails() {
  try {
    await supabase.functions.invoke("exercise-request-email", { body: {} });
  } catch (e) {
    console.error("No se pudo mandar el email del pedido", e);
  }
}

export async function requestExercise({ name, description, videoUrl }) {
  must(
    await supabase.from("exercise_requests").insert({
      name: name.trim(),
      description: description.trim(),
      video_url: videoUrl.trim() || null,
    }),
  );
  invalidate("requests");
  sendEmails();
}

/*
 * Answers a request: "accepted" with the id of the exercise you added to
 * the catalog, or "rejected"; `note` goes to the coach in the email.
 */
export async function resolveRequest(id, { status, exerciseId = null, note = "" }) {
  must(
    await supabase
      .from("exercise_requests")
      .update({ status, resolved_exercise_id: status === "accepted" ? exerciseId : null, resolution_note: note.trim() })
      .eq("id", id),
  );
  invalidate("requests");
  sendEmails();
}

// Whether a request is this person's own (to tell "your requests" from the inbox).
export const isMine = (request) => request.requested_by === me();
