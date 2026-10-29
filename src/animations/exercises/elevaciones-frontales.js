/*
 * Elevaciones frontales
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. A dumbbell (small disc) in each hand, hanging in front of the
 * thighs. Both arms rise straight out in front, nearly straight, up to
 * shoulder height (the far arm, darker, a few degrees behind), a short
 * hold, and a slower way down with no swing from the torso.
 * Simplification: both dumbbells rise together (no alternating).
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", [80, 84], [76, 144]), // far leg a little behind
    // dumbbells hanging just in front of the thighs
    armR: 176,
    forearmR: 176,
    armL: 179,
    forearmL: 179,
  },

  poses: {
    // arms straight out in front at shoulder height
    up: {
      armR: 92,
      forearmR: 94,
      armL: 95,
      forearmL: 97,
    },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Subí al frente, hasta el hombro" },
    { to: "up", s: 0.2, say: "Subí al frente, hasta el hombro" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá lento, sin impulso" },
    { to: "start", s: 0.4, say: "Bajá lento, sin impulso" },
  ],

  props: [
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
