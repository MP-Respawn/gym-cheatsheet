/*
 * Estiramiento de espalda alta
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. Both arms reach straight out in front at chest height with the
 * hands together, the upper back rounds (the trunk tips forward a little,
 * chin to the chest) and the hands push away so the shoulder blades
 * separate. Hold with two slow breaths (the hands push a touch further and
 * the back rounds a little more on each), then back to standing.
 * Simplification: the trunk is one straight segment, so the rounding shows
 * as a forward tip plus the dropped head.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [80, 84];

// Trunk tipped `torso` degrees forward, arms straight toward `hands`
// (the far hand 2 behind the near one).
function pose(torso, head, hands) {
  const neck = neckFrom(HIP, torso);
  return {
    torso,
    head,
    ...arm("R", neck, hands, "down"),
    ...arm("L", neck, [hands[0] - 2, hands[1] + 1], "down"),
  };
}

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", HIP, [77, 144]), // far leg a little behind
    // far arm a few degrees back so it shows next to the near one
    armL: 184,
    forearmL: 184,
  },

  poses: {
    reach: pose(12, 40, [128, 64]),
    breathe: pose(14, 44, [130, 67]),
  },

  timeline: [
    { to: "reach", s: 1.2, ease: "slow", say: "Manos lejos, omóplatos separados" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Mentón al pecho" },
    { to: "reach", s: 1.2, ease: "slow", say: "Respirá hacia la espalda" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá hacia la espalda" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
