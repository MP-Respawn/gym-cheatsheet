/*
 * Guirnalda / Malasana (yoga)
 * Side view, facing right, feet a little apart with the heels down. From
 * standing, the body sinks into a deep squat: hips low between the heels,
 * knees forward and open, chest up, palms together in front of the chest
 * with the elbows pressing the knees out. Hold, then stand back up. The
 * ankle is the fixed point.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [84, 144];
const HIP_UP = [83, 84];
const HIP_LOW = [68, 130]; // deep: just above the heels
const TORSO_LOW = 14; // chest up, a little forward
const HANDS = [92, 112]; // palms together in front of the chest

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP_UP, ANKLE, "fwd"),
    ...leg("L", HIP_UP, [ANKLE[0] - 3, ANKLE[1]], "fwd"),
    ...both("foot", 90),
  },

  poses: {
    low: {
      ...leg("R", HIP_LOW, ANKLE, "fwd"),
      ...leg("L", HIP_LOW, [ANKLE[0] - 3, ANKLE[1]], "fwd"),
      ...both("foot", 90),
      torso: TORSO_LOW,
      head: TORSO_LOW - 6,
      ...arm("R", neckFrom(HIP_LOW, TORSO_LOW), HANDS, "down"),
      ...arm("L", neckFrom(HIP_LOW, TORSO_LOW), [HANDS[0] - 2, HANDS[1]], "down"),
    },
  },

  timeline: [
    { to: "low", s: 1.4, ease: "slow", say: "Bajá entre los talones" },
    { to: "low", s: 2.2, say: "Pecho alto, codos empujan las rodillas" },
    { to: "start", s: 1.2, ease: "slow", say: "Subí despacio" },
    { to: "start", s: 0.4 },
  ],
};
