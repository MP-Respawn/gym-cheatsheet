/*
 * Estiramiento de gemelos en la pared
 * Side view, facing right toward a wall. Split stance with both hands on
 * the wall: the near leg in front with a soft knee, the far leg long
 * behind with the heel down (its ankle is the fixed point). The whole body
 * is one incline from the back heel to the shoulders; the stretch pushes
 * the hips toward the wall so the incline steepens, the front knee bends
 * more and the elbows give, while the back leg stays straight and the back
 * heel never lifts. Two slow breaths there, then back. The other side is
 * implied.
 */
import { STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const WALL_X = 120;
const ANKLE_BACK = [52, 144]; // far foot, heel down: the fixed point
const ANKLE_FRONT = [86, 144];

// Hands flat on the wall at shoulder height.
const HAND_R = [WALL_X - 3, 58];
const HAND_L = [WALL_X - 3, 62];

// The hip sits on the straight back leg, `lean` degrees from vertical;
// the torso continues that same line.
function pose(lean) {
  const hip = point(ANKLE_BACK, 60, lean);
  const neck = neckFrom(hip, lean);
  return {
    torso: lean,
    head: lean - 5, // looking at the wall
    ...leg("L", hip, ANKLE_BACK, "fwd"), // straight
    footL: 90,
    ...leg("R", hip, ANKLE_FRONT, "fwd"),
    footR: 90,
    ...arm("R", neck, HAND_R, "down"),
    ...arm("L", neck, HAND_L, "down"),
  };
}

export default {
  view: "side",
  root: "ankleL",
  at: ANKLE_BACK,

  start: { ...STAND_SIDE, ...pose(17) },

  poses: {
    stretch: pose(25),
    breathe: pose(27),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Cadera hacia la pared" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Talón de atrás pegado al piso" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the wall, with a few hatch marks on its far side
    { kind: "line", from: [WALL_X, 20], to: [WALL_X, 148] },
    { kind: "line", from: [WALL_X, 40], to: [WALL_X + 6, 46] },
    { kind: "line", from: [WALL_X, 64], to: [WALL_X + 6, 70] },
    { kind: "line", from: [WALL_X, 88], to: [WALL_X + 6, 94] },
    { kind: "line", from: [WALL_X, 112], to: [WALL_X + 6, 118] },
    { kind: "line", from: [WALL_X, 136], to: [WALL_X + 6, 142] },
  ],
};
