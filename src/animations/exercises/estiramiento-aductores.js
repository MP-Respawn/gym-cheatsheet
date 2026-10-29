/*
 * Estiramiento de aductores
 * FRONT view. Wide stance, feet flat and pointing forward. The weight
 * shifts to the right: the hips move over the right foot and sink, that
 * knee bends over its toes while the left leg stays straight (the stretch
 * on the inner thigh); the torso stays upright, the right hand rests on
 * the bent thigh and the left hand on the hip. Two slow breaths a little
 * lower, then back to the middle. The other side is implied. Root is the
 * hip, moved with $root; both feet stay on their floor points.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";

const HIP = [80, 92]; // standing in the middle, legs almost straight
const ANKLE_L = [46, 144];
const ANKLE_R = [114, 144];

// Sunk over the right leg: a little lower again on the breath.
const HIP_STRETCH = [92, 100];
const HIP_BREATHE = [94, 102];

const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const plus = (p, d) => [p[0] + d[0], p[1] + d[1]];

// Feet stay flat and pointing forward (they would follow the shins).
const FEET = { footL: 270, footR: 90 };

// Pelvis is 6 to each side of the hip, shoulders 13 to each side of the neck.
function sink(hip) {
  const hipL = plus(hip, [-6, 0]);
  const hipR = plus(hip, [6, 0]);
  const neck = plus(hip, [0, -32]);
  const legR = leg("R", hipR, ANKLE_R, "fwd");
  const kneeR = point(hipR, 30, legR.thighR);
  return {
    $root: off(hip),
    torso: 0,
    head: 0,
    ...leg("L", hipL, ANKLE_L, "back"), // straight
    ...legR,
    ...FEET,
    // right hand down on the bent thigh, left hand on the hip
    ...arm("R", plus(neck, [13, 0]), kneeR, "down"),
    ...arm("L", plus(neck, [-13, 0]), plus(hipL, [0, -2]), "back"),
  };
}

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    ...leg("L", plus(HIP, [-6, 0]), ANKLE_L, "back"),
    ...leg("R", plus(HIP, [6, 0]), ANKLE_R, "fwd"),
    ...FEET,
  },

  poses: {
    stretch: sink(HIP_STRETCH),
    breathe: sink(HIP_BREATHE),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Bajá la cadera hacia la rodilla flexionada" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Pies apoyados, puntas al frente" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
