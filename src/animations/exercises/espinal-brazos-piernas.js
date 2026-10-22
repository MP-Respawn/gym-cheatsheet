/*
 * Espinales: brazos y piernas (vuelta: abdomen clásico, paso 9)
 * Side view, facing right, lying face down with the arms straight out
 * past the head. The superman: arms, chest and legs all lift together, a
 * short hold, then back down slowly. Eyes on the floor. The hips are the
 * fixed point.
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
    up: {
      torso: 80,
      head: 75,
      armR: 68,
      forearmR: 68,
      armL: 71,
      forearmL: 71,
      thighR: 282,
      shinR: 282,
      thighL: 281,
      shinL: 281,
    },
  },

  timeline: [
    { to: "up", s: 0.8, say: "Subí brazos y piernas juntos" },
    { to: "up", s: 0.5, say: "Sostené" },
    { to: "start", s: 1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4 },
  ],
};
