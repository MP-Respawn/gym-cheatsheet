/*
 * Máquina de abductores
 * Front view, seated on the machine, hands on the side handles. Starts with
 * the knees together and the pads on the OUTSIDE of the knees; the legs
 * push out fast, short hold, and come back in slower ("volvé controlado").
 * Two reps. The weight stack on the right rises with each push.
 * Seated thighs point toward us, so they are drawn short (see jalon-pecho).
 */
import { STAND_FRONT, arm, mirror } from "../engine/helpers.js";

const SHOULDER_L = [67, 68];
const SHOULDER_R = [93, 68];

export default {
  view: "front",
  root: "hip",
  at: [80, 100],
  lengths: { thighL: 14, thighR: 14 },

  start: {
    ...STAND_FRONT,
    // knees together, lower legs straight down to the footrests
    ...mirror("thigh", 188),
    ...mirror("shin", 180),
    ...mirror("foot", 90),
    // hands on the side handles of the seat
    ...arm("L", SHOULDER_L, [60, 100], "back"),
    ...arm("R", SHOULDER_R, [100, 100], "fwd"),
  },

  poses: {
    out: {
      ...mirror("thigh", 125), // knees pushed wide
      ...mirror("shin", 170), // feet travel out with the knees
    },
  },

  timeline: [
    { to: "out", s: 0.6, ease: "fast", say: "Empujá hacia afuera" },
    { to: "out", s: 0.3, say: "Empujá hacia afuera" },
    { to: "start", s: 1, ease: "slow", say: "Volvé controlado" },
    { to: "out", s: 0.6, ease: "fast", say: "Empujá hacia afuera" },
    { to: "out", s: 0.3, say: "Empujá hacia afuera" },
    { to: "start", s: 1, ease: "slow", say: "Volvé controlado" },
  ],

  props: [
    // seat and post, frame and weight stack (rises with the push)
    { kind: "rect", x: 60, y: 102, w: 40, h: 6 },
    { kind: "line", from: [80, 108], to: [80, 148] },
    { kind: "line", from: [140, 30], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { out: [0, -14] } },
    // pads on the outside of the knees, they move with the legs
    { kind: "rect", on: "shinL", at: 0.08, x: -8, y: -6, w: 4, h: 12, layer: "near" },
    { kind: "rect", on: "shinR", at: 0.08, x: 4, y: -6, w: 4, h: 12, layer: "near" },
  ],
};
