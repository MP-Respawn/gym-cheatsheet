/*
 * Peck deck
 * Front view, seated against the machine's backrest with the forearms on
 * the two lever pads. The hip on the seat is the fixed point. Arms start
 * open: upper arms out at shoulder height, forearms up. Closing is drawn
 * flat: the elbows swing down and in and the pads meet in front of the
 * chest (the real move comes toward the viewer, which a front view cannot
 * show). The weight stack on the right rises with the squeeze.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

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
    // arms open: upper arms out to the sides, forearms up on the pads
    ...mirror("arm", 90),
    ...mirror("forearm", 0),
  },

  poses: {
    // elbows down and in, pads together in front of the chest
    closed: {
      ...mirror("arm", 148),
      ...mirror("forearm", 302),
    },
  },

  timeline: [
    { to: "closed", s: 0.9, say: "Juntá adelante" },
    { to: "closed", s: 0.3, say: "Apretá un segundo" },
    { to: "start", s: 1.2, ease: "slow", say: "Abrí lento, sin pasarte" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // machine: column behind the backrest, top beam, post and weight stack
    { kind: "rect", x: 75, y: 12, w: 10, h: 48 },
    { kind: "line", from: [85, 16], to: [140, 16] },
    { kind: "line", from: [140, 6], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { closed: [0, -14] } },
    // seat with backrest, and its post
    { kind: "rect", x: 66, y: 58, w: 28, h: 46 },
    { kind: "rect", x: 60, y: 106, w: 40, h: 6 },
    { kind: "line", from: [80, 112], to: [80, 148] },
    // lever pads along each forearm
    { kind: "line", on: "forearmL", from: [0, -6], to: [0, 10] },
    { kind: "line", on: "forearmR", from: [0, -6], to: [0, 10] },
  ],
};
