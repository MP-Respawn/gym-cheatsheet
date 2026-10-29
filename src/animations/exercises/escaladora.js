/*
 * Escaladora
 * Side view, facing right, climbing a stair machine with the hands
 * resting on the rail: the treads keep coming down and back while the
 * figure climbs in place. The hip is the root (it rises a little in
 * the middle of each step). The foot on a tread rides down with it;
 * the free foot lifts, swings over the next tread and lands flat on it.
 * Cues shown: whole foot on the tread, push through the heel, torso
 * tall without hanging on the handles.
 * Simplification: three treads drawn; after each step they snap back
 * up one tread (two coincide, so only the top one appears and the
 * bottom one vanishes), which reads as an endless staircase.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [80, 68]; // hip at the moment of the weight change (the root)
const HIP_UP = [80, 66]; // a little higher mid-step, pushing up
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const TORSO = 8;

// Treads: each one 12 lower and 12 further back than the one above.
// Over one step every tread travels DROP, then they all snap back.
const DROP = [-12, 12];
const HALF = [-6, 6];
const TREAD = { w: 20, h: 5 };
const TREADS = [
  [96, 100], // top
  [84, 112], // under the near foot at the start
  [72, 124], // under the far foot at the start
];

// Ankles: on the upper tread, on the lower tread, halfway down with the
// tread, and in the air mid-swing (toes a bit down, just over the next).
const UPPER = [90, 108];
const LOWER = [78, 120];
const MID_STANCE = [84, 114];
const MID_AIR = [77, 105];
const FOOT_AIR = 95;

// Hands on the rail, in front at hip height.
const RAIL_POST = [124, 64];
const RAIL_END = [98, 72];
const HAND = [102, 71];

// Both legs: `near`/`far` are ankle points, foot angles default to flat.
const legs = (hip, near, far, footNear = 90, footFar = 90) => ({
  ...leg("R", hip, near),
  ...leg("L", hip, far),
  footR: footNear,
  footL: footFar,
});

const arms = (hip) => ({
  ...arm("R", neckFrom(hip, TORSO), HAND, "down"),
  ...arm("L", neckFrom(hip, TORSO), [HAND[0] - 2, HAND[1]], "down"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  // near foot on the upper tread, far foot on the lower one
  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 8,
    ...legs(HIP, UPPER, LOWER),
    ...arms(HIP),
  },

  poses: {
    // near foot riding its tread down, far foot swinging up
    mid1: {
      $root: off(HIP_UP),
      ...legs(HIP_UP, MID_STANCE, MID_AIR, 90, FOOT_AIR),
      ...arms(HIP_UP),
    },
    // treads one step down: near foot now low, far foot on the new top
    swap: {
      ...legs(HIP, LOWER, UPPER),
      ...arms(HIP),
    },
    // same figure, treads snapped back to their rest positions
    swapHeld: {
      ...legs(HIP, LOWER, UPPER),
      ...arms(HIP),
    },
    // far foot riding down, near foot swinging up
    mid2: {
      $root: off(HIP_UP),
      ...legs(HIP_UP, MID_AIR, MID_STANCE, FOOT_AIR, 90),
      ...arms(HIP_UP),
    },
    // back to the start figure, treads one step down (then they snap)
    climbed: {
      ...legs(HIP, UPPER, LOWER),
      ...arms(HIP),
    },
  },

  timeline: [
    { to: "mid1", s: 0.3, ease: "linear", say: "Todo el pie en el escalón" },
    { to: "swap", s: 0.3, ease: "linear", say: "Todo el pie en el escalón" },
    { to: "swapHeld", s: 0.01, ease: "linear", say: "Todo el pie en el escalón" },
    { to: "mid2", s: 0.3, ease: "linear", say: "Empujá con el talón" },
    { to: "climbed", s: 0.3, ease: "linear", say: "Empujá con el talón" },
    { to: "start", s: 0.01, ease: "linear", say: "Empujá con el talón" },
    { to: "mid1", s: 0.3, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
    { to: "swap", s: 0.3, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
    { to: "swapHeld", s: 0.01, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
    { to: "mid2", s: 0.3, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
    { to: "climbed", s: 0.3, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
    { to: "start", s: 0.01, ease: "linear", say: "Torso derecho, sin colgarte de las manijas" },
  ],

  props: [
    // frame: base, front post, console and the handrail
    { kind: "rect", x: 40, y: 142, w: 90, h: 4, fill: true },
    { kind: "line", from: [RAIL_POST[0], 142], to: [RAIL_POST[0], 40] },
    { kind: "rect", x: 114, y: 32, w: 20, h: 8 },
    { kind: "line", from: RAIL_POST, to: RAIL_END },
    // the revolving treads
    ...TREADS.map(([x, y]) => ({
      kind: "rect",
      x,
      y,
      w: TREAD.w,
      h: TREAD.h,
      fill: true,
      shift: { mid1: HALF, swap: DROP, mid2: HALF, climbed: DROP },
    })),
  ],
};
