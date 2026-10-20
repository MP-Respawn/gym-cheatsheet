/*
 * Buenos días con barra liviana
 * Side view, facing right. Light bar on the upper back, held with both
 * hands like the barbell squat. The near ankle is the fixed point, feet
 * flat. Knees only slightly bent and they stay that way; the hips go back
 * and the straight back tips forward to about 80 degrees, then comes back
 * up. Two reps. The hands ride on the bar because the arms follow the torso.
 */
import { STAND_SIDE, arm, both, leg } from "../engine/helpers.js";

const ANKLE = [86, 144];
const ANKLE_FAR = [82, 144];

const HIP_UP = [85, 85]; // knees just unlocked
const HIP_LOW = [68, 89]; // hips back, about the same height

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP_UP, ANKLE),
    ...leg("L", HIP_UP, ANKLE_FAR),
    torso: 1,
    head: 1,
    // hands up on the bar behind the neck
    ...arm("R", [86, 53], [82, 51], "back"),
    ...arm("L", [86, 53], [79, 51], "back"),
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, ANKLE),
      ...leg("L", HIP_LOW, ANKLE_FAR),
      ...both("foot", 90), // feet flat
      torso: 80,
      head: 72, // eyes a little ahead, neck in line
    },
  },

  timeline: [
    { to: "start", s: 0.5, say: "Rodillas apenas flexionadas" },
    { to: "bottom", s: 1.3, ease: "slow", say: "Cola atrás, espalda recta" },
    { to: "start", s: 1 },
    { to: "bottom", s: 1.3, ease: "slow", say: "Cola atrás, espalda recta" },
    { to: "start", s: 1 },
  ],

  props: [
    // light barbell seen from the side, on the upper back
    { kind: "disc", on: "torso", dx: -6, dy: 1, r: 6 },
  ],
};
