/*
 * Plegado isométrico
 * Side view, lying flat on the back with the head to the left, arms along
 * the body and legs straight. Folds into the hold: the shoulders come well
 * off the floor, the knees tuck toward the chest and the hands reach
 * forward along the shins. Holds ~2.4 s (stands for the 10 s hold), then
 * unfolds slowly back to the floor. The hips are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [84, 141];

// Folded: shoulders up, thighs past vertical, shins about level.
const TORSO_FOLD = 304;
const NECK_FOLD = neckFrom(HIP, TORSO_FOLD);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 272, // flat on the floor
    head: 280,
    ...both("thigh", 90), // legs straight along the floor
    ...both("shin", 90),
    ...both("foot", 10), // toes up, relaxed
    // arms resting on the floor along the body
    armR: 93,
    forearmR: 91,
    armL: 94,
    forearmL: 92,
  },

  poses: {
    fold: {
      torso: TORSO_FOLD,
      head: 316, // chin slightly in, neck relaxed
      thighR: 352,
      thighL: 356,
      shinR: 102,
      shinL: 106,
      ...both("foot", 30), // feet follow the shins loosely
      // hands reach forward to the shins
      ...arm("R", NECK_FOLD, [96, 112], "down"),
      ...arm("L", NECK_FOLD, [94, 114], "down"),
    },
  },

  timeline: [
    { to: "fold", s: 0.8, say: "Plegate: hombros arriba" },
    { to: "fold", s: 2.4, say: "Sostené 10 segundos" },
    { to: "start", s: 0.9, ease: "slow", say: "Soltá despacio" },
    { to: "start", s: 0.5 },
  ],
};
