/*
 * Elevación de piernas colgado
 * Side view, facing right, hanging from a pull-up bar with straight arms.
 * The straight legs rise to horizontal (~0.9 s) and lower slowly (~1.1 s).
 * The hands on the bar are the fixed point and the torso stays still: no
 * swinging, as the trainer asks. No floor line: the bar is high and the
 * feet hang well above the ground (simplification to fit the drawing).
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const BAR = [84, 10];

export default {
  view: "side",
  root: "handR",
  at: BAR,
  floor: false,

  start: {
    ...STAND_SIDE,
    // arms straight overhead, hands slightly in front of the head
    ...both("arm", 5),
    ...both("forearm", 5),
    torso: 359,
    head: 8, // looking ahead
    thighR: 180,
    thighL: 183, // far leg a hair behind so both show
    ...both("shin", 181),
    ...both("foot", 150), // toes relaxed, pointing down
  },

  poses: {
    // legs straight out in front, at hip height
    up: {
      thighR: 90,
      thighL: 94,
      ...both("shin", 90),
      ...both("foot", 50),
      torso: 356, // tiny lean back to balance the legs
      ...both("arm", 5), // arms stay put on the bar
      ...both("forearm", 5),
    },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Subí sin balancearte" },
    { to: "up", s: 0.3 },
    { to: "start", s: 1.1, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // pull-up bar (seen end-on) and its frame
    { kind: "line", from: [60, 10], to: [140, 10] },
    { kind: "line", from: [140, 10], to: [140, 158] },
    { kind: "disc", c: BAR, r: 3, fill: true },
  ],
};
