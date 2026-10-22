/*
 * Plegado isométrico en V (vuelta: abdomen isométrico, paso 1)
 * Side view, starting flat on the back with the head to the left and the
 * arms on the floor past the head. The body folds into a V balanced on the
 * seat: torso leaning back with the arms overhead in line with it (one side
 * of the V), legs straight and up (the other side). Holds ~2.4 s (stands
 * for the 10 s hold) with a small breathing pulse, then lowers slowly. The
 * hips are the fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [84, 141];

// The V: torso back at 40 degrees with the arms along it, legs up at 40 degrees.
const V = {
  torso: 320,
  head: 332,
  ...both("thigh", 50),
  ...both("shin", 50),
  ...both("foot", 40),
  armR: 318,
  forearmR: 318,
  armL: 323,
  forearmL: 323,
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
    // arms straight past the head, resting on the floor
    armR: 271,
    forearmR: 271,
    armL: 273,
    forearmL: 273,
  },

  poses: {
    v: V,
    // breathing: the V opens a hair without losing the shape
    breathe: {
      ...V,
      torso: 317,
      head: 329,
      armR: 315,
      forearmR: 315,
      armL: 320,
      forearmL: 320,
      ...both("thigh", 53),
      ...both("shin", 53),
    },
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
