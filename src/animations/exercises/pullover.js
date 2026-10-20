/*
 * Pullover
 * Side view, lying face up on a flat bench, head to the left, knees bent and
 * feet flat on the floor. One dumbbell held in both hands with the arms
 * almost straight: from above the chest it arcs back past the head down to
 * about bench level (the stretch), then comes back up. The movement comes
 * from the shoulder; the elbows keep the same slight bend all the way.
 */
import { STAND_SIDE, arm, both, leg, point } from "../engine/helpers.js";

const HIP = [92, 101];
const SHOULDER = [60, 101]; // torso flat on the bench, pointing left

// Arms almost straight: 39 of the 41 units an arm can reach.
const REACH = 39;
const DB_UP = point(SHOULDER, REACH, 4); // above the chest
const DB_BACK = point(SHOULDER, REACH, 258); // behind the head, bench level

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 270, // lying down, head to the left
    head: 272,
    ...leg("R", HIP, [120, 144], "up"),
    ...leg("L", HIP, [116, 144], "up"),
    ...both("foot", 90),
    ...arm("R", SHOULDER, DB_UP, "fwd"),
    ...arm("L", SHOULDER, [DB_UP[0] - 2, DB_UP[1]], "fwd"),
  },

  poses: {
    stretch: {
      ...arm("R", SHOULDER, DB_BACK, "up"),
      ...arm("L", SHOULDER, [DB_BACK[0] + 1, DB_BACK[1] - 2], "up"),
    },
  },

  timeline: [
    { to: "stretch", s: 1.4, ease: "slow", say: "Atrás en arco" },
    { to: "stretch", s: 0.3, say: "Brazos casi rectos" },
    { to: "start", s: 1.1, say: "Volvé arriba" },
    { to: "start", s: 0.5, say: "Brazos casi rectos" },
  ],

  props: [
    // flat bench and its legs
    { kind: "rect", x: 38, y: 104, w: 62, h: 6 },
    { kind: "line", from: [44, 110], to: [44, 148] },
    { kind: "line", from: [94, 110], to: [94, 148] },
    // one dumbbell held with both hands
    { kind: "disc", on: "forearmR", r: 6 },
  ],
};
