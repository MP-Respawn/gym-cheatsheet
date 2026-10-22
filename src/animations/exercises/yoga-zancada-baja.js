/*
 * Zancada baja / Anjaneyasana (yoga)
 * Side view, facing right: near (front) foot planted ahead, far (back)
 * knee down on the floor with the shin and the top of the foot flat behind.
 * From hands on the front knee with the hips high, the hips sink forward
 * and down while the arms sweep up overhead and the chest opens; hold,
 * then back. The back knee is the fixed point; the front foot stays put.
 */
import { STAND_SIDE, angleBetween, leg, point } from "../engine/helpers.js";

const KNEE_BACK = [52, 141];
const FRONT_ANKLE = [114, 144];

const HIP_HIGH = point(KNEE_BACK, 30, 28);
const HIP_LOW = point(KNEE_BACK, 30, 52);

const legs = (hip) => ({
  thighL: angleBetween(hip, KNEE_BACK),
  shinL: 270, // back shin flat behind
  footL: 270, // top of the foot down
  ...leg("R", hip, FRONT_ANKLE, "fwd"),
  footR: 90,
});

export default {
  view: "side",
  root: "kneeL",
  at: KNEE_BACK,

  start: {
    ...STAND_SIDE,
    ...legs(HIP_HIGH),
    torso: 10,
    head: 12,
    // hands resting on the front knee
    armR: 150,
    forearmR: 110,
    armL: 152,
    forearmL: 112,
  },

  poses: {
    low: {
      ...legs(HIP_LOW),
      torso: 354, // chest open, a hair back
      head: 350,
      armR: 0, // arms overhead
      forearmR: 0,
      armL: 356,
      forearmL: 356,
    },
  },

  timeline: [
    { to: "low", s: 1.4, ease: "slow", say: "Cadera adelante y abajo" },
    { to: "low", s: 2.2, say: "Brazos arriba, pecho abierto" },
    { to: "start", s: 1.2, ease: "slow", say: "Volvé despacio" },
    { to: "start", s: 0.4 },
  ],
};
