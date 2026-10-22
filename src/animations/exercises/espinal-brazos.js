/*
 * Espinales: solo brazos (vuelta: abdomen clásico, paso 6)
 * Side view, facing right, lying face down with the arms straight out
 * past the head and the legs long behind. The arms and chest lift off the
 * floor while the legs stay down, a short hold, then back down slowly.
 * Eyes on the floor: the head follows the spine. The hips are the fixed
 * point. (Same lying pose as "solo piernas" and "brazos y piernas".)
 */
import { STAND_SIDE } from "../engine/helpers.js";

const HIP = [64, 139];

export default {
  view: "side",
  root: "hip",
  at: HIP,
  // short feet: the toes point into the floor
  lengths: { footL: 5, footR: 5 },

  start: {
    ...STAND_SIDE,
    torso: 87, // face down, pointing right
    head: 84,
    armR: 89, // arms straight out past the head
    forearmR: 89,
    armL: 90,
    forearmL: 90,
    thighR: 271, // legs long behind
    shinR: 271,
    thighL: 270,
    shinL: 270,
    footR: 200,
    footL: 200,
  },

  poses: {
    up: { torso: 79, head: 74, armR: 66, forearmR: 66, armL: 69, forearmL: 69 },
  },

  timeline: [
    { to: "up", s: 0.8, say: "Subí brazos y pecho" },
    { to: "up", s: 0.4, say: "Las piernas quedan abajo" },
    { to: "start", s: 1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4 },
  ],
};
