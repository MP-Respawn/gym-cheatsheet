/*
 * Máquina de aductores
 * Front view, seated on the machine, hands on the side handles. The mirror
 * image of the abductor machine: it STARTS with the legs wide open and the
 * pads on the INSIDE of the knees; the legs squeeze together hard, hold,
 * then open slowly back to wide ("abrí controlado"). The weight stack on
 * the right rises while the legs are closed.
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
    // legs wide open, feet out on the footrests
    ...mirror("thigh", 118),
    ...mirror("shin", 168),
    ...mirror("foot", 90),
    // hands on the side handles of the seat
    ...arm("L", SHOULDER_L, [60, 100], "back"),
    ...arm("R", SHOULDER_R, [100, 100], "fwd"),
  },

  poses: {
    closed: {
      ...mirror("thigh", 186), // knees squeezed together
      ...mirror("shin", 180),
      ...mirror("foot", 90),
    },
  },

  timeline: [
    { to: "closed", s: 0.6, ease: "fast", say: "Cerrá con fuerza" },
    { to: "closed", s: 0.4, say: "Cerrá con fuerza" },
    { to: "start", s: 1.1, ease: "slow", say: "Abrí controlado" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // seat and post, frame and weight stack (rises while closed)
    { kind: "rect", x: 60, y: 102, w: 40, h: 6 },
    { kind: "line", from: [80, 108], to: [80, 148] },
    { kind: "line", from: [140, 30], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { closed: [0, -14] } },
    // pads on the inside of the knees, they move with the legs
    { kind: "rect", on: "shinL", at: 0.08, x: 2, y: -6, w: 3, h: 12, layer: "near" },
    { kind: "rect", on: "shinR", at: 0.08, x: -5, y: -6, w: 3, h: 12, layer: "near" },
  ],
};
