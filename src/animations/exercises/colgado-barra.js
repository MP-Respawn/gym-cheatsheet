/*
 * Colgado de barra
 * Side view, facing right, dead hang from a pull-up bar: arms straight
 * overhead, legs hanging long, feet relaxed. The near hand on the bar is
 * the fixed point. The movement is tiny on purpose: the shoulders let go
 * up toward the ears and the legs sway a couple of degrees with each slow
 * breath. No floor line: the bar is high and the feet hang above the
 * ground (simplification to fit the drawing).
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const BAR = [84, 10];

// Hanging at arm angle `arms` (hands stay on the bar), torso tilt and leg
// angle; the far leg a hair behind so both show.
const hang = (arms, torso, legs) => ({
  ...both("arm", arms),
  ...both("forearm", arms),
  torso,
  head: torso + 9, // looking ahead
  thighR: legs,
  thighL: legs + 3,
  ...both("shin", legs + 1),
  ...both("foot", 150), // toes relaxed, pointing down
});

export default {
  view: "side",
  root: "handR",
  at: BAR,
  floor: false,

  start: { ...STAND_SIDE, ...hang(5, 359, 180) },

  poses: {
    // shoulders relaxed up to the ears, body swung a touch forward
    relax: hang(3, 1, 183),
    breathe: hang(6, 358, 178),
  },

  timeline: [
    { to: "relax", s: 1.0, ease: "slow", say: "Agarre firme, brazos estirados" },
    { to: "breathe", s: 1.0, ease: "slow", say: "Respirá lento" },
    { to: "relax", s: 1.0, ease: "slow", say: "Dejá caer los hombros" },
    { to: "breathe", s: 1.0, ease: "slow", say: "Respirá lento" },
    { to: "relax", s: 1.0, ease: "slow", say: "Dejá caer los hombros" },
    { to: "start", s: 1.0, ease: "slow", say: "Respirá lento" },
  ],

  props: [
    // pull-up bar (seen end-on) and its frame
    { kind: "line", from: [60, 10], to: [140, 10] },
    { kind: "line", from: [140, 10], to: [140, 158] },
    { kind: "disc", c: BAR, r: 3, fill: true },
  ],
};
