/*
 * Espinales: solo piernas (vuelta: abdomen clásico, paso 7)
 * Side view, facing right, lying face down with the arms straight out
 * past the head. Both legs lift straight and together, squeezing the
 * glutes, while the chest and arms stay on the floor; a short hold, then
 * back down slowly. The hips are the fixed point.
 */
import { STAND_SIDE } from "../engine/helpers.js";

const HIP = [64, 139];

export default {
  view: "side",
  root: "hip",
  at: HIP,
  lengths: { footL: 5, footR: 5 },

  start: {
    ...STAND_SIDE,
    torso: 87,
    head: 84,
    armR: 89,
    forearmR: 89,
    armL: 90,
    forearmL: 90,
    thighR: 271,
    shinR: 271,
    thighL: 270,
    shinL: 270,
    footR: 200,
    footL: 200,
  },

  poses: {
    up: { thighR: 283, shinR: 283, thighL: 282, shinL: 282 },
  },

  timeline: [
    { to: "up", s: 0.8, say: "Subí las piernas juntas" },
    { to: "up", s: 0.4, say: "Apretá glúteos" },
    { to: "start", s: 1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4 },
  ],
};
