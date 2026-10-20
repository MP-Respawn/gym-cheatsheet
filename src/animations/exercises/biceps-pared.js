/*
 * Bíceps con mancuernas, cola apoyada en la pared
 * Side view, facing right, standing with the back and glutes against a wall
 * (the line just behind the body). The hip is the fixed point: the body never
 * moves, only the forearms. Both dumbbells curl together with the upper arms
 * still by the sides. Tempo from the trainer: up (0.7 s), squeeze at the top
 * for 1 second, slow way down (1.5 s).
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

const HIP = [80, 84];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    // feet a little in front of the wall, legs almost straight
    ...leg("R", HIP, [81.5, 143.8]),
    ...leg("L", HIP, [78.5, 143.8]),
    // far arm a few degrees back, so both dumbbells show
    armL: 186,
    forearmL: 186,
  },

  poses: {
    // forearms up, elbows stay by the sides
    top: {
      armR: 180,
      forearmR: 25,
      armL: 186,
      forearmL: 30,
    },
  },

  timeline: [
    { to: "top", s: 0.7, say: "Cola pegada a la pared" },
    { to: "top", s: 1, say: "Apretá arriba 1 segundo" },
    { to: "start", s: 1.5, ease: "slow", say: "Bajada lenta" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the wall right behind the back
    { kind: "line", from: [70, 14], to: [70, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmR", r: 5 },
    { kind: "disc", on: "forearmL", r: 5 },
  ],
};
