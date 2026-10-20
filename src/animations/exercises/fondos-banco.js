/*
 * Fondos en banco
 * Side view, facing right. Hands on the edge of a bench behind the body,
 * legs out in front with the heels on the floor. The near hand on the bench
 * is the fixed point: the body hangs from the arms. The body goes down close
 * to the bench until the elbows are at about 90 degrees (pointing back over
 * the bench), then pushes back up. Slow way down, short pause, firm way up.
 *
 * Simplification: the heels stay put, so the knees bend a little at the
 * bottom (the hips cannot slide back through the bench).
 */
import { STAND_SIDE, arm, leg, point } from "../engine/helpers.js";

const HAND = [60, 116]; // near hand on the bench edge
const HAND_FAR = [57, 116];
const HEEL = [111, 143];
const HEEL_FAR = [107, 143];

// Shoulders: arms straight at the top, elbows at about 90 at the bottom.
const SH_TOP = [63, 76];
const SH_LOW = [68, 89];
const HIP_TOP = point(SH_TOP, 32, 180); // torso upright, back by the bench
const HIP_LOW = point(SH_LOW, 32, 180);

export default {
  view: "side",
  root: "handR",
  at: HAND,

  start: {
    ...STAND_SIDE,
    torso: 0,
    head: 0,
    ...arm("R", SH_TOP, HAND, "back"),
    ...arm("L", SH_TOP, HAND_FAR, "back"),
    ...leg("R", HIP_TOP, HEEL, "up"),
    ...leg("L", HIP_TOP, HEEL_FAR, "up"),
    footR: 30, // on the heels, toes up
    footL: 30,
  },

  poses: {
    bottom: {
      ...arm("R", SH_LOW, HAND, "back"),
      ...arm("L", SH_LOW, HAND_FAR, "back"),
      ...leg("R", HIP_LOW, HEEL, "up"),
      ...leg("L", HIP_LOW, HEEL_FAR, "up"),
      footR: 30,
      footL: 30,
    },
  },

  timeline: [
    { to: "bottom", s: 1.2, ease: "slow", say: "Bajá a 90 grados" },
    { to: "bottom", s: 0.3, say: "Bajá a 90 grados" },
    { to: "start", s: 0.9, say: "Espalda cerca del banco" },
    { to: "start", s: 0.4, say: "Espalda cerca del banco" },
  ],

  props: [
    // flat bench behind the body
    { kind: "rect", x: 14, y: 118, w: 48, h: 6 },
    { kind: "line", from: [20, 124], to: [20, 148] },
    { kind: "line", from: [56, 124], to: [56, 148] },
  ],
};
