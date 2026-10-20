/*
 * Plancha frontal isométrica
 * Side view, head to the right. Starts on the knees, lifts into a forearm
 * plank, holds it (the actual exercise), and drops back to the knees.
 * The near elbow is the fixed point: the forearm never leaves the floor.
 */
import { STAND_SIDE, angleBetween, both, leg } from "../engine/helpers.js";

const ELBOW = [117, 141];
const SHOULDER = [117, 120]; // upper arm vertical over the elbow

// Plank: one straight line from the ankle to the shoulder.
const ANKLE_PLANK = [26, 133];
const HIP_PLANK = [85, 124];

// On the knees: hips lower, knees on the floor, feet up in the air.
const HIP_KNEES = [88, 130];
const KNEE_DOWN = [60, 140];
const ANKLE_UP = [36, 120];

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW,

  start: {
    ...STAND_SIDE,
    ...both("arm", 180), // upper arms vertical
    ...both("forearm", 90), // forearms flat on the floor
    torso: angleBetween(HIP_KNEES, SHOULDER),
    head: angleBetween(HIP_KNEES, SHOULDER) - 10,
    ...both("thigh", angleBetween(HIP_KNEES, KNEE_DOWN)),
    ...both("shin", angleBetween(KNEE_DOWN, ANKLE_UP)),
    ...both("foot", 230),
  },

  poses: {
    plank: {
      // arms would follow the torso unless pinned here
      ...both("arm", 180),
      ...both("forearm", 90),
      torso: angleBetween(HIP_PLANK, SHOULDER),
      ...leg("R", HIP_PLANK, ANKLE_PLANK, "down"),
      ...leg("L", HIP_PLANK, ANKLE_PLANK, "down"),
      ...both("foot", 200), // on the toes
    },
  },

  timeline: [
    { to: "plank", s: 0.8, say: "Subí a plancha" },
    { to: "plank", s: 2.6, say: "Sostené: tensión en el abdomen" },
    { to: "start", s: 0.8, say: "Bajá las rodillas" },
    { to: "start", s: 0.6 },
  ],
};
