/*
 * Elíptico
 * Side view, facing right, standing on the two foot plates of an
 * elliptical with the hands on the moving poles. The hip is the fixed
 * point (it only bobs a little). Each ankle rides an ellipse, forward
 * along the top and back along the bottom, half a cycle apart, and the
 * plates travel with the feet. The poles pivot under the console and
 * swing against the legs: the near hand is back when the near foot is
 * forward. Feet flat, torso tall.
 * Cues shown: push through the heels, torso tall without hanging on
 * the poles.
 * Simplification: four moments of the cycle joined linearly, so the
 * ankles trace a diamond rather than a true ellipse; both hands meet at
 * the same spot halfway through the swing.
 */
import { STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [72, 86]; // hip with the feet split front / back (the root)
const HIP_UP = [72, 84]; // a hair higher with one foot over the other
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const TORSO = 5;

// The four points of the ankle's ellipse (center [78, 128], 16 wide,
// 6 tall), in the order a foot visits them: forward on top, back below.
const FRONT = [94, 128];
const BOTTOM = [78, 134];
const BACK = [62, 128];
const TOP = [78, 122];

// The poles hang from a pivot on the column and the hands ride an arc
// around it: swung forward, in the middle, swung back.
const PIVOT = [100, 60];
const HAND_FWD = point(PIVOT, 16, 150);
const HAND_MID = point(PIVOT, 16, 172.5);
const HAND_BACK = point(PIVOT, 16, 195);

// Both legs for a pose: ankles on the ellipse, feet flat on the plates.
const legs = (hip, near, far) => ({
  ...leg("R", hip, near),
  ...leg("L", hip, far),
  footR: 90,
  footL: 90,
});

// Both arms for a pose, reaching the hands' spots on the poles.
const arms = (hip, near, far) => ({
  ...arm("R", neckFrom(hip, TORSO), near, "down"),
  ...arm("L", neckFrom(hip, TORSO), far, "down"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,
  floor: 146, // the base of the machine is the ground

  // near foot forward, far foot back; near hand back, far hand forward
  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 4,
    ...legs(HIP, FRONT, BACK),
    ...arms(HIP, HAND_BACK, HAND_FWD),
  },

  poses: {
    // near foot at the bottom going back, far foot on top going forward
    down: {
      $root: off(HIP_UP),
      ...legs(HIP_UP, BOTTOM, TOP),
      ...arms(HIP_UP, HAND_MID, HAND_MID),
    },
    // mirror of start
    back: {
      ...legs(HIP, BACK, FRONT),
      ...arms(HIP, HAND_FWD, HAND_BACK),
    },
    // mirror of down
    up: {
      $root: off(HIP_UP),
      ...legs(HIP_UP, TOP, BOTTOM),
      ...arms(HIP_UP, HAND_MID, HAND_MID),
    },
  },

  timeline: [
    { to: "down", s: 0.4, ease: "linear", say: "Empujá con los talones" },
    { to: "back", s: 0.4, ease: "linear", say: "Empujá con los talones" },
    { to: "up", s: 0.4, ease: "linear", say: "Torso derecho, sin colgarte" },
    { to: "start", s: 0.4, ease: "linear", say: "Torso derecho, sin colgarte" },
  ],

  props: [
    // machine: base, central column and console
    { kind: "rect", x: 30, y: 140, w: 100, h: 6, fill: true },
    { kind: "line", from: [100, 140], to: [100, 56] },
    { kind: "rect", x: 92, y: 48, w: 20, h: 8 },
    // foot plates, one under each foot (they travel with the feet)
    { kind: "line", on: "footR", at: 0.5, from: [-9, 2], to: [8, 2] },
    { kind: "line", on: "footL", at: 0.5, from: [-9, 2], to: [8, 2] },
    // moving poles: pivot on the column, down to each hand
    { kind: "cable", anchor: PIVOT, to: "handL", layer: "back" },
    { kind: "cable", anchor: PIVOT, to: "handR" },
    { kind: "disc", c: PIVOT, r: 3, fill: true },
  ],
};
