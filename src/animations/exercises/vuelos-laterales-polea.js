/*
 * Vuelos laterales en polea
 * Front view, standing beside a cable tower on the LEFT. Only the right arm
 * works: its cable comes from the LOW pulley on the opposite side and
 * crosses in front of the body to the hand. The hand starts low in front of
 * the hips and rises out to the side up to shoulder height (elbow slightly
 * bent, leading with the elbow), then lowers slowly. The left hand holds
 * the tower for balance and does not move.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 52];
const SHOULDER_R = [93, 52];
const PULLEY = [32, 138]; // low pulley at the foot of the tower

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // left hand on the tower
    ...arm("L", SHOULDER_L, [31, 62], "down"),
    // right hand low, in front of the hips, pulled across by the cable
    ...arm("R", SHOULDER_R, [81, 88], "fwd"),
  },

  poses: {
    // shoulder height, elbow a little higher than the hand
    up: {
      ...arm("R", SHOULDER_R, [131, 58], "up"),
    },
  },

  timeline: [
    { to: "up", s: 0.8, say: "Subí hasta el hombro" },
    { to: "up", s: 0.2 },
    { to: "start", s: 1.5, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // cable tower on the left, with its low pulley and a handle bar to hold
    { kind: "line", from: [28, 14], to: [28, 148] },
    { kind: "line", from: [28, 14], to: [40, 14] },
    { kind: "disc", c: PULLEY, r: 3 },
    // the cable crosses in front of the body to the working hand
    { kind: "cable", anchor: PULLEY, to: "handR", layer: "front" },
  ],
};
