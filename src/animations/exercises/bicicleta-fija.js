/*
 * Bicicleta fija
 * Side view, facing right, seated on an upright stationary bike: seat on
 * a post, handlebar on a front post, a crank with a chain ring between
 * them, all on a base. The hip on the seat is the fixed point; the torso
 * leans forward to the bars with the hands resting on them, and the legs
 * pedal: the ankles go around a circle centered on the crank, each foot
 * opposite the other, with the feet kept about level and a pedal under
 * each one. The near knee is only slightly bent at the bottom of the
 * stroke (seat at the right height).
 * Cues shown: round pedal stroke, knee just short of straight at the bottom.
 * Simplification: no crank arms; the pedals ride under the feet.
 */
import { STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [60, 90]; // sitting on the seat (the root)
const TORSO = 30; // leaning forward to the handlebar
const NECK = neckFrom(HIP, TORSO);
const BAR = [104, 70]; // where the hands rest

// The ankles circle the crank. 0 is the top of the stroke, and the
// pedals go forward over the top (clockwise seen from this side).
const CRANK = [88, 128];
const RADIUS = 10;
const ankleAt = (deg, far = false) => {
  const p = point(CRANK, RADIUS, deg);
  return far ? [p[0] - 2, p[1]] : p;
};

// Both legs for the near ankle at `deg` (the far one is half a turn behind).
// Feet about level, toes a little down on the back half.
function pedal(deg) {
  const footNear = deg === 180 ? 95 : deg === 270 ? 100 : 90;
  const footFar = deg === 0 ? 95 : deg === 90 ? 100 : 90;
  return {
    ...leg("R", HIP, ankleAt(deg)),
    ...leg("L", HIP, ankleAt(deg + 180, true)),
    footR: footNear,
    footL: footFar,
  };
}

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 12, // eyes ahead, not at the floor
    ...pedal(0),
    ...arm("R", NECK, BAR, "down"),
    ...arm("L", NECK, [BAR[0] - 3, BAR[1] + 1], "down"),
  },

  poses: {
    p1: pedal(90), // near foot forward
    p2: pedal(180), // near foot at the bottom, knee almost straight
    p3: pedal(270), // near foot back
  },

  timeline: [
    { to: "p1", s: 0.35, ease: "linear", say: "Pedaleá redondo" },
    { to: "p2", s: 0.35, ease: "linear", say: "Pedaleá redondo" },
    { to: "p3", s: 0.35, ease: "linear", say: "Rodilla apenas flexionada abajo" },
    { to: "start", s: 0.35, ease: "linear", say: "Rodilla apenas flexionada abajo" },
  ],

  props: [
    // base, seat on its post, frame tubes to the crank and the handlebar post
    { kind: "rect", x: 40, y: 142, w: 80, h: 4, fill: true },
    { kind: "rect", x: 52, y: 92, w: 16, h: 5 },
    { kind: "line", from: [60, 97], to: [60, 142] },
    { kind: "line", from: [60, 120], to: CRANK },
    { kind: "line", from: CRANK, to: [104, 72] },
    { kind: "line", from: [104, 72], to: [110, 142] },
    { kind: "line", from: [98, 70], to: [114, 66] },
    // chain ring at the crank
    { kind: "disc", c: CRANK, r: 5, fill: true },
    // a pedal under the middle of each foot
    { kind: "line", on: "footL", at: 0.5, from: [-4, 4], to: [4, 4] },
    { kind: "line", on: "footR", at: 0.5, from: [-4, 4], to: [4, 4] },
  ],
};
