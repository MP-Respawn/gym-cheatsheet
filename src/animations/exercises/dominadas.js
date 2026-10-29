/*
 * Dominadas
 * Side view, facing right, hanging from a pull-up bar (seen end-on) under
 * the rack's top rail. The near hand on the bar is the fixed point: the
 * whole body is hung from it. Legs hang with the knees a little bent and
 * the feet tucked back. Pull until the chin passes the bar (about 0.9 s),
 * then lower slowly (about 1.3 s) to straight arms, without swinging.
 */
import { STAND_SIDE, arm } from "../engine/helpers.js";

const BAR = [86, 20];
const BAR_FAR = [83, 20]; // far hand, a little behind so both show

// Shoulders: hanging under the bar, and up at bar height at the top.
const SH_LOW = [79, 59];
const SH_TOP = [74, 25];
const TORSO_LOW = 8; // slight lean back
const TORSO_TOP = 3;

export default {
  view: "side",
  root: "handR",
  at: BAR,
  floor: false,

  start: {
    ...STAND_SIDE,
    torso: TORSO_LOW,
    head: 6,
    // legs hanging, knees slightly bent back, feet pointing down and back
    thighR: 178,
    thighL: 181,
    shinR: 212,
    shinL: 209,
    footR: 146,
    footL: 148,
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
    { to: "top", s: 0.9, say: "Pecho a la barra" },
    { to: "top", s: 0.2, say: "Mentón arriba de la barra" },
    { to: "start", s: 1.3, ease: "slow", say: "Bajá controlado, sin balancearte" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // rack: top rail, post, and the bar seen end-on
    { kind: "line", from: [40, BAR[1]], to: [132, BAR[1]] },
    { kind: "line", from: [132, BAR[1]], to: [132, 158] },
    { kind: "disc", c: BAR, r: 3, fill: true, layer: "front" },
  ],
};
