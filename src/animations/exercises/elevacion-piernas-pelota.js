/*
 * Elevación de piernas con pelota (vuelta: abdomen en pelota, paso 3)
 * Side view, lying on the back with the shoulders up and a ball held
 * between the feet. Straight legs go all the way up to vertical, then down
 * slowly to just above the floor, without resting.
 */
import { STAND_SIDE, arm, both } from "../engine/helpers.js";

const HIP = [82, 140];
const NECK = [51, 133]; // shoulders a bit off the floor

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 283, // pointing left and slightly up: shoulders lifted
    head: 292,
    ...both("thigh", 90), // legs straight along the floor
    ...both("shin", 90),
    ...both("foot", 0), // toes up
    ...arm("R", NECK, [80, 143], "up"),
    ...arm("L", NECK, [78, 143], "up"),
  },

  poses: {
    up: { ...both("thigh", 0) }, // legs vertical
    low: { ...both("thigh", 72) }, // legs low, not touching the floor
  },

  timeline: [
    { to: "up", s: 0.9, say: "Piernas rectas arriba" },
    { to: "low", s: 1.2, ease: "slow", say: "Bajá sin apoyar" },
    { to: "start", s: 0.4 },
    { to: "start", s: 0.3 },
  ],

  props: [
    // ball held between the feet
    { kind: "disc", on: "shinR", dx: 3, dy: -8, r: 7 },
  ],
};
