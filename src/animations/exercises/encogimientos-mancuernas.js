/*
 * Encogimientos con mancuernas
 * Front view, standing, a dumbbell (small disc) in each hand hanging by
 * the sides. The only thing that moves is the shoulder line: the
 * collarbones tilt up so the shoulders rise toward the ears (and the
 * dumbbells with them, a few units), a one-second hold, then they sink
 * slowly. The arms stay straight down the whole time: no bending the
 * elbows, no rolling the shoulders.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // arms straight down, dumbbells by the thighs
    ...mirror("arm", 178),
    ...mirror("forearm", 180),
  },

  poses: {
    // shoulders up to the ears; the arms keep hanging straight
    up: {
      clavR: 70,
      clavL: 290,
      ...mirror("arm", 178),
      ...mirror("forearm", 180),
    },
  },

  timeline: [
    { to: "up", s: 0.7, say: "Hombros a las orejas" },
    { to: "up", s: 0.4, say: "Sostené un segundo" },
    { to: "start", s: 1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4, say: "Bajá lento" },
  ],

  props: [
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
