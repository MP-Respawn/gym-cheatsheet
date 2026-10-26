/*
 * Puente de glúteos en talones (puntas arriba)
 * Side view, lying on the back on the mat, head to the left, arms long on
 * the floor. The "inverse" bridge: the feet sit farther from the glutes than
 * in a normal bridge and only the heels touch the floor, toes pulled up
 * toward the ceiling, so the hamstrings do more of the work. Hips up, a
 * 1 second squeeze, controlled way down. The neck/shoulders on the floor
 * are the fixed point; the heels stay put.
 */
import { STAND_SIDE, angleBetween, arm, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const ANKLE = [116, 141]; // heels far from the glutes
const ANKLE_FAR = [112, 141];

// Hips placed on a circle of torso length around the neck.
const HIP_DOWN = point(NECK, 32, 90); // flat on the floor
const HIP_UP = point(NECK, 32, 56); // bridge: lower than a normal one, legs longer

const TOES_UP = 15; // foot pointing almost straight up: only the heel touches

function pose(hip) {
  return {
    torso: angleBetween(hip, NECK),
    head: 280,
    ...leg("R", hip, ANKLE, "up"),
    ...leg("L", hip, ANKLE_FAR, "up"),
    ...both("foot", TOES_UP),
    // arms long on the floor, palms down by the hips
    ...arm("R", NECK, [78, 143], "up"),
    ...arm("L", NECK, [75, 143], "up"),
  };
}

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: { ...STAND_SIDE, ...pose(HIP_DOWN) },

  poses: {
    top: pose(HIP_UP),
  },

  timeline: [
    { to: "top", s: 0.7, say: "Puntas arriba, empujá con los talones" },
    { to: "top", s: 1, say: "Apretá arriba" },
    { to: "start", s: 1, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],
};
