/*
 * Remo en máquina
 * Side view, facing right, seated with the chest against the pad. The hip
 * on the seat is the fixed point and the torso never moves: only the arms
 * row. The handles hang from a lever that swings around a pivot above, so
 * they travel on an arc; the weight stack on the right rises with the pull.
 * Pull, squeeze the shoulder blades for a moment, controlled return.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [56, 114];
const TORSO = 10; // leaning a little into the chest pad
const SHOULDER = neckFrom(HIP, TORSO);

// Handles out in front (arms long) and pulled in next to the chest pad.
// The lever pivot sits above the knees, clear of the face; the lever
// stretches a little (under 10%) between the two points.
const PIVOT = [87, 38];
const HANDLE_OUT = [100, 90];
const HANDLE_IN = [70, 94];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 12,
    ...both("thigh", 90), // thighs on the seat
    ...both("shin", 180),
    shinL: 186, // far foot a little behind
    ...both("foot", 90),
    ...arm("R", SHOULDER, HANDLE_OUT, "down"),
    ...arm("L", SHOULDER, [HANDLE_OUT[0] - 3, HANDLE_OUT[1]], "down"),
  },

  poses: {
    // elbows back past the torso, hands next to the pad
    pulled: {
      ...arm("R", SHOULDER, HANDLE_IN, "back"),
      ...arm("L", SHOULDER, [HANDLE_IN[0] - 3, HANDLE_IN[1]], "back"),
    },
  },

  timeline: [
    { to: "pulled", s: 0.8, say: "Pecho pegado al apoyo" },
    { to: "pulled", s: 0.5, say: "Juntá los omóplatos" },
    { to: "start", s: 1.2, ease: "slow", say: "Pecho pegado al apoyo" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // seat and its post
    { kind: "rect", x: 38, y: 117, w: 32, h: 6 },
    { kind: "line", from: [54, 123], to: [54, 148] },
    // chest pad, held from a post in front of the knees
    { kind: "rect", x: 67, y: 80, w: 5, h: 22 },
    { kind: "line", from: [72, 100], to: [112, 100] },
    { kind: "line", from: [112, 100], to: [112, 148] },
    // frame with the lever pivot, column and weight stack
    { kind: "line", from: PIVOT, to: [140, 38] },
    { kind: "line", from: [140, 38], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { pulled: [0, -14] } },
    // lever arm from the pivot down to the handles
    { kind: "cable", anchor: PIVOT, to: "handR" },
    { kind: "disc", c: PIVOT, r: 3, fill: true },
    // handle grip in the near hand
    { kind: "line", on: "forearmR", from: [0, -4], to: [0, 4] },
  ],
};
