/*
 * renamedIds.js
 *
 * Exercise ids that no longer exist, and the id that took their place.
 * Your own routines and logged workouts are saved on the device with
 * exercise ids, so storage.js uses this map once when it loads old data,
 * and check-data.mjs makes sure no data file still uses an old id.
 *
 * October 2026: core was split into the trainer's four vueltas.
 * The old entries stood for a whole vuelta; each maps to the exercise that
 * matches its animation.
 */
export const RENAMED_IDS = {
  "abdomen-pelota": "elevacion-piernas-pelota",
  "abdomen-clasico": "abdominal-tradicional",
  "vuelta-abdomen-estirado": "elevacion-piernas",
  "plegado-isometrico": "plegado-en-v",
  // The ball crunch with the feet on the ball became the one with the feet on the floor.
  "abdominal-pies-en-pelota": "abdominal-pelota-pies-suelo",
};
