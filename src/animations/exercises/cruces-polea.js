/*
 * Cruces de polea para pecho
 * Front view, standing between two high pulleys (frame posts at the edges,
 * pulley wheels near the top corners). A cable runs from each pulley to
 * one hand and stretches as the arms move. The arms start open, wide and
 * high, and sweep down and in until the hands meet in front at waist
 * height; squeeze, then open slowly. The elbows keep the same slight bend
 * the whole time (the trainer's "codos apenas flexionados y fijos").
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 52];
const SHOULDER_R = [93, 52];
const PULLEY_L = [12, 12];
const PULLEY_R = [148, 12];

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // open: hands wide and high, reaching toward the pulleys. Same slight
    // bend as the closed pose, so the elbow sits a bit above the line.
    ...arm("L", SHOULDER_L, [34, 31], "up"),
    ...arm("R", SHOULDER_R, [126, 31], "up"),
  },

  poses: {
    // closed: hands together in front of the waist, elbows pointing out
    closed: {
      ...arm("L", SHOULDER_L, [78, 90], "back"),
      ...arm("R", SHOULDER_R, [82, 90], "fwd"),
    },
  },

  timeline: [
    { to: "closed", s: 0.9, say: "Juntá adelante" },
    { to: "closed", s: 0.6, say: "Apretá el pecho" },
    { to: "start", s: 1.4, ease: "slow", say: "Abrí controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the two pulley towers and their wheels
    { kind: "line", from: [6, 6], to: [6, 148] },
    { kind: "line", from: [154, 6], to: [154, 148] },
    { kind: "line", from: [6, 8], to: [12, 8] },
    { kind: "line", from: [148, 8], to: [154, 8] },
    { kind: "disc", c: PULLEY_L, r: 3 },
    { kind: "disc", c: PULLEY_R, r: 3 },
    // one cable to each hand, stretching as the hands travel
    { kind: "cable", anchor: PULLEY_L, to: "handL" },
    { kind: "cable", anchor: PULLEY_R, to: "handR" },
  ],
};
