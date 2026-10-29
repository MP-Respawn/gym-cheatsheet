/*
 * Estiramiento de tríceps
 * Front view, standing. The right arm goes up, elbow to the ceiling, and
 * the forearm folds behind the head so the hand drops between the shoulder
 * blades; the left hand reaches across to the raised elbow and pushes it
 * gently toward the head. Hold with two slow breaths (the elbow comes a
 * touch closer and the forearm folds a little more on each), then the
 * arms come down. The hip is the fixed point.
 * The folded forearm is drawn in the far layer (darker, behind the head),
 * since it really is behind the head.
 */
import { STAND_FRONT, arm, point } from "../engine/helpers.js";

const NECK = [80, 52];
const SHOULDER_L = point(NECK, 13, 270);
const SHOULDER_R = point(NECK, 13, 90);

// Right upper arm at `armR` (up, a little out), forearm folded to `forearmR`
// behind the head; the left hand holds the right arm just under the elbow,
// the left elbow kept low so that arm passes under the chin.
function pose(armR, forearmR, head) {
  const elbowR = point(SHOULDER_R, 21, armR);
  return {
    head,
    armR,
    forearmR,
    ...arm("L", SHOULDER_L, point(elbowR, 5, armR + 180), "down"),
  };
}

export default {
  view: "front",
  root: "hip",
  at: [80, 84],
  far: ["forearmR"],

  start: STAND_FRONT,

  poses: {
    stretch: pose(20, 250, 4),
    breathe: pose(17, 256, 5),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Codo al techo, mano a la espalda" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Empujá suave el codo" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
