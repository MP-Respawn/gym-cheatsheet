/*
 * Curl martillo
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. Alternating arms: the near arm curls while the far arm stays down,
 * then the far arm (darker) curls while the near one rests. Elbows stay by
 * the sides. The dumbbells are short lines across the hands: with the palms
 * facing each other the handle points front to back, so from the side you
 * see its whole length (unlike the plate of a barbell).
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", [80, 84], [76, 144]), // far leg a little behind
    // far arm a few degrees back, so it shows next to the near one
    armL: 185,
    forearmL: 185,
  },

  poses: {
    // near arm curls, far arm still down
    nearUp: {
      armR: 180,
      forearmR: 28,
    },
    // far arm curls, near arm back down
    farUp: {
      armL: 185,
      forearmL: 32,
    },
  },

  timeline: [
    { to: "nearUp", s: 0.8, say: "Palmas mirándose" },
    { to: "start", s: 1, ease: "slow", say: "Palmas mirándose" },
    { to: "farUp", s: 0.8, say: "Alterná" },
    { to: "start", s: 1, ease: "slow", say: "Alterná" },
  ],

  props: [
    // dumbbells: handle across the hand, front to back
    { kind: "line", on: "forearmR", from: [-6, 2], to: [6, 2] },
    { kind: "line", on: "forearmL", from: [-6, 2], to: [6, 2] },
  ],
};
