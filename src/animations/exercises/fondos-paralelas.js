/*
 * Fondos en paralelas
 * Side view, facing right, hands on the parallel bars (in side view both
 * bars overlap into one line, with its support posts). The near hand on
 * the bar is the fixed point. Body hanging with the knees bent behind.
 * First the torso tips forward to load the chest, then the body lowers
 * until the elbows are at about 90 degrees (elbows going back), and pushes
 * back up to straight arms.
 */
import { STAND_SIDE, arm, point } from "../engine/helpers.js";

const HAND = [86, 76]; // near hand on the bar
const HAND_FAR = [83, 76]; // far hand on the other bar, a little behind

// Top: arms straight and vertical, shoulders right over the hands.
const SHOULDER_TOP = point(HAND, 41, 0);

// Bottom: forearm leaning forward, upper arm pointing back and a little
// down, 90 degrees between them. Shoulder found from the hand outward.
const FOREARM_LOW = 158; // elbow -> hand, down and forward
const ARM_LOW = 250; // shoulder -> elbow, back and a little down
const SHOULDER_LOW = point(point(HAND, 20, FOREARM_LOW + 180), 21, ARM_LOW + 180);

export default {
  view: "side",
  root: "handR",
  at: HAND,

  start: {
    ...STAND_SIDE,
    torso: 8, // almost upright
    head: 12,
    armR: 180,
    forearmR: 180,
    ...arm("L", SHOULDER_TOP, HAND_FAR, "back"),
    // knees bent, lower legs crossed behind
    thighL: 186,
    thighR: 182,
    shinL: 242,
    shinR: 238,
    footL: 160,
    footR: 156,
  },

  poses: {
    // still at the top, torso tipped forward
    lean: {
      torso: 24,
      armR: 180,
      forearmR: 180,
      ...arm("L", SHOULDER_TOP, HAND_FAR, "back"),
    },
    // elbows at 90 degrees, chest forward and down
    bottom: {
      torso: 36,
      armR: ARM_LOW,
      forearmR: FOREARM_LOW,
      ...arm("L", SHOULDER_LOW, HAND_FAR, "back"),
    },
  },

  timeline: [
    { to: "lean", s: 0.5, say: "Inclinate adelante" },
    { to: "bottom", s: 1.2, ease: "slow", say: "Bajá a 90 grados" },
    { to: "bottom", s: 0.2 },
    { to: "lean", s: 0.8, say: "Subí" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // the parallel bars (one line in side view) and their posts
    { kind: "line", from: [48, 76], to: [124, 76] },
    { kind: "line", from: [56, 76], to: [56, 148] },
    { kind: "line", from: [116, 76], to: [116, 148] },
  ],
};
