/*
 * Flexibilidad de cierre
 * Side view, sitting on the floor facing right, legs long. Two of the
 * closing stretches for the back chain, each with a still hold (no
 * bouncing): (1) hamstrings: fold forward over the straight legs with the
 * hands toward the feet, hold, sit back up; (2) glute and low back: lie
 * back and hug the near knee to the chest, the far leg long on the floor,
 * hold, sit back up. The hips on the floor are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [64, 140];

// Fold: chest toward the thighs, back long.
const TORSO_FOLD = 62;

// Lying back for the knee hug.
const TORSO_DOWN = 272;
const KNEE_HUG = 332; // near thigh pulled toward the chest

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 0, // sitting tall
    head: 4,
    ...both("thigh", 90), // legs long on the floor
    ...both("shin", 90),
    ...both("foot", 4), // toes up
    // hands resting on the thighs
    ...arm("R", neckFrom(HIP, 0), [90, 135], "back"),
    ...arm("L", neckFrom(HIP, 0), [88, 136], "back"),
  },

  poses: {
    fold: {
      torso: TORSO_FOLD,
      head: TORSO_FOLD + 12,
      // hands reach toward the feet
      ...arm("R", neckFrom(HIP, TORSO_FOLD), [128, 132], "up"),
      ...arm("L", neckFrom(HIP, TORSO_FOLD), [126, 133], "up"),
    },
    hug: {
      torso: TORSO_DOWN,
      head: TORSO_DOWN + 6,
      thighR: KNEE_HUG,
      shinR: 115,
      footR: 40,
      // both hands wrap the near shin, just below the knee
      ...arm("R", neckFrom(HIP, TORSO_DOWN), [57, 113], "down"),
      ...arm("L", neckFrom(HIP, TORSO_DOWN), [55, 114], "down"),
    },
  },

  timeline: [
    { to: "fold", s: 1.0, ease: "slow", say: "Isquios: estirá sin rebotar" },
    { to: "fold", s: 1.2, say: "Isquios: estirá sin rebotar" },
    { to: "start", s: 0.7 },
    { to: "hug", s: 1.0, say: "Rodilla al pecho" },
    { to: "hug", s: 1.2, say: "Rodilla al pecho" },
    { to: "start", s: 0.9 },
  ],
};
