/*
 * Patadas de piernas (vuelta: abdomen clásico, paso 5)
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the hands tucked under the seat. The straight legs
 * hover low and kick in short, quick alternating strokes (flutter kicks):
 * near leg up while the far one goes down, then swap. The hips are the
 * fixed point and the low back stays on the floor.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [80, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 279,
    head: 286,
    // arms along the body, hands under the seat
    armR: 99,
    forearmR: 95,
    armL: 100,
    forearmL: 96,
    // legs straight and low, hovering
    ...both("thigh", 76),
    ...both("shin", 76),
    ...both("foot", 55),
  },

  poses: {
    kickA: { thighR: 62, shinR: 62, thighL: 82, shinL: 82 },
    kickB: { thighR: 82, shinR: 82, thighL: 62, shinL: 62 },
  },

  timeline: [
    { to: "kickA", s: 0.25, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "kickA", s: 0.3, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "kickA", s: 0.3, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "start", s: 0.25, say: "Zona lumbar pegada al piso" },
    { to: "start", s: 0.5, say: "Zona lumbar pegada al piso" },
  ],
};
