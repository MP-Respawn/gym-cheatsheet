/*
 * Estiramiento de cuello (lateral)
 * Front view, standing, arms hanging. The head tilts to the right, ear
 * toward the right shoulder, while the right hand comes up over the head
 * and rests on its far side; the left arm hangs long and the left shoulder
 * drops a touch. Hold with two slow breaths (the tilt deepens 5 degrees on
 * each, the hand following), then the head comes back up. The hip is the
 * fixed point.
 * Simplification: with these arm lengths the hand cannot reach the far ear
 * around the head, so it rests on the top of the head, just past the crown.
 */
import { STAND_FRONT, arm, point } from "../engine/helpers.js";

const NECK = [80, 52];
const SHOULDER_R = point(NECK, 13, 90);

// Head tilted `head` degrees to the right; the right hand just past the
// crown on the far side, the left shoulder and arm dropped.
function pose(head) {
  const crown = point(NECK, 15, head); // center of the head circle
  return {
    head,
    ...arm("R", SHOULDER_R, point(crown, 12, 340), "up"),
    clavL: 264, // left shoulder dropped a touch
    armL: 190,
    forearmL: 190,
  };
}

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: STAND_FRONT,

  poses: {
    stretch: pose(25),
    breathe: pose(30),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Oreja al hombro" },
    { to: "breathe", s: 1.2, ease: "slow", say: "La mano acompaña, no tira" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
