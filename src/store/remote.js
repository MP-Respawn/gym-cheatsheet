/*
 * remote.js
 *
 * Everything that talks to the database for the signed-in person:
 *   refreshAssigned()  downloads the routines assigned to them (days, steps,
 *                      and their own sets and kilos)
 *   pushPending()      uploads finished workouts that are not up there yet
 *   pullHistory()      downloads their past workouts (from any device)
 *   refreshAll()       the three, in that order
 *
 * The phone always works from its own copy (storage.js) and this file keeps
 * that copy in step with the database. A failed call keeps the old copy and
 * is simply tried again later: on the next refreshAll(), which runs when
 * the person signs in, when the connection comes back, and when the app
 * comes back to the screen.
 *
 * `useRemoteStatus()` (in useStore.js) shows the state: { loading, offline,
 * uploadError }. uploadError is the database's answer when it refused an
 * upload (not a missing signal), so the menu can say what went wrong.
 */
import { supabase } from "./supabase.js";
import { currentId, readData, updateData } from "./storage.js";
import { setFromRow, setToRow } from "./workouts.js";

/* ---- Status, for the screens ---- */

let status = { loading: false, offline: false, uploadError: "" };
const listeners = new Set();

function setStatus(change) {
  status = { ...status, ...change };
  listeners.forEach((listener) => listener());
}

export function subscribeStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getStatus = () => status;

// A failed request because there is no connection, not because of an error
// in the data: the phone's copy is still good.
function isNetworkError(error) {
  return !navigator.onLine || error instanceof TypeError || /fetch|network/i.test(error?.message ?? "");
}

/*
 * Every request gets 20 seconds. A request that never answers (a stalled
 * connection, a login renewal that hangs) would otherwise keep the upload
 * busy forever and block every later one; this turns it into an error, so
 * the upload is freed and tried again.
 */
const REQUEST_MS = 20_000;
function withTimeout(request, what) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(
      () => resolve({ data: null, error: { message: `${what} no respondió en ${REQUEST_MS / 1000} segundos` } }),
      REQUEST_MS,
    );
  });
  return Promise.race([request, timeout]).finally(() => clearTimeout(timer));
}

/* ---- Routines ---- */

/*
 * One assignment (routine + this client's own numbers) as a routine row the
 * way assigned.js reads it: { id, client_id, name, ..., program_days }, with
 * the client's sets, reps and kilos already in place of the routine's.
 */
function withOwnNumbers(assignment) {
  const own = new Map(assignment.assignment_steps.map((o) => [o.step_id, o]));
  const program = assignment.programs;
  return {
    ...program,
    client_id: assignment.client_id,
    created_at: assignment.created_at,
    program_days: program.program_days.map((day) => ({
      ...day,
      program_steps: day.program_steps.map((step) => {
        const o = own.get(step.id);
        return o
          ? { ...step, sets: o.sets ?? step.sets, reps: o.reps ?? step.reps, load_kg: o.load_kg ?? step.load_kg }
          : step;
      }),
    })),
  };
}

/*
 * Downloads the person's profile, their client records (one per trainer) and the routines
 * assigned to them that are not archived. The client ids are asked for
 * explicitly: a trainer or the superadmin can also read other routines,
 * and those do not belong in their own "Rutinas" list.
 */
export async function refreshAssigned(userId) {
  // Who this person is (role, name), so the app knows whether to show the trainer's tabs.
  const profile = await withTimeout(
    supabase.from("profiles").select("role, full_name, email, can_curate_catalog").eq("id", userId).single(),
    "La descarga del perfil",
  );
  if (profile.error) throw profile.error;
  updateData((d) => ({ ...d, profile: profile.data }));

  const clients = await withTimeout(
    supabase.from("clients").select("id, trainer_id, full_name").eq("user_id", userId),
    "La descarga de clientes",
  );
  if (clients.error) throw clients.error;
  const clientIds = clients.data.map((c) => c.id);

  let programs = [];
  if (clientIds.length > 0) {
    const result = await withTimeout(
      supabase
        .from("program_assignments")
        .select(
          "client_id, created_at, assignment_steps(step_id, sets, reps, load_kg), programs(id, name, focus, discipline, program_days(id, position, name, focus, program_steps(*)))",
        )
        .in("client_id", clientIds)
        .is("archived_at", null)
        .order("created_at"),
      "La descarga de rutinas",
    );
    if (result.error) throw result.error;
    programs = result.data.filter((a) => a.programs).map(withOwnNumbers);
  }

  updateData((d) => ({ ...d, assigned: { clients: clients.data, programs, fetchedAt: new Date().toISOString() } }));
}

/* ---- Workout log ---- */

// Finished sessions whose latest version is not in the database yet.
export function pendingSessions(sessions = readData().sessions) {
  return sessions.filter((s) => s.finishedAt && s.clientId && s.syncedAt !== s.updatedAt);
}

// One session in the shape save_workout_session() expects.
function sessionPayload(session) {
  return {
    id: session.id,
    client_id: session.clientId,
    program_id: session.programId ?? null,
    day_id: session.dayId ?? null,
    program_name: session.programName ?? "",
    day_name: session.dayName ?? session.routineName ?? "",
    started_at: session.startedAt,
    finished_at: session.finishedAt,
    sets: session.entries.flatMap((entry, entryIndex) =>
      entry.sets.map((set, setIndex) => ({
        entry_index: entryIndex,
        set_index: setIndex,
        exercise_id: entry.exerciseId,
        step_id: entry.stepId ?? null,
        ...setToRow(set),
        planned_sets: entry.planned?.sets ?? null,
        planned_reps: entry.planned?.reps ?? null,
        planned_load_kg: entry.planned?.loadKg ?? null,
      })),
    ),
  };
}

let pushing = null;
let retryTimer = null;
const RETRY_MS = 30_000;

/*
 * Uploads every pending session, one at a time. A session that fails stays
 * pending and is tried again in 30 seconds (and on the next refreshAll()).
 * Calls made while an upload is running wait for it instead of uploading
 * the same thing twice.
 *
 * `pushing` is cleared in .finally(), which always runs after it has been
 * stored. Clearing it inside the async function instead would, with nothing
 * to upload, run before the store and leave a finished upload marked as
 * running forever: every later workout would then never upload.
 */
export function pushPending() {
  pushing ??= upload().finally(() => {
    pushing = null;
  });
  return pushing;
}

async function upload() {
  clearTimeout(retryTimer);
  try {
    for (const session of pendingSessions()) {
      const { error } = await withTimeout(
        supabase.rpc("save_workout_session", { p_session: sessionPayload(session) }),
        "La subida",
      );
      if (error) {
        console.error("No se pudo subir el entrenamiento", error);
        setStatus({ uploadError: isNetworkError(error) ? "" : error.message || String(error) });
        throw error;
      }
      // Mark exactly the version uploaded; a later edit makes it pending again.
      updateData((d) => ({
        ...d,
        sessions: d.sessions.map((s) =>
          s.id === session.id && s.updatedAt === session.updatedAt ? { ...s, syncedAt: session.updatedAt } : s,
        ),
      }));
    }
    setStatus({ uploadError: "" });
  } catch (error) {
    retryTimer = setTimeout(() => pushPending().catch(() => {}), RETRY_MS);
    throw error;
  }
}

// A session from the database in the phone's shape (see workouts.js).
function fromRemote(row) {
  const entries = [];
  for (const set of [...row.workout_sets].sort((a, b) => a.entry_index - b.entry_index || a.set_index - b.set_index)) {
    const entry = (entries[set.entry_index] ??= { exerciseId: currentId(set.exercise_id), stepId: set.step_id, sets: [] });
    entry.sets.push(setFromRow(entry.exerciseId, set));
  }
  const name =
    row.program_name && row.day_name && row.program_name !== row.day_name
      ? `${row.program_name} · ${row.day_name}`
      : row.day_name || row.program_name;
  return {
    id: row.id,
    clientId: row.client_id,
    programId: row.program_id,
    dayId: row.day_id,
    routineId: row.day_id,
    routineName: name,
    programName: row.program_name,
    dayName: row.day_name,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    entries: entries.filter(Boolean),
    updatedAt: row.updated_at,
    syncedAt: row.updated_at,
  };
}

/*
 * Downloads the person's last 300 finished workouts and merges them into
 * the phone's log. A session with changes not uploaded yet keeps the
 * phone's version; everything else takes the database's. When the download
 * has the whole history (fewer than 300), an uploaded session the database
 * no longer has was deleted there, so it goes from the phone too.
 */
export async function pullHistory() {
  const clientIds = (readData().assigned?.clients ?? []).map((c) => c.id);
  if (clientIds.length === 0) return;
  const { data: rows, error } = await withTimeout(
    supabase
      .from("workout_sessions")
      .select(
        "id, client_id, program_id, day_id, program_name, day_name, started_at, finished_at, updated_at, workout_sets(entry_index, set_index, exercise_id, step_id, kg, reps, secs)",
      )
      .in("client_id", clientIds)
      .not("finished_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(300),
    "La descarga del historial",
  );
  if (error) throw error;

  updateData((d) => {
    const byId = new Map(d.sessions.map((s) => [s.id, s]));
    const pending = new Set(pendingSessions(d.sessions).map((s) => s.id));
    for (const row of rows) {
      if (!pending.has(row.id)) byId.set(row.id, fromRemote(row));
    }
    if (rows.length < 300) {
      const remote = new Set(rows.map((r) => r.id));
      for (const s of d.sessions) {
        if (s.syncedAt && !pending.has(s.id) && !remote.has(s.id)) byId.delete(s.id);
      }
    }
    return { ...d, sessions: [...byId.values()] };
  });
}

/* ---- All together ---- */

let refreshing = null;

// Routines, then uploads, then history. Errors are kept in `status`, never
// thrown. `refreshing` is cleared in .finally(), for the reason explained
// above pushPending().
export function refreshAll(userId) {
  refreshing ??= refresh(userId).finally(() => {
    refreshing = null;
  });
  return refreshing;
}

async function refresh(userId) {
  setStatus({ loading: true });
  try {
    await refreshAssigned(userId);
    await pushPending();
    await pullHistory();
    setStatus({ loading: false, offline: false });
  } catch (error) {
    setStatus({ loading: false, offline: isNetworkError(error) });
    if (!isNetworkError(error)) console.error("No se pudo sincronizar", error);
  }
}
