/*
 * Patadas de piernas (vuelta: abdomen clásico, paso 6)
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the hands tucked under the seat. The knees are up with
 * the thighs held still at 45 degrees; only the lower legs kick, in short,
 * quick alternating strokes: near shin up while the far one goes down, then
 * swap. The hips are the fixed point and the low back stays on the floor.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [80, 140];

// Shin and foot of one leg at an angle (the toes point along the shin).
const shin = (side, angle) => ({ [`shin${side}`]: angle, [`foot${side}`]: angle });

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
    // thighs still at 45 degrees, lower legs about level
    ...both("thigh", 45),
    ...shin("R", 95),
    ...shin("L", 95),
  },

  poses: {
    kickA: { ...shin("R", 75), ...shin("L", 115) },
    kickB: { ...shin("R", 115), ...shin("L", 75) },
  },

  timeline: [
    { to: "kickA", s: 0.25, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "kickA", s: 0.3, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "kickA", s: 0.3, say: "Patadas cortas" },
    { to: "kickB", s: 0.3, say: "Patadas cortas" },
    { to: "start", s: 0.25, say: "Muslos quietos, solo la parte de abajo" },
    { to: "start", s: 0.5, say: "Muslos quietos, solo la parte de abajo" },
  ],
};
