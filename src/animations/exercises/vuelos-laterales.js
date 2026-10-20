/*
 * Vuelos laterales
 * Front view, standing, a dumbbell (small disc) in each hand. The arms rise
 * out to the sides up to shoulder height with the elbows slightly bent,
 * then lower. Two reps to show the trainer's drop set: a heavy, slow one,
 * then (without a pause) a lighter, quicker one with 30% less weight.
 * Simplification: the dumbbells look the same; only the tempo and the
 * labels tell the heavy and the light rep apart.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // dumbbells by the thighs, elbows already a little soft
    ...mirror("arm", 170),
    ...mirror("forearm", 176),
  },

  poses: {
    // shoulder height: upper arm about level, hand just below the elbow
    up: {
      ...mirror("arm", 86),
      ...mirror("forearm", 98),
    },
  },

  timeline: [
    { to: "up", s: 1.1, ease: "slow", say: "Pesado" },
    { to: "start", s: 1.2, ease: "slow", say: "Pesado" },
    { to: "up", s: 0.6, say: "30% menos, seguí" },
    { to: "start", s: 0.7, say: "30% menos, seguí" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
