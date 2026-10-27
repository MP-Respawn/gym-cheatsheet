/*
 * routines.js
 *
 * The routines written in the code: INCA's four core circuits, the
 * "Vueltas de abdomen". Pure data. The app shows them to everyone under
 * Rutinas, as "Recomendadas por INCA". Every other routine is built by a
 * coach in the app (it lives in the database) and reaches clients by
 * assignment. A coach's routine can include a whole vuelta as one step
 * (`vuelta: "pelota"`), which expands to the sequence below.
 *
 * Shape of one routine:
 *   id      kebab-case key, used in the URL (#/rutina/<id>)
 *   name    title shown in the list
 *   discipline  one of the DISCIPLINES keys in exercises.js. Defaults to
 *               "gym" (normalizeRoutine below)
 *   block   the group it is listed under ("Vueltas de abdomen")
 *   focus   short summary
 *   steps   ordered list of what to do. Each step is:
 *             exerciseIds   one id, or several when they are done together
 *                           (a superset: two or three exercises back to back)
 *             note          the trainer's note for this step ("" if none)
 *             prescription  OPTIONAL. Reps/sets for THIS routine only. When it
 *                           is missing, the screen shows each exercise's own
 *                           general prescription from exercises.js.
 *
 * Every id here must exist in exercises.js. `node scripts/check-data.mjs`
 * checks that for you.
 */

import { getVuelta } from "./exercises.js";

const RAW_ROUTINES = [
  /* ---------------- Vueltas de abdomen ----------------
   * INCA's four core circuits, each exercise in order, done one after the
   * other without rest. A step of a coach's routine points at them with `vuelta`.
   */
  {
    id: "vuelta-abdomen-en-pelota",
    name: "Vuelta: abdomen en pelota",
    block: "Vueltas de abdomen",
    focus: "Pelota, en orden y sin descanso",
    steps: [
      { exerciseIds: ["abdominal-pelota-pies-suelo"], note: "" },
      { exerciseIds: ["abdominal-pelota-oblicuos"], note: "En diagonal, alternando lados." },
      { exerciseIds: ["elevacion-tronco-pelota"], note: "Hombros bien arriba." },
      { exerciseIds: ["elevacion-piernas-pelota"], note: "" },
      { exerciseIds: ["puente-piernas-pelota"], note: "" },
      { exerciseIds: ["abdominal-lateral-pelota"], note: "Un lado y después el otro." },
      { exerciseIds: ["espinal-pelota-tronco"], note: "" },
      { exerciseIds: ["espinal-pelota-piernas"], note: "" },
    ],
  },
  {
    id: "vuelta-abdomen-clasico",
    name: "Vuelta: abdomen clásico",
    block: "Vueltas de abdomen",
    focus: "Colchoneta, en orden y sin descanso",
    steps: [
      { exerciseIds: ["abdominal-tradicional"], note: "" },
      { exerciseIds: ["abdominal-cruzado"], note: "Con un brazo." },
      { exerciseIds: ["abdominal-cruzado"], note: "Con el otro brazo." },
      { exerciseIds: ["abdominal-bolita"], note: "Codos a las rodillas." },
      { exerciseIds: ["abdominal-lateral"], note: "Apoyado sobre el lateral." },
      { exerciseIds: ["patadas-piernas"], note: "Brazos debajo de la cola." },
      { exerciseIds: ["espinal-brazos"], note: "" },
      { exerciseIds: ["espinal-piernas"], note: "" },
      { exerciseIds: ["espinal-brazos-piernas"], note: "" },
    ],
  },
  {
    id: "vuelta-abdomen-estirado",
    name: "Vuelta: abdomen estirado",
    block: "Vueltas de abdomen",
    focus: "Colchoneta, rueda y barra, en orden",
    steps: [
      { exerciseIds: ["abdominal-estirado"], note: "Brazos por encima de la cabeza." },
      { exerciseIds: ["elevacion-piernas"], note: "" },
      { exerciseIds: ["elevacion-piernas-cruzadas"], note: "" },
      { exerciseIds: ["rueda-abdominal"], note: "" },
      { exerciseIds: ["rueda-abdominal-lateral"], note: "Izquierda y derecha." },
      { exerciseIds: ["elevacion-piernas-colgado"], note: "" },
    ],
  },
  {
    id: "vuelta-abdomen-isometrico",
    name: "Vuelta: abdomen isométrico",
    block: "Vueltas de abdomen",
    focus: "10 segundos por posición, 3 series de cada una",
    steps: [
      { exerciseIds: ["plegado-en-v"], note: "Hombros elevados." },
      { exerciseIds: ["plegado-en-v-torcido"], note: "Torcido hacia la izquierda." },
      { exerciseIds: ["plegado-en-v-torcido"], note: "Torcido hacia la derecha." },
      { exerciseIds: ["plancha-frontal"], note: "" },
      { exerciseIds: ["plancha-lateral"], note: "Cada lado, apretando glúteos." },
      { exerciseIds: ["bird-dog"], note: "Mantené el equilibrio." },
    ],
  },
];

// Fills the defaults, like normalizeExercise in exercises.js.
function normalizeRoutine(routine) {
  return { discipline: "gym", ...routine };
}

export const ROUTINES = RAW_ROUTINES.map(normalizeRoutine);

// Returns the routine with that id, or undefined if it does not exist.
export function getRoutine(id) {
  return ROUTINES.find((r) => r.id === id);
}

// The routine that holds a vuelta's full sequence ("pelota" -> its routine).
export function vueltaRoutine(key) {
  return getRoutine(getVuelta(key)?.routineId);
}

/*
 * The exercises a step stands for, in order. A normal step is its own
 * exerciseIds; a vuelta step expands to every exercise of that vuelta (an
 * exercise done twice, like "abdominal cruzado" with each arm, appears
 * twice). Screens and the workout log use this instead of exerciseIds.
 */
export function stepExerciseIds(step) {
  if (step.vuelta) return (vueltaRoutine(step.vuelta)?.steps ?? []).flatMap((s) => s.exerciseIds);
  return step.exerciseIds ?? [];
}

/*
 * Where an exercise sits in its vuelta: { vuelta, routine, positions, total },
 * positions being its step numbers (1-based; two when it is done with each
 * arm or to each side). Null for exercises that are not part of a vuelta.
 */
export function vueltaPlace(exercise) {
  const vuelta = getVuelta(exercise?.vuelta);
  const routine = vuelta && getRoutine(vuelta.routineId);
  if (!routine) return null;
  const positions = routine.steps.flatMap((step, i) => (step.exerciseIds.includes(exercise.id) ? [i + 1] : []));
  return { vuelta, routine, positions, total: routine.steps.length };
}
