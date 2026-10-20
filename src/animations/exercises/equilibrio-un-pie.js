/*
 * Equilibrio a un pie
 * Front view, standing on the left leg (screen left) on the bare floor,
 * the other foot lifted beside the standing calf with the knee out, arms
 * open to the sides. The body sways gently side to side over the planted
 * ankle and the arms tilt the other way like a tightrope walker's pole.
 * The second half sways a bit more: the "eyes closed" variant (the closed
 * eyes cannot be drawn, so the bigger wobble stands for it).
 * The standing ankle is the fixed point. Different from the bosu one:
 * front view, flat floor, foot at the calf.
 */
import { STAND_FRONT } from "../engine/helpers.js";

// Lean d (degrees, + = toward screen right): the standing leg and the body
// tip over the ankle, the torso corrects a little, the arm line tilts the
// opposite way, and the lifted leg rides along.
function sway(d, arms) {
  return {
    thighL: 181 + d,
    shinL: 178 + d, // soft knee, pointing a hair outward
    footL: 270,
    torso: -d * 0.5,
    head: -d * 0.8,
    armR: 96 - arms,
    forearmR: 92 - arms,
    armL: 264 - arms,
    forearmL: 268 - arms,
    thighR: 140 + d,
    shinR: 238 + d,
    footR: 160 + d,
  };
}

export default {
  view: "front",
  root: "ankleL",
  at: [74, 144],

  start: {
    ...STAND_FRONT,
    ...sway(0, 0), // centered, arms level
  },

  poses: {
    right: sway(2, 6),
    left: sway(-2, -6),
    rightBig: sway(4, 14),
    leftBig: sway(-4, -14),
  },

  timeline: [
    { to: "right", s: 0.7, say: "Sostené 15 segundos" },
    { to: "left", s: 0.9, say: "Sostené 15 segundos" },
    { to: "rightBig", s: 0.6, say: "Variante: ojos cerrados" },
    { to: "leftBig", s: 0.7, say: "Variante: ojos cerrados" },
    { to: "start", s: 0.6 },
  ],
};
