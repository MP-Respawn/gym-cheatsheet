/*
 * Héroe / Virasana (yoga)
 * Side view, facing right, kneeling with the knees together and the seat
 * down on the floor between the heels, shins and the tops of the feet flat
 * behind, back tall, hands on the thighs. With the breath the arms rise
 * overhead (inhale) and come back to the thighs (exhale). The knees are
 * the fixed point.
 */
import { STAND_SIDE, angleBetween, arm, both, neckFrom, point } from "../engine/helpers.js";

const KNEE = [96, 141];
const HIP = point(KNEE, 30, 284); // seat on the floor, between the heels

const SEAT = {
  ...both("thigh", angleBetween(HIP, KNEE)),
  ...both("shin", 270),
  ...both("foot", 270),
  torso: 0,
  head: 2,
};

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: {
    ...STAND_SIDE,
    ...SEAT,
    // hands resting on the thighs
    ...arm("R", neckFrom(HIP, 0), [86, 132], "back"),
    ...arm("L", neckFrom(HIP, 0), [84, 133], "back"),
  },

  poses: {
    inhale: {
      ...SEAT,
      armR: 4, // arms overhead
      forearmR: 4,
      armL: 358,
      forearmL: 358,
    },
  },

  timeline: [
    { to: "inhale", s: 1.8, ease: "slow", say: "Inhalá: brazos arriba" },
    { to: "inhale", s: 0.4 },
    { to: "start", s: 1.8, ease: "slow", say: "Exhalá: manos a los muslos" },
    { to: "start", s: 0.6 },
  ],
};
