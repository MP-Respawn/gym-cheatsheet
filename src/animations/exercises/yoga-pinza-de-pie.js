/*
 * Pinza de pie / Uttanasana (yoga)
 * Side view, facing right, feet together. From standing with the arms up,
 * the body folds forward from the hips: the hips shift back a little, the
 * torso hangs down toward the legs, head loose, hands to the floor in
 * front of the feet. Hold, then roll back up. The ankle is the fixed point.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [86, 144];
const HIP_UP = [85, 84];
const HIP_FOLD = [76, 86]; // hips back over the heels
const TORSO_FOLD = 168; // hanging down, a little in front of the legs

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP_UP, ANKLE, "fwd"),
    ...leg("L", HIP_UP, [ANKLE[0] - 3, ANKLE[1]], "fwd"),
    ...both("foot", 90),
    // arms up overhead
    armR: 2,
    forearmR: 2,
    armL: 358,
    forearmL: 358,
  },

  poses: {
    fold: {
      ...leg("R", HIP_FOLD, ANKLE, "fwd"),
      ...leg("L", HIP_FOLD, [ANKLE[0] - 3, ANKLE[1]], "fwd"),
      ...both("foot", 90),
      torso: TORSO_FOLD,
      head: TORSO_FOLD + 4,
      // hands down to the floor in front of the toes
      ...arm("R", neckFrom(HIP_FOLD, TORSO_FOLD), [102, 144], "back"),
      ...arm("L", neckFrom(HIP_FOLD, TORSO_FOLD), [99, 144], "back"),
    },
  },

  timeline: [
    { to: "fold", s: 1.4, ease: "slow", say: "Doblá desde la cadera" },
    { to: "fold", s: 2.2, say: "Cabeza y cuello sueltos" },
    { to: "start", s: 1.4, ease: "slow", say: "Subí desenrollando" },
    { to: "start", s: 0.4 },
  ],
};
