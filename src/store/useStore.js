/*
 * useStore.js
 *
 * React hooks that read the signed-in person's data and re-render the
 * component whenever it changes (a save, a download, a sign-in). Built on
 * React's own useSyncExternalStore, so no state library is needed.
 *
 * Screens READ through these hooks and WRITE through the async functions in
 * workouts.js and auth.js.
 *
 * Routines come from two places:
 *   assigned  the ones the trainer assigned (downloaded, see assigned.js)
 *   catalog   the fixed sequences in the code (the vueltas, Flow básico,
 *             yoga and Jiu Jitsu routines in src/data/routines.js)
 */
import { useMemo, useSyncExternalStore } from "react";
import { ROUTINES } from "../data/routines.js";
import { assignedDays, assignedPrograms } from "./assigned.js";
import { getAuth, subscribeAuth } from "./auth.js";
import { installState, subscribeInstall } from "./install.js";
import { getStatus, pendingSessions, subscribeStatus } from "./remote.js";
import { isPersistent, readData, subscribe } from "./storage.js";
import { historyForNow } from "./workouts.js";

// The whole data snapshot; changes identity only when something is saved.
export function usePersonalData() {
  return useSyncExternalStore(subscribe, readData);
}

// { status: "loading" | "signed-out" | "signed-in", user }
export function useAuth() {
  return useSyncExternalStore(subscribeAuth, getAuth);
}

// { loading, offline }: is a download running, did the last one find no signal.
export function useRemoteStatus() {
  return useSyncExternalStore(subscribeStatus, getStatus);
}

/*
 * The catalog's sequences: the routines in the code that are not days of a
 * trainer program (Bloque A and B moved to the database as the trainer's).
 */
export const CATALOG_ROUTINES = ROUTINES.filter((r) => !r.programId);
const catalogRoutine = (id) => CATALOG_ROUTINES.find((r) => r.id === id);

/*
 * Is the signed-in person a trainer (or the superadmin, who can work as
 * one)? Decides whether Clientes and the coach's routines show up. The database
 * enforces the real permissions; this only shapes the menu.
 */
export function useIsTrainer() {
  const data = usePersonalData();
  const role = data.profile?.role;
  return role === "trainer" || role === "superadmin";
}

// The superadmin: also sees Entrenadores.
export function useIsSuperadmin() {
  return usePersonalData().profile?.role === "superadmin";
}

// Both at once, for the navigation (navLinks.js linksFor).
export function useRoles() {
  return { isTrainer: useIsTrainer(), isSuperadmin: useIsSuperadmin() };
}

// Answers exercise requests: the superadmin, or the coach who curates the catalog.
export function useIsCurator() {
  const profile = usePersonalData().profile;
  return profile?.role === "superadmin" || Boolean(profile?.can_curate_catalog);
}

// The routines assigned to you, oldest first: [{ id, name, focus, days, ... }].
export function useAssignedPrograms() {
  const data = usePersonalData();
  return assignedPrograms(data.assigned);
}

/*
 * What the routines tab can say: has anything been downloaded yet, and are
 * you anybody's client (only then can workouts be uploaded).
 */
export function useAssignedState() {
  const data = usePersonalData();
  return {
    downloaded: data.assigned != null,
    isClient: (data.assigned?.clients?.length ?? 0) > 0,
  };
}

/*
 * The days of the routine a day belongs to, in order (for the day chips on
 * the day page). A catalog routine returns just [routine].
 */
export function useRoutineDays(routine) {
  const programs = useAssignedPrograms();
  return useMemo(() => {
    if (!routine) return [];
    if (routine.source !== "assigned") return [routine];
    return programs.find((p) => p.id === routine.programId)?.days ?? [routine];
  }, [programs, routine]);
}

// An assigned routine with its days, for #/programa/<id>, or undefined.
export function useProgram(id) {
  const programs = useAssignedPrograms();
  return useMemo(() => programs.find((p) => p.id === id), [programs, id]);
}

// Where a routine card should lead: the routine page when it has several
// days, straight to the day when it has one. `days` = the routine's days.
export function routineHref(days) {
  return days.length > 1 ? `#/programa/${days[0].programId}` : `#/rutina/${days[0].id}`;
}

/*
 * Finds a routine by id: first a day of your assigned routines, then a
 * catalog sequence. Returns the routine or undefined.
 */
export function useAnyRoutine(id) {
  const data = usePersonalData();
  return useMemo(
    () => assignedDays(data.assigned).find((d) => d.id === id) ?? catalogRoutine(id),
    [data, id],
  );
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

// How many finished workouts are still waiting to be uploaded.
export function usePendingCount() {
  const data = usePersonalData();
  return useMemo(() => pendingSessions(data.sessions).length, [data]);
}

// "installed" | "prompt" | "ios" | "none": see install.js.
export function useInstall() {
  return useSyncExternalStore(subscribeInstall, installState);
}

// False when the browser refuses to save (private window): the UI warns.
export function useIsPersistent() {
  usePersonalData();
  return isPersistent();
}
