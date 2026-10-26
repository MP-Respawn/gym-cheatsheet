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
/* Days                                                                */
/* ------------------------------------------------------------------ */
/*
 * Every routine has days (Día 1, Día 2...), at least one. Each day is saved
 * as its own routine, so the day page, the workout log and the history work
 * per day. The days of one routine share:
 *   programId   the same id on every day (the routine page is #/programa/<id>)
 *   dayIndex    0, 1, 2... (their order)
 *   block       the routine's name, shown above each day's title (like the
 *               trainer's "Bloque A") and found by the search
 * A routine with one day keeps the routine's name as its own name. Routines
 * saved before days existed have no programId: they count as one-day routines.
 */

// The days of the routine this one belongs to, in order (just [routine] for
// an old routine saved without days). `routines` defaults to everything saved.
export function programDaysOf(routine, routines = readData().routines) {
  if (!routine?.programId) return routine ? [routine] : [];
  return routines
    .filter((r) => r.programId === routine.programId)
    .sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0));
}

// One of your routines with days, as { id, name, focus, days, isMine: true },
// or undefined. `focus` is the days' focus joined ("Piernas, Espalda").
export function myProgram(programId, routines = readData().routines) {
  const days = routines
    .filter((r) => r.programId === programId)
    .sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0));
  if (days.length === 0) return undefined;
  const focus = days.map((d) => d.focus).filter(Boolean).join(", ");
  return { id: programId, name: days[0].block ?? days[0].name, focus, days, isMine: true };
}

// A blank day for the editor.
export function newDay() {
  return { id: newId(), name: "", focus: "", steps: [] };
}

/*
 * Saves a whole routine in one go:
 *   { programId, name, days: [{ id, name, focus, steps }] }
 * Days that existed before and are no longer in `days` are deleted.
 * Returns the saved day routines, in order.
 */
export async function saveProgram({ programId, name, days }) {
  const stamp = now();
  const several = days.length > 1;
  const pid = programId ?? newId();
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
        // one day: the routine's own name; several: "Día 2" or the day's own name
        name: several ? day.name || `Día ${i + 1}` : name,
        focus: day.focus,
        steps: day.steps,
        createdAt: existing?.createdAt ?? stamp,
        updatedAt: stamp,
        programId: pid,
        dayIndex: i,
        block: name,
      };
      return routine;
    });
    const savedIds = new Set(saved.map((r) => r.id));
    const others = d.routines.filter((r) => !savedIds.has(r.id) && !removed.has(r.id));
    return { ...d, routines: [...others, ...saved] };
  });
  return saved;
}

// Deletes a routine with all its days.
export async function deleteProgram(routine) {
  const ids = new Set(programDaysOf(routine).map((r) => r.id));
  updateData((d) => ({ ...d, routines: d.routines.filter((r) => !ids.has(r.id)) }));
}
