/*
 * Skipping
 * Side view, facing right, running in place with high knees. The hip is
 * the fixed point (it bobs a little); the swinging leg drives the thigh
 * up to horizontal with the shin hanging down (knee at hip height), the
 * support foot stays under the hip on the ball of the foot, heel up, and
 * the arms swing bent at 90 degrees against the legs. Four moments: knee
 * up, switch in the air, the other knee up, switch again.
 * Cues shown: knees to hip height, short contact on the ball of the foot.
 * Simplification: no travel, the feet land where they left.
 */
import { STAND_SIDE, ankleFor, leg } from "../engine/helpers.js";

const HIP = [76, 82]; // hip on the support foot (the root)
const HIP_AIR = [76, 78]; // a little higher while the feet switch
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Support foot on its toes under the hip: the toe stays on the floor and
// the heel is up, so the ankle sits above and behind the toe.
const TOE = [82, 144];
const FOOT_TOES = 120;
const ANKLE_DOWN = ankleFor(TOE, FOOT_TOES);

// The four moments of one leg. Each takes the hip of its pose.
const support = (side, hip) => ({ ...leg(side, hip, ANKLE_DOWN), [`foot${side}`]: FOOT_TOES });
const kneeUp = (side) => ({ [`thigh${side}`]: 90, [`shin${side}`]: 180, [`foot${side}`]: 110 });
const leaving = (side) => ({ [`thigh${side}`]: 175, [`shin${side}`]: 200, [`foot${side}`]: 135 }); // toes just off the floor
const dropping = (side) => ({ [`thigh${side}`]: 150, [`shin${side}`]: 190, [`foot${side}`]: 125 }); // coming down under the hip

// Arms bent at 90 degrees: the upper arm swings, the forearm keeps the bend.
const arms = (near, far) => ({ armR: near, forearmR: near - 90, armL: far, forearmL: far - 90 });

export default {
  view: "side",
  root: "hip",
  at: HIP,

  // near foot on its toes, far knee up at hip height
  start: {
    ...STAND_SIDE,
    torso: 0,
    head: 0,
    ...support("R", HIP),
    ...kneeUp("L"),
    ...arms(160, 200),
  },

  poses: {
    // in the air: near toes leaving the floor, far foot dropping
    switch1: {
      $root: off(HIP_AIR),
      ...leaving("R"),
      ...dropping("L"),
      ...arms(180, 180),
    },
    // mirror of start: far foot on its toes, near knee up
    kneeUp2: {
      ...kneeUp("R"),
      ...support("L", HIP),
      ...arms(200, 160),
    },
    // mirror of switch1
    switch2: {
      $root: off(HIP_AIR),
      ...dropping("R"),
      ...leaving("L"),
      ...arms(180, 180),
    },
  },

  timeline: [
    { to: "switch1", s: 0.22, ease: "linear", say: "Rodillas a la cadera" },
    { to: "kneeUp2", s: 0.22, ease: "linear", say: "Rodillas a la cadera" },
    { to: "switch2", s: 0.22, ease: "linear", say: "Apoyo corto, en la punta del pie" },
    { to: "start", s: 0.22, ease: "linear", say: "Apoyo corto, en la punta del pie" },
  ],
};
