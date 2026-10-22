/*
 * Elevaciones, kick-up / Kicking up (Jiu Jitsu)
 * Side view, lying on the back with the head to the left, arms long on the
 * floor and the legs straight up. The legs drive up toward the ceiling and
 * the hips leave the floor, the weight going onto the shoulders; then the
 * hips lower under control with the legs still up. The shoulders are the
 * fixed point.
 */
import { STAND_SIDE, angleBetween, both, point } from "../engine/helpers.js";

const NECK = [40, 140];
const HIP_DOWN = [72, 140];
const HIP_UP = point(NECK, 32, 60); // hips off the floor, on the shoulders

const ARMS = { ...both("arm", 96), ...both("forearm", 92) };

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: {
    ...STAND_SIDE,
    torso: angleBetween(HIP_DOWN, NECK),
    head: 280,
    ...ARMS,
    // legs straight up, far leg a hair apart
    thighR: 2,
    shinR: 2,
    thighL: 6,
    shinL: 6,
    ...both("foot", 70),
  },

  poses: {
    kick: {
      torso: angleBetween(HIP_UP, NECK),
      head: 284,
      ...ARMS,
      // legs up and a little over, toward the ceiling
      thighR: 340,
      shinR: 340,
      thighL: 344,
      shinL: 344,
      ...both("foot", 30),
    },
  },

  timeline: [
    { to: "kick", s: 0.5, ease: "fast", say: "Pateá hacia el techo" },
    { to: "kick", s: 0.25, say: "Peso en los hombros" },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.35 },
  ],
};
