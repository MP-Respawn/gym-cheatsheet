/*
 * Curl con barra
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. Barbell seen from the side (a plate) in the hands. Both forearms
 * curl together (the far arm, darker, a few degrees behind) while the elbows
 * stay pinned at the sides and the torso stays upright: no swinging.
 * Controlled up, short squeeze, slower way down.
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", [80, 84], [76, 144]), // far leg a little behind
    // bar resting in front of the thighs
    armR: 180,
    forearmR: 172,
    armL: 183,
    forearmL: 174,
  },

  poses: {
    // forearms up to the shoulders, elbows have not moved
    top: {
      armR: 180,
      forearmR: 22,
      armL: 183,
      forearmL: 24,
    },
  },

  timeline: [
    { to: "top", s: 0.9, say: "Codos quietos" },
    { to: "top", s: 0.2, say: "Codos quietos" },
    { to: "start", s: 1.3, ease: "slow", say: "Sin balancear el torso" },
    { to: "start", s: 0.4, say: "Sin balancear el torso" },
  ],

  props: [
    // barbell seen from the side (a plate) in the hands
    { kind: "disc", on: "forearmR", r: 8 },
  ],
};
