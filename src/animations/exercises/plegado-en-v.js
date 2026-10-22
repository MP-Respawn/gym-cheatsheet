/*
 * Plegado isométrico en V (vuelta: abdomen isométrico, paso 1)
 * Side view, starting flat on the back with the head to the left. The body
 * folds into a V balanced on the seat: torso leaning back, legs straight
 * and up, arms reaching forward along the legs. Holds ~2.4 s (stands for
 * the 10 s hold) with a small breathing pulse, then lowers slowly. The
 * hips are the fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [84, 141];

// The V: torso back at 40 degrees, legs up at 40 degrees, arms along the legs.
const V = {
  torso: 320,
  head: 332,
  ...both("thigh", 50),
  ...both("shin", 50),
  ...both("foot", 40),
  armR: 58,
  forearmR: 58,
  armL: 61,
  forearmL: 61,
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

  poses: {
    v: V,
    // breathing: the V opens a hair without losing the shape
    breathe: { ...V, torso: 317, head: 329, ...both("thigh", 53), ...both("shin", 53) },
  },

  timeline: [
    { to: "v", s: 0.9, say: "Subí a la V" },
    { to: "breathe", s: 0.8, say: "Sostené: hombros elevados" },
    { to: "v", s: 0.8, say: "Sostené: hombros elevados" },
    { to: "breathe", s: 0.8, say: "Sostené: hombros elevados" },
    { to: "start", s: 1, ease: "slow", say: "Bajá despacio" },
    { to: "start", s: 0.5 },
  ],
};
