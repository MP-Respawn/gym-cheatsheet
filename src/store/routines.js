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
