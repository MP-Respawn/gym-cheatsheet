/*
 * Barco / Navasana (yoga)
 * Side view, starting flat on the back with the head to the left. The body
 * folds into a V balanced on the seat: torso leaning back, legs straight
 * and up, arms reaching forward parallel to the floor. Shown as a still
 * hold (anim.hold in exercises.js) in the V. The hips are the fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [84, 141];

// The V: torso back at 40 degrees, legs up at 40 degrees, arms forward.
const V = {
  torso: 320,
  head: 332,
  ...both("thigh", 50),
  ...both("shin", 50),
  ...both("foot", 40),
  armR: 88,
  forearmR: 88,
  armL: 92,
  forearmL: 92,
};

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

  poses: { v: V },

  timeline: [
    { to: "v", s: 0.9, say: "Subí a la V" },
    { to: "v", s: 2.4, say: "Sostené, pecho alto" },
    { to: "start", s: 1, ease: "slow", say: "Bajá despacio" },
    { to: "start", s: 0.5 },
  ],
};
