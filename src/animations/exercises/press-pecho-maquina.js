/*
 * Press de pecho en máquina
 * Front view, seated against the machine's backrest, a vertical grip in each
 * hand at chest height. The hip on the seat is the fixed point. The real
 * push goes toward the viewer, which a front view cannot show, so it is
 * drawn by where the elbows go: at the start they stick out wide at the
 * sides; as the arms extend they come down and in under the hands, which
 * stay in front of the shoulders. The weight stack on the right rises with
 * the push. Push, short lockout, slow return.
 * Simplification: the lever arms of the machine are not drawn, only the
 * grips in the hands.
 */
import { STAND_FRONT, arm, mirror } from "../engine/helpers.js";

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
    // grips at chest height, elbows out wide and back
    ...arm("L", SHOULDER_L, [62, 68], "down"),
    ...arm("R", SHOULDER_R, [98, 68], "down"),
  },

  poses: {
    // arms extended toward the viewer: elbows down and in under the hands
    pressed: {
      ...mirror("arm", 162),
      ...mirror("forearm", 348),
    },
  },

  timeline: [
    { to: "pressed", s: 0.8, say: "Empujá hasta casi estirar" },
    { to: "pressed", s: 0.2 },
    { to: "start", s: 1.2, ease: "slow", say: "Volvé lento" },
    { to: "start", s: 0.4, say: "Espalda apoyada en el respaldo" },
  ],

  props: [
    // machine: column behind the backrest, top beam, post and weight stack
    { kind: "rect", x: 75, y: 12, w: 10, h: 48 },
    { kind: "line", from: [85, 16], to: [140, 16] },
    { kind: "line", from: [140, 6], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { pressed: [0, -14] } },
    // seat with backrest, and its post
    { kind: "rect", x: 66, y: 58, w: 28, h: 46 },
    { kind: "rect", x: 60, y: 106, w: 40, h: 6 },
    { kind: "line", from: [80, 112], to: [80, 148] },
    // vertical grips in the hands
    { kind: "line", on: "forearmL", from: [0, -5], to: [0, 5] },
    { kind: "line", on: "forearmR", from: [0, -5], to: [0, 5] },
  ],
};
