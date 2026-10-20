/*
 * Camilla de cuádriceps (calentamiento)
 * Side view, seated on the machine. The lower leg kicks up against the pad
 * to straight, then lowers. Two quick warm-up reps; the weight stack on the
 * right rises with each one.
 */
import { STAND_SIDE, arm, both } from "../engine/helpers.js";

const HIP = [70, 104];
const NECK = [66, 72]; // torso leaning back a little on the backrest

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 353,
    head: 358,
    ...both("thigh", 90), // thighs on the seat
    thighL: 92,
    ...both("shin", 180), // lower legs hanging
    ...both("foot", 90),
    ...arm("R", NECK, [80, 108], "back"), // hands on the side handles
    ...arm("L", NECK, [78, 108], "back"),
  },

  poses: {
    up: { ...both("shin", 92) }, // knees straight
  },

  timeline: [
    { to: "up", s: 0.6, say: "Extendé completo" },
    { to: "start", s: 0.8, say: "Bajá controlado" },
    { to: "up", s: 0.6, say: "Extendé completo" },
    { to: "start", s: 0.8, say: "Bajá controlado" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // seat, backrest, post
    { kind: "rect", x: 48, y: 107, w: 54, h: 7 },
    { kind: "line", from: [55, 106], to: [49, 62] },
    { kind: "line", from: [74, 114], to: [74, 148] },
    // padded lever in front of the ankle, moves with the shin
    { kind: "disc", on: "shinR", at: 0.85, dx: 6, r: 5 },
    // weight stack
    { kind: "line", from: [138, 60], to: [138, 148] },
    { kind: "rect", x: 130, y: 112, w: 16, h: 30, fill: true, shift: { up: [0, -12] } },
  ],
};
