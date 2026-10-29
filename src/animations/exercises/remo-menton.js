/*
 * Remo al mentón
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. Barbell seen from the side (a plate) hanging in front of the
 * thighs. The bar slides straight up along the body to the lower chest
 * while the elbows drive up and out, so they end higher than the hands;
 * the far arm (darker) a hair behind. Short hold on top, slower way down,
 * torso upright the whole time.
 */
import { STAND_SIDE, arm, leg } from "../engine/helpers.js";

const NECK = [80, 52]; // shoulders when standing tall on the ankle root

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
    // bar at the lower chest, elbows up and out, above the hands
    top: {
      ...arm("R", NECK, [NECK[0] + 6, NECK[1] + 10], "up"),
      ...arm("L", NECK, [NECK[0] + 4, NECK[1] + 11], "up"),
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Barra pegada al cuerpo" },
    { to: "top", s: 0.2, say: "Codos más altos que las manos" },
    { to: "start", s: 1.1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4, say: "Bajá lento" },
  ],

  props: [
    // barbell seen from the side (a plate) in the hands
    { kind: "disc", on: "forearmR", r: 8 },
  ],
};
