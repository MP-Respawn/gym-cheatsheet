/*
 * Gemelos a un pie
 * Side view, facing a wall on the right. Only the near foot is on the step
 * (heel hanging off the edge); the far leg is bent behind with its foot in
 * the air. One hand rests on the wall for balance and stays on the same
 * spot while the body rides up and down. Body straight as a rod: the heel
 * drops below the step, then rises all the way onto the toes.
 * Cues shown: body straight with the leg extended, full range of motion.
 * Unlike gemelos-pie there are no dumbbells: one leg, bodyweight only.
 *
 * The near toe on the step edge is the fixed point.
 */
import { STAND_SIDE, ankleFor, arm } from "../engine/helpers.js";

const TOE = [84, 128]; // on the step, whose top is at y = 132
const WALL_X = 108;
const HAND = [WALL_X - 3, 52]; // palm on the wall, about chest height

// The body is a straight line above the ankle: shoulder = ankle + 92 up
// (shin 30 + thigh 30 + torso 32).
const shoulderFor = (footAngle) => {
  const a = ankleFor(TOE, footAngle);
  return [a[0], a[1] - 92];
};
const handOnWall = (footAngle) => arm("R", shoulderFor(footAngle), HAND, "down");

export default {
  view: "side",
  root: "toeR",
  at: TOE,

  start: {
    ...STAND_SIDE,
    // far leg bent behind, foot off the floor and relaxed
    thighL: 176,
    shinL: 266,
    footL: 176,
    ...handOnWall(90),
    armL: 182, // free arm hangs by the side
  },

  poses: {
    // heel below the step: full stretch
    low: { footR: 60, ...handOnWall(60) },
    // high on the toes
    high: { footR: 128, ...handOnWall(128) },
  },

  timeline: [
    { to: "low", s: 0.9, ease: "slow", say: "Recorrido completo" },
    { to: "high", s: 1.0, say: "Recorrido completo" },
    { to: "high", s: 0.5, say: "Bien recto" },
    { to: "start", s: 0.7, say: "Bien recto" },
  ],

  props: [
    // the wall and the step
    { kind: "line", from: [WALL_X, 8], to: [WALL_X, 148] },
    { kind: "rect", x: TOE[0] - 6, y: 132, w: 20, h: 16 },
  ],
};
