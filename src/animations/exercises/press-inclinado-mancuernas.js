/*
 * Press con mancuernas inclinado
 * Side view, facing right, on an incline bench at ~35 degrees (flatter
 * than the barbell incline), feet planted. Two dumbbells (small discs).
 * They come down beside the chest with the elbows a bit tucked (pointing
 * down toward the hips, not flared), then press up in a slight arc: the
 * near and far dumbbells are a few units apart at the bottom and almost
 * together at the top, as they come closer over the chest.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const TORSO = 305; // backrest at 35 degrees above horizontal
const HIP = [76, 112];
const NECK = neckFrom(HIP, TORSO); // about [50, 94]

// Beside the chest: further down the torso than the barbell, close to it.
const CHEST_SIDE = point(point(NECK, 9, TORSO + 180), 5, TORSO + 90);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 315,
    ...leg("R", HIP, [114, 144], "up"),
    ...leg("L", HIP, [109, 144], "up"),
    ...FEET_FLAT,
    // top: dumbbells over the upper chest, near and far almost together
    ...arm("R", NECK, [54, 55], "fwd"),
    ...arm("L", NECK, [53, 55], "fwd"),
  },

  poses: {
    // dumbbells beside the chest, elbows tucked down toward the hips
    bottom: {
      ...arm("R", NECK, CHEST_SIDE, "down"),
      ...arm("L", NECK, [CHEST_SIDE[0] - 5, CHEST_SIDE[1]], "down"),
    },
  },

  timeline: [
    { to: "bottom", s: 1.3, ease: "slow", say: "Codos un poco cerrados" },
    { to: "bottom", s: 0.2 },
    { to: "start", s: 0.9, say: "Empujá arriba" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // incline backrest (35 degrees), its support, seat and post
    { kind: "path", d: "M73 116 L35 89 L32 93 L70 120 Z" },
    { kind: "line", from: [46, 102], to: [46, 148] },
    { kind: "rect", x: 62, y: 116, w: 34, h: 6 },
    { kind: "line", from: [80, 122], to: [80, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmR", r: 5 },
    { kind: "disc", on: "forearmL", r: 5 },
  ],
};
