/*
 * Guerrero I / Virabhadrasana I (yoga)
 * Side view, facing right, in a long stance: near (front) foot ahead, far
 * (back) foot behind with the heel down. The front knee bends toward 90
 * degrees as the hips sink, the torso stays upright and the arms sweep
 * from the sides up overhead; hold, then come back up. The back ankle is
 * the fixed point; both feet stay planted.
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";

const BACK_ANKLE = [40, 144];
const FRONT_ANKLE = [114, 144];

const HIP_UP = [80, 100]; // stance, legs nearly straight
const HIP_LOW = [84, 106]; // front knee bent toward 90

const stance = (hip) => ({
  ...leg("R", hip, FRONT_ANKLE, "fwd"),
  ...leg("L", hip, BACK_ANKLE, "down"),
  footR: 90,
  footL: 70, // back foot turned a little, heel down
});

export default {
  view: "side",
  root: "ankleL",
  at: BACK_ANKLE,

  start: {
    ...STAND_SIDE,
    ...stance(HIP_UP),
    ...both("arm", 182),
    ...both("forearm", 182),
  },

  poses: {
    warrior: {
      ...stance(HIP_LOW),
      torso: 0,
      head: 4,
      armR: 0, // arms straight up overhead
      forearmR: 0,
      armL: 3,
      forearmL: 3,
    },
  },

  timeline: [
    { to: "warrior", s: 1.2, ease: "slow", say: "Bajá la cadera, brazos arriba" },
    { to: "warrior", s: 2.2, say: "Sostené respirando" },
    { to: "start", s: 1, ease: "slow", say: "Volvé despacio" },
    { to: "start", s: 0.4 },
  ],
};
