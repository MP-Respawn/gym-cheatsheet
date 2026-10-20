/*
 * Camilla de isquios
 * Side view, lying face down on the leg curl machine, head to the right,
 * hands on the front handles. The hip is the fixed point and stays glued to
 * the pad ("cadera pegada a la camilla"). The lower legs curl up against
 * the roller behind the ankles until the heels are over the knees, short
 * squeeze, then a slower controlled way down. The weight stack on the right
 * rises with each curl.
 */
import { STAND_SIDE, arm, both } from "../engine/helpers.js";

const HIP = [78, 100];
const NECK = [110, 100];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 90, // lying flat, face down
    head: 72, // chin a little up
    ...both("thigh", 270), // thighs on the pad
    ...both("shin", 270), // lower legs straight, off the end of the pad
    ...both("foot", 180), // toes down
    ...arm("R", NECK, [116, 128], "back"), // hands on the handles under the pad
    ...arm("L", NECK, [113, 128], "back"),
  },

  poses: {
    up: { ...both("shin", 25) }, // heels toward the glutes
  },

  timeline: [
    { to: "up", s: 0.7, ease: "fast", say: "Subí completo" },
    { to: "up", s: 0.3, say: "Subí completo" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // bench pad (ends at the knees), its legs, front handle post
    { kind: "rect", x: 46, y: 104, w: 84, h: 7 },
    { kind: "line", from: [58, 111], to: [58, 148] },
    { kind: "line", from: [118, 111], to: [118, 148] },
    // roller behind the ankles, moves with the lower leg
    { kind: "disc", on: "shinR", at: 0.88, dy: -6, r: 5 },
    // weight stack
    { kind: "line", from: [146, 40], to: [146, 148] },
    { kind: "rect", x: 138, y: 112, w: 16, h: 30, fill: true, shift: { up: [0, -14] } },
  ],
};
