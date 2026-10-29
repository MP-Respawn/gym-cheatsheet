/*
 * Sentadilla isométrica en la pared
 * Side view, facing right, the whole back flat against a wall on the left.
 * Thighs horizontal, knees at 90 degrees over the ankles, feet flat, hands
 * resting on the thighs. It is a hold: the only movement is a slow breath
 * (the chest rises a touch and settles), like the yoga holds.
 * Cues shown: the whole back on the wall, knees at 90 degrees, breathe and
 * hold.
 * The hip is the fixed point; the feet and the hands stay put.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const WALL_X = 52;
const HIP = [60, 114]; // back against the wall, thighs level

const NEAR_ANKLE = [90, 144]; // knee straight over the ankle
const FAR_ANKLE = [87, 144];
const HAND_R = [78, 110]; // resting on the thighs
const HAND_L = [76, 111];

// Torso upright on the wall; the breath leans the chest 3 degrees away.
const TORSO = 0;
const TORSO_BREATHE = 3;

function pose(torso, head) {
  const neck = neckFrom(HIP, torso);
  return {
    torso,
    head,
    ...leg("R", HIP, NEAR_ANKLE, "fwd"),
    ...leg("L", HIP, FAR_ANKLE, "fwd"),
    ...both("foot", 90),
    ...arm("R", neck, HAND_R, "down"),
    ...arm("L", neck, HAND_L, "down"),
  };
}

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: { ...STAND_SIDE, ...pose(TORSO, 6) },

  poses: {
    breathe: pose(TORSO_BREATHE, 3),
  },

  timeline: [
    { to: "breathe", s: 1.3, ease: "slow", say: "Espalda entera en la pared" },
    { to: "start", s: 1.3, ease: "slow", say: "Rodillas a 90 grados" },
    { to: "breathe", s: 1.3, ease: "slow", say: "Respirá y aguantá" },
    { to: "start", s: 1.3, ease: "slow", say: "Respirá y aguantá" },
  ],

  props: [
    // the wall, with a few hatch marks on its far side
    { kind: "line", from: [WALL_X, 20], to: [WALL_X, 148] },
    { kind: "line", from: [WALL_X, 40], to: [WALL_X - 6, 46] },
    { kind: "line", from: [WALL_X, 64], to: [WALL_X - 6, 70] },
    { kind: "line", from: [WALL_X, 88], to: [WALL_X - 6, 94] },
    { kind: "line", from: [WALL_X, 112], to: [WALL_X - 6, 118] },
    { kind: "line", from: [WALL_X, 136], to: [WALL_X - 6, 142] },
  ],
};
