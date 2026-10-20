/*
 * routines.js
 *
 * Your saved routines, in the order the trainer gave them. Pure data: the
 * Rutinas screens read this array and draw it.
 *
 * Shape of one routine:
 *   id      kebab-case key, used in the URL (#/rutina/<id>)
 *   name    title shown in the list
 *   block   "Bloque A" or "Bloque B"
 *   focus   short summary of the day
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

export const ROUTINES = [
  /* ---------------- Bloque A, Día 1 ---------------- */
  {
    id: "bloque-a-dia-1",
    name: "Día 1: piernas y pecho",
    block: "Bloque A",
    focus: "Piernas + pecho",
    steps: [
      { exerciseIds: ["movilidad-arquero"], note: "Las tres variantes, rangos amplios." },
      {
        exerciseIds: ["plancha-frontal", "plancha-lateral", "plegado-isometrico"],
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
      { exerciseIds: ["abdomen-pelota"], note: "Hombros bien arriba." },
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
        exerciseIds: ["abdomen-pelota"],
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
        exerciseIds: ["plancha-frontal", "plancha-lateral", "plegado-isometrico"],
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
      { exerciseIds: ["abdomen-clasico"], note: "" },
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
];

// Returns the routine with that id, or undefined if it does not exist.
export function getRoutine(id) {
  return ROUTINES.find((r) => r.id === id);
}
