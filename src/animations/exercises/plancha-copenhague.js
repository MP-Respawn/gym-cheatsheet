/*
 * Planchas Copenhague
 * Seen from the front of the body: side plank on the near forearm (the
 * fixed point is that elbow), head to the right, top leg straight with the
 * foot up on a bench on the left. Body in one line from the shoulder to
 * the top foot ("cadera arriba"). The bottom leg (far, darker) hangs
 * under the bench and pushes up to touch it twice, then the plank is held.
 * The top hand rests on the hip.
 */
import { STAND_SIDE, angleBetween, arm, point } from "../engine/helpers.js";

const ELBOW = [120, 141];
const SHOULDER = [120, 120]; // upper arm vertical over the elbow
const ANKLE_TOP = [30, 111]; // top foot on the bench

// Shoulder -> top ankle is one straight line: the hip sits on it.
const LINE = angleBetween(SHOULDER, ANKLE_TOP);
const HIP = point(SHOULDER, 32, LINE);

// Bottom leg straight from the hip: hanging low, or pushed up to the bench.
const LEG_DOWN = 247;
const LEG_UP = 261;

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW,
  lengths: { footL: 7, footR: 7 },

  start: {
    ...STAND_SIDE,
    armR: 180, // supporting upper arm vertical
    forearmR: 90, // forearm flat on the floor
    torso: LINE + 180, // hip -> neck
    head: LINE + 180 - 15,
    ...arm("L", SHOULDER, [HIP[0] + 4, HIP[1] - 5], "up"), // top hand on the hip
    thighR: LINE,
    shinR: LINE,
    // feet point at us in this view: drawn short, pointing up
    footR: 355,
    footL: 45,
    thighL: LEG_DOWN,
    shinL: LEG_DOWN,
  },

  poses: {
    up: {
      thighL: LEG_UP,
      shinL: LEG_UP,
      footL: 55, // toes clear the underside of the bench
    },
  },

  timeline: [
    { to: "up", s: 0.5, say: "Empujá con el pie de abajo" },
    { to: "start", s: 0.5, say: "Empujá con el pie de abajo" },
    { to: "up", s: 0.5, say: "Empujá con el pie de abajo" },
    { to: "start", s: 0.5, say: "Empujá con el pie de abajo" },
    { to: "start", s: 1.4, say: "Cadera arriba" },
  ],

  props: [
    // bench: pad and two legs
    { kind: "rect", x: 4, y: 115, w: 40, h: 7 },
    { kind: "line", from: [10, 122], to: [10, 148] },
    { kind: "line", from: [38, 122], to: [38, 148] },
  ],
};
