/*
 * Estiramiento de hombro (brazo cruzado)
 * Front view, standing. The right arm crosses the chest straight and
 * nearly level, just under shoulder height; the left forearm comes up from
 * below and hooks it just above the elbow, pulling it toward the chest.
 * Hold with two slow breaths (the arm comes 3 degrees closer on each),
 * then the arms come down. The hip is the fixed point.
 * Simplification: the crossing arm runs a few units below the collarbones
 * so the two lines do not merge.
 */
import { STAND_FRONT, arm, point } from "../engine/helpers.js";

const NECK = [80, 52];
const SHOULDER_L = point(NECK, 13, 270);
const SHOULDER_R = point(NECK, 13, 90);

// Right arm straight across at `across` degrees; left hand hooked on the
// right upper arm a third of the way up from the elbow, from below.
function pose(across) {
  const elbowR = point(SHOULDER_R, 21, across);
  const grip = point(elbowR, 7, across + 180);
  return {
    armR: across,
    forearmR: across,
    ...arm("L", SHOULDER_L, [grip[0], grip[1] + 2], "down"),
  };
}

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: STAND_FRONT,

  poses: {
    stretch: pose(257),
    breathe: pose(254),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Brazo cruzado a la altura del hombro" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Acercalo con la otra mano" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
