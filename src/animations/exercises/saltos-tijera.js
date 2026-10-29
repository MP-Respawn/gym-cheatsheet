/*
 * Saltos tijera
 * Front view, standing. From feet together and arms by the sides, a hop
 * opens the legs wide while the arms swing out and up until the hands
 * nearly touch overhead; the next hop closes everything again. Two full
 * cycles per loop.
 * Cues shown: legs and arms open at the same time, soft landing, steady
 * rhythm.
 * The hip is the root, lifted with $root in the mid-air pose and lowered a
 * touch in the open stance so the wide feet still land on the floor. The
 * mid-air pose also keeps the arms swinging out to the sides (the shortest
 * rotation from "down" to "overhead" would cross the body).
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // feet together, arms hanging by the sides
    ...mirror("thigh", 178),
    ...mirror("shin", 178),
    ...mirror("arm", 172),
    ...mirror("forearm", 176),
  },

  poses: {
    // in the air: legs half open, arms straight out to the sides
    air: {
      $root: [0, -6],
      ...mirror("thigh", 169),
      ...mirror("shin", 169),
      ...mirror("arm", 80),
      ...mirror("forearm", 75),
    },
    // feet wide on the floor, arms overhead with the hands almost together
    open: {
      $root: [0, 4],
      ...mirror("thigh", 160),
      ...mirror("shin", 160),
      ...mirror("foot", 90),
      ...mirror("arm", 350),
      ...mirror("forearm", 350),
    },
  },

  timeline: [
    { to: "air", s: 0.18, ease: "fast" },
    { to: "open", s: 0.18, say: "Abrí piernas y brazos a la vez" },
    { to: "air", s: 0.18, ease: "fast" },
    { to: "start", s: 0.18, say: "Caé suave" },
    { to: "air", s: 0.18, ease: "fast" },
    { to: "open", s: 0.18, say: "Ritmo constante" },
    { to: "air", s: 0.18, ease: "fast" },
    { to: "start", s: 0.18, say: "Ritmo constante" },
    { to: "start", s: 0.2 },
  ],
};
