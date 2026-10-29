/*
 * Estiramiento de pectoral en la pared
 * Side view, facing right, standing close to a wall on the right (the line
 * with hatch marks). The near forearm goes flat against the wall: upper arm
 * level at shoulder height, elbow touching the wall, forearm straight up
 * along it. The body then leans away from the wall and holds, with two
 * slow breaths (a touch further away on each). Back to standing at the end.
 * The near ankle is the fixed point; the far arm hangs.
 * Simplification: the real cue is to TURN the chest away from the wall;
 * from the side that turn shows as a lean back. The upper arm is aimed at
 * the same elbow point in every pose, so the forearm stays on the wall.
 */
import { STAND_SIDE, angleBetween, leg, neckFrom } from "../engine/helpers.js";

const WALL_X = 118;
const ANKLE = [101, 144];
const HIP = [101, 84];
const ELBOW = [WALL_X - 1.5, 52]; // elbow on the wall, at shoulder height

// Leaning away by `torso` degrees, forearm up along the wall.
function pose(torso, head) {
  return {
    torso,
    head,
    armR: angleBetween(neckFrom(HIP, torso), ELBOW),
    forearmR: 1, // up, resting on the wall (not 0: it swings forward, not back)
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
    ...leg("L", HIP, [98, 144]), // far leg a little behind
  },

  poses: {
    stretch: pose(352, 345),
    breathe: pose(349, 342),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Codo a la altura del hombro" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Girá el torso lejos de la pared" },
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
