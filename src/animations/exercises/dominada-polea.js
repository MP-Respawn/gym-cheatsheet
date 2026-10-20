/*
 * Dominada en polea al frente
 * Side view, facing right, seated at the pulldown machine with the thighs
 * locked under the knee pad (jalon-pecho shows the same machine from the
 * front). Arms start up, holding the bar overhead and a little in front; the
 * bar comes down in front of the face to the upper chest. Light weight and
 * high volume, so two quick, even reps per loop (about 0.6 s down, 0.8 s
 * up). The weight stack on the right rises with every pull.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [70, 114];
const TORSO = 352; // sitting tall, leaning back just a little
const SHOULDER = neckFrom(HIP, TORSO);

// Bar overhead (arms almost straight) and at the upper chest.
const BAR_UP = [76, 44];
const BAR_CHEST = [76, 84];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 356,
    ...both("thigh", 90), // thighs on the seat, under the pad
    ...both("shin", 180),
    shinL: 186, // far foot a little behind, so both legs are visible
    ...both("foot", 90),
    ...arm("R", SHOULDER, BAR_UP, "fwd"),
    ...arm("L", SHOULDER, [BAR_UP[0] - 3, BAR_UP[1]], "fwd"),
  },

  poses: {
    // elbows drive down and back, forearms almost vertical under the bar
    pulled: {
      ...arm("R", SHOULDER, BAR_CHEST, "back"),
      ...arm("L", SHOULDER, [BAR_CHEST[0] - 3, BAR_CHEST[1]], "back"),
    },
  },

  timeline: [
    { to: "pulled", s: 0.6, say: "Liviano y constante" },
    { to: "start", s: 0.8, say: "Recorrido completo" },
    { to: "pulled", s: 0.6, say: "Liviano y constante" },
    { to: "start", s: 0.8, say: "Recorrido completo" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // seat and its post
    { kind: "rect", x: 52, y: 117, w: 34, h: 6 },
    { kind: "line", from: [70, 123], to: [70, 148] },
    // knee pad over the thighs, held from the frame
    { kind: "rect", x: 88, y: 103, w: 12, h: 6, layer: "front" },
    { kind: "line", from: [100, 106], to: [124, 106] },
    // frame: top beam with the pulley, column and weight stack
    { kind: "line", from: [78, 4], to: [140, 4] },
    { kind: "line", from: [140, 4], to: [140, 148] },
    { kind: "line", from: [124, 106], to: [124, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { pulled: [0, -14] } },
    // cable from the top pulley to the bar, and the bar seen from the side
    { kind: "cable", anchor: [78, 4], to: "handR" },
    { kind: "disc", on: "forearmR", r: 3, fill: true },
  ],
};
