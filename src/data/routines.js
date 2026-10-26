/*
 * routines.js
 *
 * Routines written in the code, in the order the trainer gave them. Pure data.
 * Two kinds:
 *   - the catalog's sequences (one-day routines: the core vueltas, Flow
 *     básico, the yoga and Jiu Jitsu routines). The app shows them to
 *     everyone, under Rutinas, like the exercise catalog.
 *   - the days of PROGRAMS below (Bloque A, Bloque B). The app does NOT
 *     show these: they were imported into the database as the trainer's
 *     templates (scripts/seed-trainer.mjs) and reach clients by assignment.
 *
 * Shape of one routine:
 *   id      kebab-case key, used in the URL (#/rutina/<id>)
 *   name    title shown in the list
 *   discipline  one of the DISCIPLINES keys in exercises.js. Defaults to
 *               "gym" (normalizeRoutine below), so gym routines leave it out
 *   block   "Bloque A", "Bloque B", "Vueltas de abdomen"; for the other
 *           disciplines the discipline's own name ("Yoga")
 *   focus   short summary of the day
 *   steps   ordered list of what to do. Each step is:
 *             exerciseIds   one id, or several when they are done together
 *                           (a superset: two or three exercises back to back)
 *             vuelta        INSTEAD of exerciseIds: a VUELTAS key from
 *                           exercises.js ("pelota"...). The step is that whole
 *                           core circuit; its sequence is the matching
 *                           "Vueltas de abdomen" routine at the end of this file.
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
  /* ---------------- Bloque A, Día 1 ---------------- */
  {
    id: "bloque-a-dia-1",
    name: "Día 1: piernas y pecho",
    block: "Bloque A",
    focus: "Piernas + pecho",
    steps: [
      { exerciseIds: ["movilidad-arquero"], note: "Las tres variantes, rangos amplios." },
      {
        vuelta: "isometrico",
        note: "Abdomen isométrico: tensión en el abdomen, no en cuello ni cintura.",
        prescription: "10 segundos por posición, 3 series de cada una",
      },
      {
        exerciseIds: ["equilibrio-bosu", "tobillo-banda"],
        note: "Equilibrio en bosu y después banda de tobillo.",
      },
      {
        exerciseIds: ["sentadilla-barra", "sentadilla-explosiva-arnold"],
        note: "La explosiva va encadenada después de la pesada.",
        prescription:
          "Sentadilla: 6/8 reps peso medio, bajada lenta, subida explosiva, 3 series, pausa 1'30\". Después 6 explosivas livianas con press Arnold.",
      },
      {
        exerciseIds: ["estocadas", "vuelos-laterales"],
        note: "Vuelos laterales en la bajada de cada estocada, peso cómodo.",
        prescription: "6/8 por lado x 2 series",
      },
      {
        exerciseIds: ["puente-gluteos-press"],
        note: "Puente y press simultáneos. Rodillas hacen fuerza hacia afuera.",
      },
      {
        exerciseIds: ["gemelos-pie", "flexiones"],
        note: "",
      },
      {
        exerciseIds: ["estocadas-laterales", "maquina-aductores"],
        note: "Estocadas laterales con peso liviano, prioridad técnica.",
      },
      { exerciseIds: ["flexibilidad-cierre"], note: "" },
    ],
  },

  /* ---------------- Bloque A, Día 2 ---------------- */
  {
    id: "bloque-a-dia-2",
    name: "Día 2: posterior y espalda",
    block: "Bloque A",
    focus: "Cadena posterior + espalda",
    steps: [
      { exerciseIds: ["movilidad-parado"], note: "" },
      { vuelta: "pelota", note: "Hombros bien arriba." },
      {
        exerciseIds: ["tobillo-pared", "balanzas-una-pierna"],
        note: "Balanzas: primero una pierna y después la otra, casi sin descanso.",
      },
      {
        exerciseIds: ["peso-muerto", "remo-cruz"],
        note: "Peso muerto: frená 1 segundo arriba y bajá con mucho control.",
        prescription: "Peso muerto 6 reps + remo cruz 8 reps",
      },
      {
        exerciseIds: ["jalon-pecho", "curl-nordico"],
        note: "Nórdico: bajada lo más lenta posible.",
        prescription: "Jalón 8/10 reps + nórdico 6 reps",
      },
      {
        exerciseIds: ["peso-muerto-un-pie-remo", "camilla-isquios"],
        note: "Equilibrio de calidad, nada de movimiento extra.",
        prescription: "8 remos por pie + camilla 8 reps",
      },
      {
        exerciseIds: ["plancha-copenhague", "biceps-pared"],
        note: "",
      },
      { exerciseIds: ["flexibilidad-cierre"], note: "" },
    ],
  },

  /* ---------------- Bloque B, Día 1 ---------------- */
  {
    id: "bloque-b-dia-1",
    name: "Día 1: cuádriceps",
    block: "Bloque B",
    focus: "Cuádriceps",
    steps: [
      { exerciseIds: ["rolo-movilidad-inferior"], note: "" },
      {
        vuelta: "pelota",
        note: "Si no hay pelota: vuelta de abdomen estirado.",
      },
      {
        exerciseIds: ["equilibrio-un-pie", "tobillo-pared"],
        note: "",
      },
      {
        exerciseIds: ["tobillo-banda", "gemelos-un-pie"],
        note: "",
      },
      {
        exerciseIds: ["camilla-cuadriceps"],
        note: "Calentamiento.",
        prescription: "3 series de 6/8 reps con solo 15 segundos de descanso",
      },
      {
        exerciseIds: ["sentadilla-barra"],
        note: "Subí el peso tranquilo, descansá entre series.",
        prescription: "Pirámide 10/8/6/4",
      },
      {
        exerciseIds: ["estocadas"],
        note: "",
        prescription: "5 por pierna x 3 series",
      },
      { exerciseIds: ["camilla-cuadriceps-isometrica"], note: "Dos vueltas." },
      { exerciseIds: ["maquina-aductores"], note: "" },
      { exerciseIds: ["flexibilidad-cierre"], note: "" },
    ],
  },

  /* ---------------- Bloque B, Día 2 ---------------- */
  {
    id: "bloque-b-dia-2",
    name: "Día 2: tren superior",
    block: "Bloque B",
    focus: "Tren superior",
    steps: [
      { exerciseIds: ["rolo-movilidad-superior"], note: "" },
      {
        vuelta: "isometrico",
        note: "Abdomen isométrico.",
        prescription: "10 segundos por posición, 3 series de cada una",
      },
      { exerciseIds: ["press-militar-barra"], note: "Tensión continua." },
      { exerciseIds: ["vuelos-laterales"], note: "Pesado y después liviano." },
      {
        exerciseIds: ["dominada-polea"],
        note: "",
        prescription: "20 reps x 2 series",
      },
      {
        exerciseIds: ["remo-bajo-barra"],
        note: "",
        prescription: "Pirámide 15/12/10",
      },
      { exerciseIds: ["pullover"], note: "O jalón en polea como opción." },
      {
        exerciseIds: ["press-inclinado-barra"],
        note: "Barra libre, o Smith si no hay.",
        prescription: "Pirámide 12/10/8",
      },
      { exerciseIds: ["cruces-polea"], note: "" },
      { exerciseIds: ["biceps-pared"], note: "" },
      { exerciseIds: ["triceps-trasnuca-polea"], note: "" },
      { exerciseIds: ["flexibilidad-cierre"], note: "" },
    ],
  },

  /* ---------------- Bloque B, Día 3 ---------------- */
  {
    id: "bloque-b-dia-3",
    name: "Día 3: posterior y glúteos",
    block: "Bloque B",
    focus: "Cadena posterior + glúteos",
    steps: [
      { exerciseIds: ["rolo-movilidad-inferior"], note: "Rolo + movilidad." },
      { vuelta: "clasico", note: "" },
      {
        exerciseIds: ["equilibrio-un-pie"],
        note: "Con ojos cerrados.",
      },
      { exerciseIds: ["gemelos-maquina"], note: "" },
      {
        exerciseIds: ["camilla-isquios"],
        note: "Calentamiento.",
        prescription: "3 series de 6/8 reps con 10/15 segundos de descanso",
      },
      {
        exerciseIds: ["peso-muerto"],
        note: "",
        prescription: "8 reps x 3 series",
      },
      { exerciseIds: ["peso-muerto-nordico-maquina"], note: "Bajada lo más lenta posible." },
      { exerciseIds: ["hip-thrust"], note: "En punta de pie." },
      { exerciseIds: ["maquina-abductores"], note: "" },
      {
        exerciseIds: ["flexibilidad-cierre"],
        note: "Sobre todo cadena posterior.",
      },
    ],
  },

  /* ---------------- Vueltas de abdomen ----------------
   * The trainer's four core circuits, each exercise in order, done one after
   * the other without rest. Day routines point at them with `vuelta`.
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

  /* ---------------- Yoga ---------------- */
  {
    id: "yoga-cierre-gym",
    name: "Yoga: cierre de entrenamiento (10 minutos)",
    discipline: "yoga",
    block: "Yoga",
    focus: "Para bajar después del gimnasio",
    steps: [
      { exerciseIds: ["yoga-gato-vaca"], note: "Para entrar en calor la columna." },
      { exerciseIds: ["yoga-perro-abajo"], note: "" },
      { exerciseIds: ["yoga-zancada-baja"], note: "Un lado y después el otro." },
      { exerciseIds: ["yoga-paloma"], note: "Un lado y después el otro." },
      { exerciseIds: ["yoga-pinza-sentada"], note: "" },
      { exerciseIds: ["yoga-mariposa"], note: "" },
      { exerciseIds: ["yoga-torsion-acostado"], note: "Un lado y después el otro." },
      { exerciseIds: ["yoga-rodillas-al-pecho"], note: "" },
      { exerciseIds: ["yoga-cadaver"], note: "Hasta que se acabe el tiempo." },
    ],
  },

  /* ---------------- Animal Flow ----------------
   * Animal Flow is a trademarked system by Mike Fitch; personal reference.
   */
  {
    id: "flow-basico",
    name: "Flow básico",
    discipline: "animal-flow",
    block: "Animal Flow",
    focus: "3 vueltas, sin pausa entre movimientos",
    steps: [
      { exerciseIds: ["af-movilidad-muneca"], note: "Para preparar las muñecas." },
      { exerciseIds: ["af-bestia"], note: "Mantené la posición." },
      { exerciseIds: ["af-alcance-bestia"], note: "" },
      { exerciseIds: ["af-cangrejo"], note: "Mantené la posición." },
      { exerciseIds: ["af-alcance-cangrejo"], note: "" },
      { exerciseIds: ["af-cambio-por-debajo"], note: "" },
      { exerciseIds: ["af-patada-lateral"], note: "" },
      { exerciseIds: ["af-alcance-escorpion"], note: "" },
      { exerciseIds: ["af-mono"], note: "Mantené la posición." },
    ],
  },

  /* ---------------- Jiu Jitsu ---------------- */
  {
    id: "jj-calentamiento",
    name: "Jiu Jitsu: calentamiento de suelo",
    discipline: "jiu-jitsu",
    block: "Jiu Jitsu",
    focus: "2 vueltas, ritmo continuo",
    steps: [
      { exerciseIds: ["jj-rolo-adelante"], note: "" },
      { exerciseIds: ["jj-rolo-atras"], note: "" },
      { exerciseIds: ["jj-fuga-cadera"], note: "" },
      { exerciseIds: ["jj-fuga-inversa"], note: "" },
      { exerciseIds: ["jj-puente-upa"], note: "" },
      { exerciseIds: ["jj-parada-tecnica"], note: "" },
      { exerciseIds: ["jj-sentada"], note: "" },
      { exerciseIds: ["jj-sprawl"], note: "" },
      { exerciseIds: ["jj-granby"], note: "" },
      { exerciseIds: ["jj-caminata-oso"], note: "" },
    ],
  },
];

/*
 * Routines with days. Every routine has days; most of the trainer's have
 * just one (each vuelta, each flow), so they are a single routine above.
 * These group several of the routines above as the days of one routine:
 *   id      key of the program
 *   name    title of the routine page ("Bloque A")
 *   focus   short summary
 *   dayIds  the day routines, in order
 * normalizeRoutine gives each day its programId and dayIndex. These are the
 * source scripts/seed-trainer.mjs imports as the trainer's templates.
 */
export const PROGRAMS = [
  {
    id: "bloque-a",
    name: "Bloque A",
    focus: "Piernas y pecho, posterior y espalda",
    dayIds: ["bloque-a-dia-1", "bloque-a-dia-2"],
  },
  {
    id: "bloque-b",
    name: "Bloque B",
    focus: "Cuádriceps, tren superior, posterior y glúteos",
    dayIds: ["bloque-b-dia-1", "bloque-b-dia-2", "bloque-b-dia-3"],
  },
];

// Fills the defaults, like normalizeExercise in exercises.js.
function normalizeRoutine(routine) {
  const program = PROGRAMS.find((p) => p.dayIds.includes(routine.id));
  const day = program ? { programId: program.id, dayIndex: program.dayIds.indexOf(routine.id) } : {};
  return { discipline: "gym", ...routine, ...day };
}

export const ROUTINES = RAW_ROUTINES.map(normalizeRoutine);

// Returns the routine with that id, or undefined if it does not exist.
export function getRoutine(id) {
  return ROUTINES.find((r) => r.id === id);
}

// A program with its day routines, as { id, name, focus, discipline, days }.
export function getTrainerProgram(id) {
  const program = PROGRAMS.find((p) => p.id === id);
  if (!program) return undefined;
  const days = program.dayIds.map(getRoutine).filter(Boolean);
  return { id: program.id, name: program.name, focus: program.focus, discipline: days[0]?.discipline, days };
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
