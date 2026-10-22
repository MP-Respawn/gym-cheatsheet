/*
 * Lagarto / Utthan Pristhasana (yoga)
 * Side view, facing right: from the low lunge (near foot planted ahead,
 * far knee down behind), the torso leans forward and low and both hands
 * come to the floor inside the front foot, elbows bending toward the
 * floor. The hips sink a little more; hold, then back up. The back knee is
 * the fixed point; the front foot stays put.
 */
import { STAND_SIDE, angleBetween, arm, leg, neckFrom, point } from "../engine/helpers.js";

const KNEE_BACK = [44, 141];
const FRONT_ANKLE = [108, 144];
const HANDS = [114, 144];

const HIP_START = point(KNEE_BACK, 30, 40);
const HIP_LOW = point(KNEE_BACK, 30, 60);
const TORSO_LOW = 84; // nearly level, chest forward

const legs = (hip) => ({
  thighL: angleBetween(hip, KNEE_BACK),
  shinL: 270,
  footL: 270,
  ...leg("R", hip, FRONT_ANKLE, "fwd"),
  footR: 90,
});

export default {
  view: "side",
  root: "kneeL",
  at: KNEE_BACK,

  start: {
    ...STAND_SIDE,
    ...legs(HIP_START),
    torso: 20,
    head: 22,
    // hands resting on the front knee
    armR: 150,
    forearmR: 110,
    armL: 152,
    forearmL: 112,
  },

  poses: {
    lizard: {
      ...legs(HIP_LOW),
      torso: TORSO_LOW,
      head: TORSO_LOW + 8,
      ...arm("R", neckFrom(HIP_LOW, TORSO_LOW), HANDS, "back"),
      ...arm("L", neckFrom(HIP_LOW, TORSO_LOW), [HANDS[0] - 3, HANDS[1]], "back"),
    },
  },

  timeline: [
    { to: "lizard", s: 1.4, ease: "slow", say: "Manos por dentro del pie" },
    { to: "lizard", s: 2.2, say: "Bajá la cadera sin forzar" },
    { to: "start", s: 1.2, ease: "slow", say: "Volvé despacio" },
    { to: "start", s: 0.4 },
  ],
};
