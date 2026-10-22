/*
 * workouts.js (store)
 *
 * The workout log: what weight and reps you did, set by set, each time you
 * train a routine. One "session" = one time you did a routine:
 *
 *   { id, ownerId, routineId, routineName, startedAt, finishedAt,
 *     entries: [{ exerciseId, sets: [{ kg, reps }] }], updatedAt }
 *
 * A set holds kg and reps, except for exercises with a `measure` (core
 * work, see exercises.js): those log only { reps } or only { secs }.
 *
 * While you train, the session is "active" (finishedAt is null) and every
 * change is saved right away, so closing the app mid-workout loses nothing.
 * When you tap "Terminar", empty sets are dropped and it joins your history.
 *
 * In an active session the values are kept as typed text ("42,5"), so the
 * inputs never fight you while typing. Finishing turns them into numbers.
 */
import { getExercise } from "../data/exercises.js";
import { stepExerciseIds } from "../data/routines.js";
import { LOCAL_OWNER, newId, now, readData, updateData } from "./storage.js";

/* ---- What a set holds ---- */

// The boxes the log shows for an exercise, in order: ["kg", "reps"] by
// default, ["reps"] or ["secs"] for exercises with a measure.
export function setFields(exerciseId) {
  const measure = getExercise(exerciseId)?.measure;
  if (measure === "reps") return ["reps"];
  if (measure === "secs") return ["secs"];
  return ["kg", "reps"];
}

// An empty set row for an exercise: { kg: "", reps: "" }, { secs: "" }...
export function emptySet(exerciseId) {
  return Object.fromEntries(setFields(exerciseId).map((field) => [field, ""]));
}

/* ---- Reading ---- */

export function getActiveSessionNow(routineId) {
  return readData().sessions.find((s) => s.routineId === routineId && !s.finishedAt);
}

// Every finished set of one exercise, newest session first:
// [{ sessionId, date, routineName, sets: [{ kg, reps }] }]
export function historyForNow(exerciseId, sessions = readData().sessions) {
  return sessions
    .filter((s) => s.finishedAt)
    .flatMap((s) =>
      s.entries
        .filter((e) => e.exerciseId === exerciseId && e.sets.length > 0)
        .map((e) => ({ sessionId: s.id, date: s.finishedAt, routineName: s.routineName, sets: e.sets })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

// The sets from the last time you did this exercise, or null.
export function lastSetsFor(exerciseId, sessions) {
  return historyForNow(exerciseId, sessions)[0]?.sets ?? null;
}

export async function historyFor(exerciseId) {
  return historyForNow(exerciseId);
}

/* ---- How many sets to offer by default ---- */

// Reads the number of sets from a prescription text:
// "8 reps x 3 series" -> 3, "Pirámide 10/8/6/4" -> 4. Defaults to 3.
export function setsInPrescription(text = "") {
  const series = text.match(/(\d+)\s*series/i);
  if (series) return Math.min(Number(series[1]), 8);
  const pyramid = text.match(/pir[aá]mide\s+([\d/]+)/i);
  if (pyramid) return pyramid[1].split("/").filter(Boolean).length;
  return 3;
}

// Reps of each set in a pyramid ("10/8/6/4" -> ["10","8","6","4"]), used as
// hints in the reps inputs. Empty list if the prescription has no pyramid.
export function pyramidReps(text = "") {
  const pyramid = text.match(/pir[aá]mide\s+([\d/]+)/i);
  return pyramid ? pyramid[1].split("/").filter(Boolean) : [];
}

/* ---- Writing ---- */

// A fresh entry: as many empty set rows as last time, or as the prescription says.
function newEntry(exerciseId, step, sessions) {
  const last = lastSetsFor(exerciseId, sessions);
  const prescription = step.prescription || getExercise(exerciseId)?.prescription || "";
  const count = last?.length ?? setsInPrescription(prescription);
  return { exerciseId, sets: Array.from({ length: count }, () => emptySet(exerciseId)) };
}

/*
 * Adds an entry for every exercise of the routine the session does not have
 * yet (in routine order). Needed when a routine changed while a session was
 * in progress, for example when core became the vueltas. Returns the same
 * session if nothing was missing.
 */
function withMissingEntries(session, routine, sessions) {
  const pool = [...session.entries];
  const entries = [];
  let added = false;
  for (const step of routine.steps) {
    for (const exerciseId of stepExerciseIds(step)) {
      const index = pool.findIndex((e) => e.exerciseId === exerciseId);
      if (index >= 0) entries.push(pool.splice(index, 1)[0]);
      else {
        entries.push(newEntry(exerciseId, step, sessions));
        added = true;
      }
    }
  }
  // Entries the routine no longer lists are kept at the end, so nothing typed is lost.
  return added ? { ...session, entries: [...entries, ...pool] } : session;
}

/*
 * Starts (or resumes) a session for a routine. Each exercise gets as many
 * empty set rows as last time, or as the prescription says. A vuelta step
 * expands to every exercise of the vuelta.
 */
export async function startSession(routine) {
  const sessions = readData().sessions;
  const active = getActiveSessionNow(routine.id);
  if (active) {
    const synced = withMissingEntries(active, routine, sessions);
    return synced === active ? active : saveSession(synced);
  }

  const entries = routine.steps.flatMap((step) =>
    stepExerciseIds(step).map((exerciseId) => newEntry(exerciseId, step, sessions)),
  );

  const session = {
    id: newId(),
    ownerId: LOCAL_OWNER,
    routineId: routine.id,
    routineName: routine.name,
    startedAt: now(),
    finishedAt: null,
    entries,
    updatedAt: now(),
  };
  updateData((d) => ({ ...d, sessions: [...d.sessions, session] }));
  return session;
}

// Saves the session as it is (called on every change while training).
export async function saveSession(session) {
  const saved = { ...session, updatedAt: now() };
  updateData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === saved.id ? saved : s)) }));
  return saved;
}

// "42,5" -> 42.5, "" -> null
function toNumber(text) {
  const n = Number(String(text).replace(",", ".").trim());
  return String(text).trim() === "" || Number.isNaN(n) ? null : n;
}

/*
 * Closes the session: keeps only sets with at least one value (kg, reps or
 * seconds) and converts them to numbers; empty boxes are dropped. If nothing
 * was logged at all, the session is simply removed. Returns the finished
 * session, or null if it was empty.
 */
export async function finishSession(session) {
  const entries = session.entries
    .map((e) => ({
      exerciseId: e.exerciseId,
      sets: e.sets
        .map((s) =>
          Object.fromEntries(
            Object.entries(s)
              .map(([field, value]) => [field, toNumber(value)])
              .filter(([, value]) => value !== null),
          ),
        )
        .filter((s) => Object.keys(s).length > 0),
    }))
    .filter((e) => e.sets.length > 0);

  if (entries.length === 0) {
    await discardSession(session.id);
    return null;
  }
  const finished = { ...session, entries, finishedAt: now(), updatedAt: now() };
  updateData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === finished.id ? finished : s)) }));
  return finished;
}

export async function discardSession(id) {
  updateData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }));
}

/* ---- Formatting helpers for the screens ---- */

// A number the Argentine way: 42.5 -> "42,5". Empty for null.
export function formatNumber(n) {
  return n == null ? "" : String(n).replace(".", ",");
}

// One set as text: "40x8", "x12" (bodyweight), "40 kg", "10 s" (a hold).
export function formatSet({ kg, reps, secs }) {
  const k = formatNumber(kg);
  const r = formatNumber(reps);
  if (k !== "" && r !== "") return `${k}x${r}`;
  if (r !== "") return `x${r}`;
  if (secs != null) return `${formatNumber(secs)} s`;
  return `${k} kg`;
}

export function formatSets(sets) {
  return sets.map(formatSet).join(", ");
}
