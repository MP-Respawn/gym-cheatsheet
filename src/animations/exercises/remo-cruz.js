/*
 * Remo cruz con barra
 * Side view, facing right. Bent over about 65 degrees from vertical with
 * soft knees; the near ankle is the fixed point. The bar comes from hanging
 * straight down to the CHEST with a wide grip: the elbows go high and wide,
 * the upper arm ends up about 90 degrees from the torso and the forearms
 * hang vertical. Steady pull, short squeeze, controlled way down.
 *
 * Simplification: with a wide grip the upper arms open out to the sides
 * (toward the camera), so from the side they look shorter. The upper arms
 * are drawn at 16 instead of 21 to suggest that.
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";

const HIP = [62, 90]; // hips back, knees soft
const TORSO = 65; // about 65 degrees from vertical

export default {
  view: "side",
  root: "ankleR",
  at: [76, 144],
  lengths: { armL: 16, armR: 16 },

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 72, // neutral neck, eyes a bit ahead of the bar
    ...leg("R", HIP, [76, 144]),
    ...leg("L", HIP, [72, 144]),
    ...both("foot", 90),
    // arms hanging straight under the shoulders, bar in the hands
    ...both("arm", 180),
    ...both("forearm", 180),
    armL: 183,
    forearmL: 183,
  },

  poses: {
    // elbows high and wide, about 90 degrees from the torso; bar at the chest
    top: {
      armR: 340,
      forearmR: 172,
      armL: 336,
      forearmL: 174,
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Tirá al pecho" },
    { to: "top", s: 0.5, say: "Codos a 90, lejos de las costillas" },
    { to: "start", s: 1.2, ease: "slow" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // barbell seen from the side (a plate) in the hands
    { kind: "disc", on: "forearmR", r: 8 },
  ],
};
