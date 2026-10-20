/*
 * Camilla de cuádriceps isométrica descendente
 * Side view, seated on the same machine as camilla-cuadriceps (same body
 * and props). One extension, then a long still hold with the knees
 * straight (the isometric part), a slow way down and a short rest: one
 * round of the descending ladder (7 reps + 7 seconds, drop one plate, 6 + 6,
 * and so on). The weight stack stays up during the whole hold.
 * Simplification: the reps before each hold are not drawn, and the 7 second
 * hold is shortened to about 2 seconds so the loop stays short.
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
    { to: "up", s: 2.2, say: "Sostené arriba 7 segundos" },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.7 },
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
