/*
 * Gemelos sentado
 * Side view, facing right, seated on a bench with the knees at about 90
 * degrees. A weight pad rests on the thighs right next to the knees, held
 * by the hands; the balls of the feet are on a low block. The heels rise
 * (toes stay put), so the knees and the pad lift a little; pause on top,
 * then the heels sink below the block for the full stretch.
 * Cues shown: weight on the thighs near the knees, full range, pause on top.
 *
 * Root is the hip on the seat. Each pose tilts the feet around the fixed
 * toes (ankleFor) and lets the legs reach those ankles (leg()).
 */
import { STAND_SIDE, ankleFor, arm, leg, point } from "../engine/helpers.js";

const HIP = [62, 104];
const NECK = point(HIP, 32, 4); // sitting tall, a hair forward
const TOE_R = [104, 132]; // on the block, whose top is at y = 136
const TOE_L = [101, 132]; // far foot a little behind so both show

// Legs and hands for a given foot angle: feet pivot on the toes, the knees
// go where the legs reach, and the hands stay on the pad over the knees.
function legsFor(footAngle) {
  const ankleR = ankleFor(TOE_R, footAngle);
  const ankleL = ankleFor(TOE_L, footAngle);
  const legR = leg("R", HIP, ankleR, "up");
  const knee = point(HIP, 30, legR.thighR);
  return {
    ...legR,
    ...leg("L", HIP, ankleL, "up"),
    footR: footAngle,
    footL: footAngle,
    ...arm("R", NECK, [knee[0] - 5, knee[1] - 7], "down"),
    ...arm("L", NECK, [knee[0] - 7, knee[1] - 7], "down"),
  };
}

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 4,
    ...legsFor(90), // feet flat
  },

  poses: {
    high: legsFor(125), // heels up, knees lifted a little
    low: legsFor(64), // heels below the block: full stretch
  },

  timeline: [
    { to: "high", s: 0.8, say: "Talones arriba" },
    { to: "high", s: 0.6, say: "Pausa" },
    { to: "low", s: 1.3, ease: "slow", say: "Bajá completo" },
    { to: "low", s: 0.2, say: "Bajá completo" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // bench: seat and two legs
    { kind: "rect", x: 38, y: 108, w: 40, h: 6, fill: true },
    { kind: "line", from: [44, 114], to: [44, 148] },
    { kind: "line", from: [72, 114], to: [72, 148] },
    // block under the balls of the feet (heels hang off its back edge)
    { kind: "rect", x: 98, y: 136, w: 22, h: 12 },
    // weight pad on the thighs near the knees, with a plate on top
    { kind: "rect", on: "thighR", at: 0.85, x: -7, y: -9, w: 14, h: 5, fill: true },
    { kind: "disc", on: "thighR", at: 0.85, dx: 0, dy: -14, r: 5 },
  ],
};
