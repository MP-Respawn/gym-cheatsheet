/*
 * Cadáver / Savasana (yoga)
 * Side view, lying flat on the back with the head to the left, legs long
 * and loose, arms a little away from the body. Only a slow, quiet breath:
 * the chest rises a hair on the inhale and settles on the exhale. The hips
 * are the fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [84, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 272,
    head: 278,
    armR: 96, // arms long and loose, a little away from the body
    forearmR: 94,
    armL: 98,
    forearmL: 96,
    ...both("thigh", 90),
    ...both("shin", 90),
    ...both("foot", 30), // feet falling open
  },

  poses: {
    inhale: { torso: 274, head: 280 },
  },

  timeline: [
    { to: "inhale", s: 2.4, ease: "slow", say: "Respiración natural" },
    { to: "start", s: 2.8, ease: "slow", say: "Soltá todo" },
    { to: "start", s: 0.6 },
  ],
};
