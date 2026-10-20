/*
 * Press militar con mancuernas
 * Front view, SEATED on a bench with a backrest (the backrest shows behind
 * the torso), a dumbbell (small disc) in each hand. The dumbbells start at
 * ear height with the elbows out and down, press overhead and stop apart
 * (they never touch at the top), then come back to the ears.
 * Differs from the barbell press: seated, two dumbbells, no bar, a short
 * hold at the bottom and a slower way down.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 72];
const SHOULDER_R = [93, 72];

export default {
  view: "front",
  root: "hip",
  at: [80, 104],
  // seated: thighs point toward us, so they look short
  lengths: { thighL: 14, thighR: 14 },

  start: {
    ...STAND_FRONT,
    thighL: 232,
    thighR: 128,
    shinL: 181,
    shinR: 179,
    // dumbbells at ear height, elbows out and down
    ...arm("L", SHOULDER_L, [52, 56], "down"),
    ...arm("R", SHOULDER_R, [108, 56], "down"),
  },

  poses: {
    // overhead, still a hand's width apart
    top: {
      ...arm("L", SHOULDER_L, [61, 34], "back"),
      ...arm("R", SHOULDER_R, [99, 34], "fwd"),
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Empujá sin chocarlas" },
    { to: "top", s: 0.2 },
    { to: "start", s: 1.2, ease: "slow", say: "Mancuernas a las orejas" },
    { to: "start", s: 0.4, say: "Mancuernas a las orejas" },
  ],

  props: [
    // bench: backrest behind the torso, seat, post
    { kind: "rect", x: 66, y: 58, w: 28, h: 46 },
    { kind: "rect", x: 60, y: 106, w: 40, h: 6 },
    { kind: "line", from: [80, 112], to: [80, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
