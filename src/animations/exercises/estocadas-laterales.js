/*
 * Estocadas laterales
 * FRONT view. Wide stance, one light dumbbell held against the chest with
 * both hands. The hips shift to one side and drop a little: that knee
 * bends over the foot while the other leg stays straight (the stretch on
 * the adductor). Back to the middle, then the same to the other side.
 * Cues shown: wide step, short descent, light weight and clean technique.
 * Simplification: the feet stay in the wide stance instead of stepping out
 * and back each rep, and "cola atrás" (hips back) points toward the camera,
 * so it only shows as the hips dropping and sliding sideways.
 *
 * Root is the hip, moved with $root; both feet reach fixed floor points.
 */
import { STAND_FRONT, arm, leg } from "../engine/helpers.js";

const HIP = [80, 91]; // standing in the middle (the root), legs almost straight
const ANKLE_L = [46, 144];
const ANKLE_R = [114, 144];

// Lunging to each side: hips over the bent leg, only 9 units lower
// (the trainer asks for a wide step and a short descent).
const HIP_RIGHT = [92, 100];
const HIP_LEFT = [68, 100];

const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const side = (dx) => [dx, 0]; // pelvis half-width is 6 in front view
const plus = (p, d) => [p[0] + d[0], p[1] + d[1]];

// Feet point outward and stay flat (they would follow the shins otherwise).
const FEET = { footL: 270, footR: 90 };

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    ...leg("L", plus(HIP, side(-6)), ANKLE_L, "back"),
    ...leg("R", plus(HIP, side(6)), ANKLE_R, "fwd"),
    ...FEET,
    // shoulders are 13 to each side of the neck [80, 59]; hands meet at
    // the chest holding the dumbbell, elbows down
    ...arm("L", [67, 59], [77, 71], "down"),
    ...arm("R", [93, 59], [83, 71], "down"),
  },

  poses: {
    // right knee bends out over the right foot, left leg straight
    right: {
      $root: off(HIP_RIGHT),
      ...leg("R", plus(HIP_RIGHT, side(6)), ANKLE_R, "fwd"),
      ...leg("L", plus(HIP_RIGHT, side(-6)), ANKLE_L, "back"),
      ...FEET,
      torso: 357, // chest stays a bit toward the middle
    },
    // mirror image
    left: {
      $root: off(HIP_LEFT),
      ...leg("L", plus(HIP_LEFT, side(-6)), ANKLE_L, "back"),
      ...leg("R", plus(HIP_LEFT, side(6)), ANKLE_R, "fwd"),
      ...FEET,
      torso: 3,
    },
  },

  timeline: [
    { to: "right", s: 0.9, say: "Paso amplio, cola atrás" },
    { to: "right", s: 0.2, say: "Paso amplio, cola atrás" },
    { to: "start", s: 0.7 },
    { to: "left", s: 0.9, say: "Al otro lado" },
    { to: "left", s: 0.2, say: "Al otro lado" },
    { to: "start", s: 0.7 },
  ],

  props: [
    // the dumbbell, held upright between both hands at the chest
    { kind: "disc", on: "forearmR", dx: -3, dy: 2, r: 6 },
  ],
};
