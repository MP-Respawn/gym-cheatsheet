/*
 * Press militar con barra al frente
 * Front view, standing. Both hands on one barbell (a bar drawn between the
 * hands). The bar goes from the front of the shoulders, just under the
 * chin, to overhead with the elbows NOT locked, and comes back down. Two
 * reps with no pause anywhere: up ~0.9 s, down ~1.1 s, straight back up,
 * for the trainer's "tensión continua". At the bottom the elbows point out
 * and down.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 52];
const SHOULDER_R = [93, 52];

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // bar at the front of the shoulders, hands a bit wider than them,
    // elbows out and down
    ...arm("L", SHOULDER_L, [58, 50], "down"),
    ...arm("R", SHOULDER_R, [102, 50], "down"),
  },

  poses: {
    // overhead, elbows still slightly bent (not locked)
    top: {
      ...arm("L", SHOULDER_L, [60, 14], "back"),
      ...arm("R", SHOULDER_R, [100, 14], "fwd"),
    },
  },

  timeline: [
    { to: "top", s: 0.9, say: "Arriba sin trabar" },
    { to: "start", s: 1.1, say: "Tensión continua" },
    { to: "top", s: 0.9, say: "Arriba sin trabar" },
    { to: "start", s: 1.1, say: "Tensión continua" },
  ],

  props: [
    // the barbell, a bit wider than the grip
    { kind: "span", from: "handL", to: "handR", extend: 14 },
  ],
};
