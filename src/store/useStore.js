/*
 * useStore.js
 *
 * React hooks that read personal data and re-render the component whenever
 * it changes (after any save). Built on React's own useSyncExternalStore, so
 * no state library is needed.
 *
 * Screens READ through these hooks and WRITE through the async functions in
 * routines.js / workouts.js.
 */
import { useMemo, useSyncExternalStore } from "react";
import { getRoutine as getTrainerRoutine, getTrainerProgram } from "../data/routines.js";
import { myProgram, programDaysOf } from "./routines.js";
import { isPersistent, readData, subscribe } from "./storage.js";
import { historyForNow } from "./workouts.js";

// The whole data snapshot; changes identity only when something is saved.
export function usePersonalData() {
  return useSyncExternalStore(subscribe, readData);
}

// Your routines, most recently edited first.
export function useMyRoutines() {
  const data = usePersonalData();
  return useMemo(
    () => [...data.routines].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")),
    [data],
  );
}

/*
 * The days of the routine a day belongs to, in order (for the day chips on
 * the day page): yours, or the trainer's (Bloque A: Día 1, Día 2). A
 * one-day routine returns just [routine].
 */
export function useRoutineDays(routine, isMine) {
  const data = usePersonalData();
  return useMemo(() => {
    if (!routine) return [];
    if (isMine) return programDaysOf(routine, data.routines);
    return routine.programId ? (getTrainerProgram(routine.programId)?.days ?? [routine]) : [routine];
  }, [data, routine, isMine]);
}

/*
 * A routine with its days, for the routine page (#/programa/<id>): the
 * trainer's (PROGRAMS in data/routines.js) or yours.
 * Returns { id, name, focus, days, isMine } or undefined.
 */
export function useProgram(id) {
  const data = usePersonalData();
  return useMemo(() => getTrainerProgram(id) ?? myProgram(id, data.routines), [data, id]);
}

// Where a routine card should lead: the routine page when it has several
// days, straight to the day when it has one. `days` = the routine's days.
export function routineHref(days) {
  return days.length > 1 ? `#/programa/${days[0].programId}` : `#/rutina/${days[0].id}`;
}

/*
 * Finds a routine by id, wherever it lives: first the trainer's routines
 * (in the code), then yours (on the device).
 * Returns { routine, isMine } or { routine: undefined }.
 */
export function useAnyRoutine(id) {
  const data = usePersonalData();
  return useMemo(() => {
    const trainer = getTrainerRoutine(id);
    if (trainer) return { routine: trainer, isMine: false };
    const mine = data.routines.find((r) => r.id === id);
    return { routine: mine, isMine: Boolean(mine) };
  }, [data, id]);
}

// The workout in progress for a routine, if any.
export function useActiveSession(routineId) {
  const data = usePersonalData();
  return useMemo(() => data.sessions.find((s) => s.routineId === routineId && !s.finishedAt), [data, routineId]);
}

// All logged sets of one exercise, newest first.
export function useExerciseHistory(exerciseId) {
  const data = usePersonalData();
  return useMemo(() => historyForNow(exerciseId, data.sessions), [data, exerciseId]);
}

// False when the browser refuses to save (private window): the UI warns.
export function useIsPersistent() {
  usePersonalData();
  return isPersistent();
}
