/*
 * trainer.js
 *
 * The trainer's side of the database: their clients, their routines, who
 * has each routine (with their own sets and kilos) and what each client
 * logged, plus the actions (new client, invitation link, save a routine,
 * assign, take away, archive).
 *
 * Unlike the client's data (storage.js keeps it for the gym, without
 * signal), this is read live: the trainer works from a desk or the phone
 * with signal. Reads go through useQuery(key, fetcher), a small cache:
 * every screen asking for the same key shares one request and one result,
 * and after a change invalidate(...) reloads the keys it touched.
 *
 * Keys: "clients", "routines", "program:<id>", "assignments:<program id>",
 * "client:<id>", "client-assignments:<id>", "client-sessions:<id>".
 */
import { useEffect, useSyncExternalStore } from "react";
import { getAuth, subscribeAuth } from "./auth.js";
import { newId } from "./storage.js";
import { supabase } from "./supabase.js";

/* ------------------------------------------------------------------ */
/* Read cache                                                          */
/* ------------------------------------------------------------------ */

const LOADING = { data: undefined, error: null, loading: true };
const entries = new Map(); // key -> { data, error, loading }
const fetchers = new Map(); // key -> the function that loads it
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function set(key, entry) {
  entries.set(key, entry);
  listeners.forEach((listener) => listener());
}

async function load(key) {
  const previous = entries.get(key);
  // Keep showing the old data while it reloads.
  set(key, { data: previous?.data, error: null, loading: true });
  try {
    set(key, { data: await fetchers.get(key)(), error: null, loading: false });
  } catch (error) {
    console.error(`No se pudo cargar ${key}`, error);
    set(key, { data: previous?.data, error: errorText(error), loading: false });
  }
}

/*
 * { data, error, loading } for `key`, loaded with `fetcher` the first time
 * a screen asks. A null key loads nothing (for a screen still waiting on
 * something else).
 */
export function useQuery(key, fetcher) {
  if (key) fetchers.set(key, fetcher);
  const entry = useSyncExternalStore(subscribe, () => (key ? entries.get(key) : null) ?? LOADING);
  useEffect(() => {
    if (key && !entries.has(key)) load(key);
  }, [key]);
  return entry;
}

// Reloads every cached key that starts with one of `prefixes`.
export function invalidate(...prefixes) {
  for (const key of entries.keys()) {
    if (prefixes.some((p) => key.startsWith(p)) && fetchers.has(key)) load(key);
  }
}

// When the signed-in person changes, forget everything: the next trainer
// must not see this one's data.
let cacheOwner = getAuth().user?.id;
subscribeAuth(() => {
  const user = getAuth().user?.id;
  if (user === cacheOwner) return;
  cacheOwner = user;
  entries.clear();
  listeners.forEach((listener) => listener());
});

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

// The database's errors, said the way the app speaks.
export function errorText(error) {
  if (!navigator.onLine || error instanceof TypeError) return "Sin conexión. Probá de nuevo cuando tengas señal.";
  if (error?.code === "42501") return "No tenés permiso para hacer eso.";
  return error?.message || "Algo salió mal. Probá de nuevo en un rato.";
}

// A Supabase answer: its data, or throws its error.
export function must({ data, error }) {
  if (error) throw error;
  return data;
}

const me = () => getAuth().user?.id;

/* ------------------------------------------------------------------ */
/* Reads (fetchers for useQuery)                                       */
/* ------------------------------------------------------------------ */

const STEP_SUMMARY = "program_days(id, position, name, program_steps(id, position, exercise_ids, vuelta))";
const FULL_PROGRAM = "*, program_days(*, program_steps(*))";

// Your clients, by name, each with their invitations.
export const fetchClients = async () =>
  must(
    await supabase
      .from("clients")
      .select("id, full_name, email, notes, user_id, archived_at, created_at, invitations(id, created_at, expires_at, accepted_at, revoked_at)")
      .eq("trainer_id", me())
      .order("full_name"),
  );

// Your routines, most recently edited first, each with who has it.
export const fetchRoutines = async () =>
  must(
    await supabase
      .from("programs")
      .select(
        `id, name, focus, discipline, updated_at, ${STEP_SUMMARY}, program_assignments(client_id, archived_at, clients(full_name, archived_at))`,
      )
      .eq("trainer_id", me())
      .is("archived_at", null)
      .order("updated_at", { ascending: false }),
  );

// The names of the clients who have a routine now (from fetchRoutines).
export function holders(routine) {
  return (routine.program_assignments ?? [])
    .filter((a) => !a.archived_at && a.clients && !a.clients.archived_at)
    .map((a) => a.clients.full_name)
    .sort((a, b) => a.localeCompare(b, "es"));
}

// One routine with every day and step (for the builder and the assign grid).
export const fetchProgram = (id) => async () =>
  must(await supabase.from("programs").select(FULL_PROGRAM).eq("id", id).single());

// Who has one routine (taken away included, marked), each with their own numbers.
export const fetchAssignments = (programId) => async () =>
  must(
    await supabase
      .from("program_assignments")
      .select("id, client_id, archived_at, assignment_steps(step_id, sets, reps, load_kg)")
      .eq("program_id", programId),
  );

export const fetchClient = (id) => async () =>
  must(
    await supabase
      .from("clients")
      .select("id, full_name, email, notes, user_id, archived_at, created_at, invitations(id, created_at, expires_at, accepted_at, revoked_at)")
      .eq("id", id)
      .single(),
  );

// The routines one client has, newest first; the ones taken away included (marked).
export const fetchClientAssignments = (id) => async () =>
  must(
    await supabase
      .from("program_assignments")
      .select(`id, program_id, archived_at, created_at, programs(id, name, focus, ${STEP_SUMMARY}, program_assignments(id, archived_at))`)
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  );

// One client's last 50 workouts with their sets, newest first.
export const fetchClientSessions = (id) => async () =>
  must(
    await supabase
      .from("workout_sessions")
      .select(
        "id, program_name, day_name, started_at, finished_at, workout_sets(entry_index, set_index, exercise_id, kg, reps, secs, planned_sets, planned_reps, planned_load_kg)",
      )
      .eq("client_id", id)
      .not("finished_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(50),
  );

/* ------------------------------------------------------------------ */
/* Invitations                                                         */
/* ------------------------------------------------------------------ */

// The link a client opens to join: this app's address + #/invitacion/<token>.
// `query` ("?rol=entrenador") only changes the wording of the sign-in page.
export function inviteUrl(token, query = "") {
  return `${window.location.origin}${window.location.pathname}#/invitacion/${token}${query}`;
}

/*
 * Where a client stands: "active" (has an account), "invited" (a link is
 * waiting, until `expiresAt`), "expired" (the link ran out or was
 * replaced) or "none" (never invited).
 */
export function inviteStatus(client) {
  if (client.user_id) return { state: "active" };
  const open = (client.invitations ?? []).find((i) => !i.accepted_at && !i.revoked_at);
  if (!open) return { state: "none" };
  if (new Date(open.expires_at) < new Date()) return { state: "expired" };
  return { state: "invited", expiresAt: open.expires_at };
}

// A new invitation link for a client (any earlier unused one stops working).
export async function newInvitation(clientId) {
  const token = must(await supabase.rpc("create_client_invitation", { p_client_id: clientId }));
  invalidate("clients", `client:${clientId}`);
  return inviteUrl(token);
}

/* ------------------------------------------------------------------ */
/* Clients                                                             */
/* ------------------------------------------------------------------ */

// Creates a client and their first invitation link. Returns { id, link }.
export async function createClient({ fullName, email }) {
  const id = newId();
  must(
    await supabase
      .from("clients")
      .insert({ id, trainer_id: me(), full_name: fullName.trim(), email: email.trim() || null }),
  );
  const link = await newInvitation(id);
  return { id, link };
}

// Archives a client (hidden from the list; their history stays) or brings them back.
export async function setClientArchived(id, archived) {
  must(
    await supabase
      .from("clients")
      .update({ archived_at: archived ? new Date().toISOString() : null })
      .eq("id", id),
  );
  invalidate("clients", `client:${id}`);
}

/* ------------------------------------------------------------------ */
/* Routines                                                            */
/* ------------------------------------------------------------------ */

/*
 * Saves a whole routine from the builder (save_program in the database:
 * all or nothing). `draft` = { id, name, focus, discipline,
 * days: [{ id, name, focus, steps: [...] }] }. Everyone who has the routine
 * sees the change. Returns its id.
 */
export async function saveProgram(draft) {
  const id = must(
    await supabase.rpc("save_program", {
      p_program: {
        id: draft.id,
        name: draft.name,
        focus: draft.focus,
        discipline: draft.discipline,
        days: draft.days.map((day) => ({
          id: day.id,
          name: day.name,
          focus: day.focus,
          steps: day.steps.map((s) => ({
            id: s.id,
            exercise_ids: s.vuelta ? [] : s.exerciseIds,
            vuelta: s.vuelta ?? null,
            note: s.note,
            sets: s.sets,
            reps: s.reps,
            load_kg: s.loadKg,
            rest_sec: s.restSec,
            prescription_text: s.text,
          })),
        })),
      },
    }),
  );
  invalidate("routines", `program:${id}`, `assignments:${id}`, "client-assignments:");
  return id;
}

// Deletes a routine for good: whoever has it stops seeing it. Their logged
// workouts stay (with the routine's name).
export async function deleteProgram(id) {
  must(await supabase.from("programs").delete().eq("id", id));
  invalidate("routines", "client-assignments:");
}

// Takes a routine away from a client (they stop seeing it) or gives it back.
export async function setAssignmentArchived(assignmentId, archived) {
  must(
    await supabase
      .from("program_assignments")
      .update({ archived_at: archived ? new Date().toISOString() : null })
      .eq("id", assignmentId),
  );
  invalidate("routines", "assignments:", "client-assignments:");
}

/*
 * Gives a routine to clients, or changes the numbers of clients who already
 * have it (assign_program in the database: all or nothing). `overrides` =
 * { [clientId]: { [stepId]: { sets, reps, load_kg } } }, only what differs
 * from the routine; for every client in clientIds it replaces what they had.
 */
export async function assignProgram(programId, clientIds, overrides) {
  must(await supabase.rpc("assign_program", { p_program_id: programId, p_client_ids: clientIds, p_overrides: overrides }));
  invalidate("routines", `assignments:${programId}`, "client-assignments:");
}
