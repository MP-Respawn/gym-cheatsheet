/*
 * Fuga inversa / Reverse shrimp (Jiu Jitsu)
 * Seen from above, lying on a mat (no floor line) with the head to the
 * left, on the side. The opposite of the shrimp: the knees curl up toward
 * the chest and the hips drive toward them, so the body moves toward the
 * feet, pivoting on the bottom shoulder; then long again. Once to each
 * side. The shoulders are the fixed point.
 */
import { STAND_FRONT } from "../engine/helpers.js";
import { MAT, turnPose } from "../engine/poses.js";

// Drawn upright below, then turned -90 so the body lies head left, feet right.
const TURN = -90;
const NECK = [36, 80];

// Long on the side: body straight, legs long, top hand on the floor in front.
const LONG = {
  ...STAND_FRONT,
  torso: 0,
  head: 0,
  thighR: 178,
  shinR: 180,
  thighL: 182,
  shinL: 180,
  footR: 180,
  footL: 180,
  armR: 160,
  forearmR: 170,
  armL: 200,
  forearmL: 190,
};

// Knees curled toward the chest on one side (s = 1 right, -1 left), hips following.
const curl = (s) => ({
  torso: -14 * s,
  head: -6 * s,
  pelvisR: 90 - 14 * s,
  pelvisL: 270 - 14 * s,
  thighR: 180 - 70 * s,
  shinR: 180 + 40 * s,
  thighL: 180 - 64 * s,
  shinL: 180 + 44 * s,
  armR: 180 - 20 * s,
  forearmR: 180 - 30 * s,
  armL: 180 - 20 * s,
  forearmL: 180 - 30 * s,
});

export default {
  view: "front",
  root: "neck",
  at: NECK,
  floor: false,
  lengths: { footL: 5, footR: 5 },
  props: [MAT],

  start: turnPose(LONG, TURN),

  poses: {
    right: turnPose(curl(1), TURN),
    left: turnPose(curl(-1), TURN),
  },

  timeline: [
    { to: "right", s: 0.7, ease: "fast", say: "Rodillas al pecho, cadera hacia ellas" },
    { to: "right", s: 0.3 },
    { to: "start", s: 0.7, say: "Volvé largo" },
    { to: "left", s: 0.7, ease: "fast", say: "Al otro lado" },
    { to: "left", s: 0.3 },
    { to: "start", s: 0.7, say: "Volvé largo" },
  ],
};
