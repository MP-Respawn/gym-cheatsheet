/*
 * Estiramiento de bíceps en la pared
 * Side view, facing right, standing an arm's length from a wall on the
 * right (the line with hatch marks). The near arm goes fully straight at
 * shoulder height with the palm on the wall, and the body leans away from
 * the hand to feel the stretch; it holds there with two slow breaths (a
 * touch further away on each). Back to standing at the end.
 * The near ankle is the fixed point; the far arm hangs.
 * Simplification: the real cue is to TURN the chest away from the hand;
 * from the side that turn shows as a lean back. The arm is aimed at the
 * same hand point in every pose, so the palm stays on the wall.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const WALL_X = 118;
const ANKLE = [82, 144];
const HIP = [82, 84];
const HAND = [WALL_X - 0.5, 52]; // palm on the wall, at shoulder height

// Leaning away by `torso` degrees, near arm straight to the wall.
function pose(torso, head) {
  return {
    torso,
    head,
    ...arm("R", neckFrom(HIP, torso), HAND, "down"),
    // far arm hanging, a few degrees back so it shows
    armL: 184,
    forearmL: 184,
  };
}

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("L", HIP, [79, 144]), // far leg a little behind
  },

  poses: {
    stretch: pose(350, 342),
    breathe: pose(347, 339),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Palma en la pared, brazo estirado" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Girá el torso despacio" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
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
