/*
 * Sentadilla libre con barra
 * Side view, facing right. Bar on the upper back, held with both hands.
 * Tempo from the trainer: slow way down, short pause, explosive way up.
 *
 * How to read this file (same structure in every exercise):
 *   root / at   the joint that stays put and where it is (here: the near ankle)
 *   start       the start pose: one angle per body segment
 *   poses       other poses; anything not listed keeps its start angle
 *               (or follows its parent segment, see kinematics.js)
 *   timeline    the loop: which pose to reach, in how many seconds, with
 *               which easing, and the phase name shown under the animation
 *   props       equipment
 */
import { STAND_SIDE, arm, both, leg } from "../engine/helpers.js";

// Where the hips go at the bottom: back and down, thighs about parallel.
const HIP_LOW = [63, 108];

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    // far leg a few units behind, so both legs are visible
    ...leg("L", [80, 84], [76, 144]),
    // hands up on the bar behind the neck
    ...arm("R", [80, 52], [76, 50], "back"),
    ...arm("L", [80, 52], [73, 50], "back"),
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, [80, 144]),
      ...leg("L", HIP_LOW, [76, 144]),
      ...both("foot", 90), // feet stay flat on the floor
      torso: 38, // chest leans forward, back straight
    },
  },

  timeline: [
    { to: "bottom", s: 2, ease: "slow", say: "Bajada lenta" },
    { to: "bottom", s: 0.3, say: "Abajo, cola lejos de los talones" },
    { to: "start", s: 0.6, ease: "fast", say: "Subida explosiva" },
    { to: "start", s: 0.9 },
  ],

  props: [
    // barbell seen from the side (a plate), resting on the upper back
    { kind: "disc", on: "torso", dx: -6, dy: 1, r: 8 },
  ],
};
