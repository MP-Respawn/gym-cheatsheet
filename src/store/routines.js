/*
 * routines.js (store)
 *
 * Your own routines: create, read, update, delete.
 *
 * The functions are async (they return Promises) even though today they
 * answer instantly from the device. That way, when the data moves to a
 * database, these functions start talking to the network and the screens
 * that call them do not need to change.
 *
 * A routine has the same "steps" shape as the trainer routines in
 * src/data/routines.js, so the same screens can show both:
 *   { id, ownerId, name, focus, steps: [{ id, exerciseIds, prescription, note }],
 *     createdAt, updatedAt }
 */
import { LOCAL_OWNER, newId, now, readData, updateData } from "./storage.js";

// Most recently edited first.
export function listRoutinesNow() {
  return [...readData().routines].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

export function getRoutineNow(id) {
  return readData().routines.find((r) => r.id === id);
}

export async function listRoutines() {
  return listRoutinesNow();
}

export async function getRoutine(id) {
  return getRoutineNow(id);
}

// A blank routine for the editor. Not saved until saveRoutine() is called.
export function newRoutineDraft() {
  return { id: newId(), ownerId: LOCAL_OWNER, name: "", focus: "", steps: [] };
}

// A blank step holding one exercise.
export function newStep(exerciseId) {
  return { id: newId(), exerciseIds: [exerciseId], prescription: "", note: "" };
}

// Creates or updates (matched by id). Returns the saved routine.
export async function saveRoutine(routine) {
  const stamp = now();
  let saved;
  updateData((d) => {
    const existing = d.routines.find((r) => r.id === routine.id);
    saved = {
      ...routine,
      ownerId: routine.ownerId ?? LOCAL_OWNER,
      createdAt: existing?.createdAt ?? stamp,
      updatedAt: stamp,
    };
    const routines = existing
      ? d.routines.map((r) => (r.id === routine.id ? saved : r))
      : [...d.routines, saved];
    return { ...d, routines };
  });
  return saved;
}

export async function deleteRoutine(id) {
  updateData((d) => ({ ...d, routines: d.routines.filter((r) => r.id !== id) }));
}

/* ------------------------------------------------------------------ */
/* Routines split into days                                            */
/* ------------------------------------------------------------------ */
/*
 * A routine can be divided into days (Día 1, Día 2...). Each day is saved as
 * its own routine, so the routine page, the workout log and the history work
 * per day exactly as before. The days of one routine share:
 *   programId   the same id on every day
 *   dayIndex    0, 1, 2... (their order)
 *   block       the routine's name, shown above each day's title (like the
 *               trainer's "Bloque A") and found by the search
 * A routine without programId is a normal, undivided one.
 */

// The days of the routine this one belongs to, in order (just [routine] if
// it is not divided). `routines` defaults to everything saved.
export function programDaysOf(routine, routines = readData().routines) {
  if (!routine?.programId) return routine ? [routine] : [];
  return routines
    .filter((r) => r.programId === routine.programId)
    .sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0));
}

// A blank day for the editor.
export function newDay() {
  return { id: newId(), name: "", focus: "", steps: [] };
}

/*
 * Saves a whole routine, divided or not, in one go:
 *   { programId, name, days: [{ id, name, focus, steps }] }
 * With one day it is saved as a normal routine (no programId), which is how
 * "undividing" works. Days that existed before and are no longer in `days`
 * are deleted. Returns the saved day routines, in order.
 */
export async function saveProgram({ programId, name, days }) {
  const stamp = now();
  const divided = days.length > 1;
  const pid = divided ? programId ?? newId() : null;
  let saved = [];
  updateData((d) => {
    const before = programId ? d.routines.filter((r) => r.programId === programId) : [];
    const keep = new Set(days.map((day) => day.id));
    const removed = new Set(before.filter((r) => !keep.has(r.id)).map((r) => r.id));
    saved = days.map((day, i) => {
      const existing = d.routines.find((r) => r.id === day.id);
      const routine = {
        id: day.id,
        ownerId: existing?.ownerId ?? LOCAL_OWNER,
        name: divided ? day.name || `Día ${i + 1}` : name,
        focus: day.focus,
        steps: day.steps,
        createdAt: existing?.createdAt ?? stamp,
        updatedAt: stamp,
      };
      if (divided) Object.assign(routine, { programId: pid, dayIndex: i, block: name });
      return routine;
    });
    const savedIds = new Set(saved.map((r) => r.id));
    const others = d.routines.filter((r) => !savedIds.has(r.id) && !removed.has(r.id));
    return { ...d, routines: [...others, ...saved] };
  });
  return saved;
}

// Deletes a routine and, if it is divided, all its days.
export async function deleteProgram(routine) {
  const ids = new Set(programDaysOf(routine).map((r) => r.id));
  updateData((d) => ({ ...d, routines: d.routines.filter((r) => !ids.has(r.id)) }));
}
