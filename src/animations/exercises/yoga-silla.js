/*
 * Silla / Utkatasana (yoga)
 * Side view, facing right, feet together and flat. From standing with the
 * arms down, the hips sit back and down as if onto a chair, knees forward
 * over the toes, torso leaning a little forward and the arms reaching up
 * in line with it. Hold, then stand back up. The ankle is the fixed point.
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";

const ANKLE = [88, 144];
const HIP_UP = [87, 84];
const HIP_CHAIR = [68, 112];

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
    chair: {
      ...leg("R", HIP_CHAIR, ANKLE, "fwd"),
      ...leg("L", HIP_CHAIR, [ANKLE[0] - 3, ANKLE[1]], "fwd"),
      ...both("foot", 90),
      torso: 30, // leaning a little forward
      head: 28,
      armR: 22, // arms up, in line with the torso
      forearmR: 22,
      armL: 25,
      forearmL: 25,
    },
  },

  timeline: [
    { to: "chair", s: 1.2, ease: "slow", say: "Cola atrás, brazos arriba" },
    { to: "chair", s: 2.2, say: "Sostené: peso en los talones" },
    { to: "start", s: 1, ease: "slow", say: "Subí despacio" },
    { to: "start", s: 0.4 },
  ],
};
