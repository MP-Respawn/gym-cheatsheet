/*
 * Sentadilla búlgara
 * Side view, facing right. The near leg is in front with the foot flat on
 * the floor (the fixed point); the far leg reaches back with the top of
 * the foot resting on a bench. Dumbbells hang in both hands. The hips drop
 * straight down (~1.2 s) until the front thigh is about parallel and the
 * back knee is close to the floor, then the front leg drives back up
 * (~0.8 s). Torso only slightly forward.
 * Cues shown: go down vertically, the front knee does not travel much past
 * the toes, push up with the front leg.
 */
import { STAND_SIDE, angleBetween, both, leg } from "../engine/helpers.js";

const FRONT_ANKLE = [100, 144]; // root
const BACK_ANKLE = [54, 107]; // resting on the bench (bench top y = 112)
const BACK_TOE = [42, 109]; // instep on the pad, toes pointing back

// Hip straight above the same spot, top and bottom (vertical path).
const HIP_TOP = [82, 88];
const HIP_HALF = [82, 101];
const HIP_LOW = [82, 114];

// Arms hang straight down with the dumbbells, whatever the torso does.
const ARMS_DOWN = { ...both("arm", 180), ...both("forearm", 180) };
const BACK_FOOT = { footL: angleBetween(BACK_ANKLE, BACK_TOE), footR: 90 };

export default {
  view: "side",
  root: "ankleR",
  at: FRONT_ANKLE,

  start: {
    ...STAND_SIDE,
    torso: 6,
    ...leg("R", HIP_TOP, FRONT_ANKLE),
    ...leg("L", HIP_TOP, BACK_ANKLE, "down"),
    ...BACK_FOOT,
    ...ARMS_DOWN,
    armL: 176, // far dumbbell a little behind so both show
    forearmL: 176,
  },

  poses: {
    // halfway: keeps the hips on their vertical line between top and bottom
    half: {
      ...leg("R", HIP_HALF, FRONT_ANKLE),
      ...leg("L", HIP_HALF, BACK_ANKLE, "down"),
      ...BACK_FOOT,
      torso: 10,
      ...ARMS_DOWN,
    },
    bottom: {
      ...leg("R", HIP_LOW, FRONT_ANKLE),
      ...leg("L", HIP_LOW, BACK_ANKLE, "down"),
      ...BACK_FOOT,
      torso: 14, // torso just slightly forward
      ...ARMS_DOWN,
    },
  },

  timeline: [
    { to: "half", s: 0.6, ease: "linear", say: "Bajá vertical" },
    { to: "bottom", s: 0.6, ease: "linear", say: "Bajá vertical" },
    { to: "bottom", s: 0.2, say: "Bajá vertical" },
    { to: "half", s: 0.4, ease: "linear", say: "Subí con la pierna de adelante" },
    { to: "start", s: 0.4, ease: "linear", say: "Subí con la pierna de adelante" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // bench behind: pad and two legs
    { kind: "rect", x: 22, y: 112, w: 38, h: 6, fill: true },
    { kind: "line", from: [28, 118], to: [28, 148] },
    { kind: "line", from: [48, 118], to: [48, 148] },
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
