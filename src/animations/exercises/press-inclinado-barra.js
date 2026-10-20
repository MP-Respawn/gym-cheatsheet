/*
 * Pecho a 45 grados con barra (press inclinado)
 * Side view, facing right, seated on an incline bench (backrest at ~40
 * degrees, seat, post), feet planted. Barbell seen from the side as a big
 * plate. The bar comes down to the UPPER chest, elbows dropping toward the
 * hips, then is pressed straight up over the shoulders. A midpoint pose
 * keeps the bar path straight (a barbell does not arc like dumbbells);
 * each half is eased "in" then "fast" so the move flows through it. The
 * last hold shows the pyramid 12/10/8 from the prescription.
 * Simplification: no rack (it would cover the head); the Smith option is
 * not shown.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const TORSO = 310; // back on the backrest, 40 degrees above horizontal
const HIP = [76, 112];
const NECK = neckFrom(HIP, TORSO); // about [52, 91]

// Upper chest: a little below the neck along the torso, a plate's radius out.
const UPPER_CHEST = point(point(NECK, 4, TORSO + 180), 9, TORSO + 90);
const BAR_TOP = [54, 52]; // straight over the shoulders
// Halfway down, on the straight line between top and chest.
const BAR_MID = [(BAR_TOP[0] + UPPER_CHEST[0]) / 2, (BAR_TOP[1] + UPPER_CHEST[1]) / 2];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 318,
    ...leg("R", HIP, [112, 144], "up"),
    ...leg("L", HIP, [107, 144], "up"),
    ...FEET_FLAT,
    // top: bar straight over the shoulders
    ...arm("R", NECK, BAR_TOP, "fwd"),
    ...arm("L", NECK, [BAR_TOP[0] - 2, BAR_TOP[1]], "fwd"),
  },

  poses: {
    mid: {
      ...arm("R", NECK, BAR_MID, "down"),
      ...arm("L", NECK, [BAR_MID[0] - 2, BAR_MID[1]], "down"),
    },
    // bar on the upper chest, elbows down toward the hips
    bottom: {
      ...arm("R", NECK, UPPER_CHEST, "down"),
      ...arm("L", NECK, [UPPER_CHEST[0] - 2, UPPER_CHEST[1]], "down"),
    },
  },

  timeline: [
    { to: "mid", s: 0.6, ease: "in", say: "Bajá al pecho alto" },
    { to: "bottom", s: 0.6, ease: "fast", say: "Bajá al pecho alto" },
    { to: "bottom", s: 0.2 },
    { to: "mid", s: 0.4, ease: "in", say: "Empujá" },
    { to: "start", s: 0.4, ease: "fast", say: "Empujá" },
    { to: "start", s: 0.7, say: "Pirámide 12/10/8" },
  ],

  props: [
    // incline backrest (a thick slanted pad), its support, seat and post
    { kind: "path", d: "M73 116 L38 86 L34 90 L69 120 Z" },
    { kind: "line", from: [48, 101], to: [48, 148] },
    { kind: "rect", x: 62, y: 116, w: 34, h: 6 },
    { kind: "line", from: [80, 122], to: [80, 148] },
    // barbell seen from the side: a plate at the hands
    { kind: "disc", on: "forearmR", r: 9 },
  ],
};
