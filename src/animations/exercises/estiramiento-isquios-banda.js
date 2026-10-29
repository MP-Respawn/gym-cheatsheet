/*
 * Estiramiento de isquiotibiales con banda
 * Side view, lying on the back with the head to the left; the hips are the
 * fixed point. The far leg stays long on the floor. An elastic band is
 * looped under the near foot and held in both hands over the chest; the
 * near leg rises straight toward the ceiling with the toes pulled toward
 * the face, and two slow breaths bring it a few degrees closer. Then the
 * foot returns to the floor. Simplification: the hands stay where they are
 * (the band stretches to the foot) instead of walking up the band, and the
 * band is already around the foot in the start pose.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [82, 140];
const TORSO = 272; // flat on the floor
const NECK = neckFrom(HIP, TORSO);

// Both hands hold the band over the chest and do not move.
const HAND_R = [74, 110];
const HAND_L = [72, 111];
const ARMS = {
  ...arm("R", NECK, HAND_R, "down"),
  ...arm("L", NECK, HAND_L, "down"),
};
const BAND_ANCHOR = [(HAND_R[0] + HAND_L[0]) / 2, (HAND_R[1] + HAND_L[1]) / 2];

// Far leg long on the floor, toes relaxed.
const FAR_LEG = { thighL: 90, shinL: 90, footL: 60 };

// Near leg straight up at thigh angle t, foot flexed toward the face.
const raise = (t) => ({
  thighR: t,
  shinR: t,
  footR: t + 288,
  ...FAR_LEG,
  ...ARMS,
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 278,
    // near knee bent, foot on the floor, band already around it
    ...leg("R", HIP, [112, 144], "up"),
    footR: 90,
    ...FAR_LEG,
    ...ARMS,
  },

  poses: {
    stretch: raise(12),
    breathe: raise(7),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Pierna recta, tirá suave" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y dejá que baje un poco más" },
    { to: "stretch", s: 1.2, ease: "slow", say: "La otra pierna estirada en el piso" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y dejá que baje un poco más" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // elastic band from the hands to the sole of the near foot
    { kind: "cable", anchor: BAND_ANCHOR, to: "toeR", band: true },
  ],
};
