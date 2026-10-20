/*
 * Dominadas asistidas
 * Side view, facing right, kneeling on the assistance pad of the machine and
 * hanging from the bar. The near hand on the bar is the fixed point: the
 * whole body is hung from it. Pull until the chin passes the bar (about
 * 0.9 s), then lower slowly (about 1.3 s) to straight arms. The knee pad
 * rises and falls with the body, as it does on the machine.
 */
import { STAND_SIDE, arm, point } from "../engine/helpers.js";

const BAR = [86, 24];
const BAR_FAR = [83, 24]; // far hand, a little behind so both show

// Shoulders: hanging under the bar, and up at bar height at the top.
const SH_LOW = [79, 63];
const SH_TOP = [74, 29];
const TORSO_LOW = 8; // slight lean back
const TORSO_TOP = 3;
const THIGH = 175; // thighs almost vertical, knees on the pad

// Where the knees are in each pose, to move the pad with them.
const kneeAt = (shoulder, torso) => point(point(shoulder, 32, torso + 180), 30, THIGH);
const KNEE_LOW = kneeAt(SH_LOW, TORSO_LOW);
const KNEE_TOP = kneeAt(SH_TOP, TORSO_TOP);
const PAD_UP = [KNEE_TOP[0] - KNEE_LOW[0], KNEE_TOP[1] - KNEE_LOW[1]];

export default {
  view: "side",
  root: "handR",
  at: BAR,
  floor: false,

  start: {
    ...STAND_SIDE,
    torso: TORSO_LOW,
    head: 6,
    thighL: THIGH,
    thighR: THIGH,
    shinL: 270, // shins back, resting on the pad
    shinR: 270,
    footL: 200,
    footR: 200,
    ...arm("R", SH_LOW, BAR, "fwd"),
    ...arm("L", SH_LOW, BAR_FAR, "fwd"),
  },

  poses: {
    // elbows down in front of the body, chin over the bar
    top: {
      torso: TORSO_TOP,
      ...arm("R", SH_TOP, BAR, "down"),
      ...arm("L", SH_TOP, BAR_FAR, "down"),
    },
  },

  timeline: [
    { to: "top", s: 0.9, say: "Mentón arriba de la barra" },
    { to: "top", s: 0.2, say: "Mentón arriba de la barra" },
    { to: "start", s: 1.3, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // machine column and the pull-up bar (seen end-on)
    { kind: "line", from: [86, 24], to: [112, 24] },
    { kind: "line", from: [112, 24], to: [112, 158] },
    { kind: "disc", c: BAR, r: 3, fill: true, layer: "front" },
    // knee pad and its arm, sliding up with the body
    { kind: "rect", x: KNEE_LOW[0] - 12, y: KNEE_LOW[1] + 3, w: 26, h: 5, shift: { top: PAD_UP } },
    { kind: "line", from: [KNEE_LOW[0] + 14, KNEE_LOW[1] + 5], to: [112, KNEE_LOW[1] + 5], shift: { top: PAD_UP } },
  ],
};
