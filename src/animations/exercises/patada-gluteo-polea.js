/*
 * Patada de glúteo en polea
 * Side view, facing right, standing in front of a cable machine with both
 * hands on its frame and a slight forward lean. The far leg is the stance
 * leg (its ankle is the fixed point). The near leg, with the ankle strap
 * hooked to the low pulley in front, kicks straight back and returns while
 * the torso stays still ("solo se mueve la pierna"); the cable stretches.
 * Two reps.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const ANKLE_STANCE = [76, 144];
const HIP = [76, 85];
const TORSO = 14; // slight forward lean, held still
const SHOULDER = neckFrom(HIP, TORSO);

const FRAME_X = 122;
const PULLEY = [FRAME_X, 140];

export default {
  view: "side",
  root: "ankleL",
  at: ANKLE_STANCE,

  start: {
    ...STAND_SIDE,
    ...leg("L", HIP, ANKLE_STANCE),
    torso: TORSO,
    head: 4,
    // hands on the frame
    ...arm("R", SHOULDER, [FRAME_X - 4, 78], "down"),
    ...arm("L", SHOULDER, [FRAME_X - 6, 80], "down"),
    // working leg next to the stance leg, foot just off the floor
    ...leg("R", HIP, [80, 142]),
    footR: 100,
  },

  poses: {
    kick: {
      // leg swings back from the hip, knee almost straight
      thighR: 212,
      shinR: 218,
    },
  },

  timeline: [
    { to: "kick", s: 0.7, say: "Pierna atrás" },
    { to: "kick", s: 0.3, say: "Pierna atrás" },
    { to: "start", s: 1, ease: "slow", say: "Torso quieto" },
    { to: "kick", s: 0.7, say: "Pierna atrás" },
    { to: "kick", s: 0.3, say: "Pierna atrás" },
    { to: "start", s: 1, ease: "slow", say: "Torso quieto" },
  ],

  props: [
    // cable machine frame with the low pulley
    { kind: "line", from: [FRAME_X, 20], to: [FRAME_X, 148] },
    { kind: "line", from: [FRAME_X, 20], to: [FRAME_X + 20, 20] },
    { kind: "line", from: [FRAME_X + 20, 20], to: [FRAME_X + 20, 148] },
    { kind: "disc", c: PULLEY, r: 3 },
    // cable from the pulley to the near ankle
    { kind: "cable", anchor: PULLEY, to: "ankleR" },
  ],
};
