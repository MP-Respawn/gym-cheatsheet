/*
 * Press declinado con barra
 * Side view, lying on a decline bench under a rack: the pad slopes DOWN
 * toward the head (on the left) and the legs bend over the high end, hooked
 * on the roller. The hip on the pad is the fixed point. Both hands on one
 * barbell, seen from the side as a big plate. The bar comes down to the
 * LOWER chest (elbows dropping below the bench line) in ~1.1 s and is
 * pressed straight back up over the shoulders in ~0.7 s, then a short hold.
 * Differs from press-plano: sloped pad, bent legs on the roller, bar path
 * to the lower chest. The two rack uprights overlap in side view, so they
 * are drawn as one.
 */
import { STAND_SIDE, angleBetween, arm, neckFrom, point } from "../engine/helpers.js";

// Top surface of the pad, from the head end (lower) to the foot end (higher).
const PAD_HEAD = [34, 121];
const PAD_FOOT = [104, 107];
const TORSO = angleBetween(PAD_FOOT, PAD_HEAD); // about 259: along the pad, toward the low head end
const HIP = [90, 106];
const NECK = neckFrom(HIP, TORSO); // about [59, 112]

// Lower chest: a bit down the torso from the shoulders, a plate's radius above the body.
const LOWER_CHEST = point(point(NECK, 14, TORSO + 180), 11, TORSO + 90);
const BAR_TOP = [57, 72]; // straight over the shoulders
const ROLLER = [110, 104]; // the legs hook over it at the high end

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO,
    // knees over the high end of the bench, shins hanging past the roller
    thighR: 70,
    shinR: 172,
    footR: 100,
    thighL: 68,
    shinL: 170,
    footL: 100,
    // top: bar over the shoulders, both hands on it
    ...arm("R", NECK, BAR_TOP, "fwd"),
    ...arm("L", NECK, [BAR_TOP[0] - 2, BAR_TOP[1]], "fwd"),
  },

  poses: {
    // bar on the lower chest, elbows below the bench line
    bottom: {
      ...arm("R", NECK, LOWER_CHEST, "down"),
      ...arm("L", NECK, [LOWER_CHEST[0] - 2, LOWER_CHEST[1]], "down"),
    },
  },

  timeline: [
    { to: "bottom", s: 1.1, ease: "slow", say: "Bajá a la parte baja del pecho" },
    { to: "bottom", s: 0.15 },
    { to: "start", s: 0.7, say: "Empujá derecho" },
    { to: "start", s: 0.6, say: "Pies trabados, cola apoyada" },
  ],

  props: [
    // rack upright by the head, behind everything
    { kind: "line", from: [46, 58], to: [46, 148] },
    { kind: "line", from: [43, 66], to: [49, 66] },
    // decline pad (a thick slanted slab) and its two legs
    {
      kind: "path",
      d: `M${PAD_HEAD[0]} ${PAD_HEAD[1]} L${PAD_FOOT[0]} ${PAD_FOOT[1]} L${PAD_FOOT[0]} ${PAD_FOOT[1] + 6} L${PAD_HEAD[0]} ${PAD_HEAD[1] + 6} Z`,
    },
    { kind: "line", from: [44, 125], to: [44, 148] },
    { kind: "line", from: [98, 114], to: [98, 148] },
    // leg roller on a short arm at the high end
    { kind: "line", from: [104, 109], to: ROLLER },
    { kind: "disc", c: ROLLER, r: 4, fill: true },
    // barbell seen from the side: a plate at the hands
    { kind: "disc", on: "forearmR", r: 9 },
  ],
};
