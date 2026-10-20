/*
 * Jalón al pecho en polea
 * Front view, seated. Arms start straight up holding a wide bar; the elbows
 * drive down and out until the bar reaches the chest. The weight stack on
 * the right rises as you pull. Quick pull, short squeeze, slow return.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 72];
const SHOULDER_R = [93, 72];

export default {
  view: "front",
  root: "hip",
  at: [80, 104],
  // seated: thighs point toward us, so they look short
  lengths: { thighL: 14, thighR: 14 },

  start: {
    ...STAND_FRONT,
    thighL: 232,
    thighR: 128,
    shinL: 181,
    shinR: 179,
    ...arm("L", SHOULDER_L, [54, 34], "back"),
    ...arm("R", SHOULDER_R, [106, 34], "fwd"),
  },

  poses: {
    pulled: {
      ...arm("L", SHOULDER_L, [50, 70], "down"),
      ...arm("R", SHOULDER_R, [110, 70], "down"),
    },
  },

  timeline: [
    { to: "pulled", s: 0.8, ease: "fast", say: "Tirá al pecho, pecho arriba" },
    { to: "pulled", s: 0.4, say: "Apretá" },
    { to: "start", s: 1.3, ease: "slow", say: "Subida controlada" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // machine: seat, post, frame and weight stack (rises with the pull)
    { kind: "rect", x: 60, y: 106, w: 40, h: 6 },
    { kind: "line", from: [80, 112], to: [80, 148] },
    { kind: "line", from: [140, 6], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { pulled: [0, -16] } },
    // overhead cable to the middle of the bar, and the bar itself
    { kind: "cable", anchor: [80, 2], to: ["handL", "handR"] },
    { kind: "span", from: "handL", to: "handR", extend: 10 },
  ],
};
