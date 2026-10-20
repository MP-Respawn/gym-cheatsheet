/*
 * Abdomen en pelota
 * Side view, lying on the back with the shoulders up and a ball between the
 * feet. Shows two of the trainer's three raises: straight legs all the way
 * up and down, then short "pataditas" with the legs low. (The third one,
 * lateral raises, moves toward the camera and cannot be seen from the side.)
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
    kickHigh: { ...both("thigh", 55) },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Piernas rectas arriba" },
    { to: "low", s: 1, ease: "slow", say: "Bajá sin apoyar" },
    { to: "kickHigh", s: 0.3, say: "Pataditas" },
    { to: "low", s: 0.3, say: "Pataditas" },
    { to: "kickHigh", s: 0.3, say: "Pataditas" },
    { to: "low", s: 0.3, say: "Pataditas" },
    { to: "start", s: 0.6 },
  ],

  props: [
    // ball held between the feet
    { kind: "disc", on: "shinR", dx: 3, dy: -8, r: 7 },
  ],
};
