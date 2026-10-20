/*
 * Sentadilla explosiva liviana + press Arnold
 * Side view, facing right. Light dumbbells held at the shoulders. A quick,
 * short squat down, then the explosive drive up flows straight into an
 * overhead press (the trainer: use the momentum for the press), a short
 * hold with the arms up, and the dumbbells come back to the shoulders.
 * Simplification: the Arnold rotation of the wrists happens toward the
 * camera and cannot be seen from the side, so it reads as a plain press.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

// Bottom of the squat: lighter and a bit higher than the heavy barbell squat.
const HIP_LOW = [66, 104];
const TORSO_LOW = 28;
const NECK_LOW = neckFrom(HIP_LOW, TORSO_LOW);

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    // far leg a few units behind, so both legs are visible
    ...leg("L", [80, 84], [76, 144]),
    // dumbbells at the shoulders: elbows down and a bit forward, hands up
    armR: 165,
    forearmR: 355,
    armL: 160,
    forearmL: 350,
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, [80, 144]),
      ...leg("L", HIP_LOW, [76, 144]),
      ...both("foot", 90), // feet stay flat
      torso: TORSO_LOW,
      // dumbbells stay racked just in front of the shoulders, elbows down
      ...arm("R", NECK_LOW, [NECK_LOW[0] + 8, NECK_LOW[1] - 1], "down"),
      ...arm("L", NECK_LOW, [NECK_LOW[0] + 6, NECK_LOW[1] - 1], "down"),
    },
    // standing tall, arms locked overhead
    press: {
      armR: 5,
      forearmR: 0,
      armL: 2,
      forearmL: 357,
    },
  },

  timeline: [
    { to: "bottom", s: 0.9, say: "Bajá" },
    { to: "press", s: 0.5, ease: "fast", say: "Subí explosivo y empujá" },
    { to: "press", s: 0.3, say: "Subí explosivo y empujá" },
    { to: "start", s: 0.6, say: "Bajá las mancuernas" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
