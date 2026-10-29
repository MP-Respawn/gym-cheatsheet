/*
 * Estiramiento de antebrazos
 * Side view, facing right, standing still; the near ankle is the fixed
 * point. The near arm extends straight out in front at shoulder height and
 * the far hand pulls its fingers: first from below (palm up, fingers down,
 * the flexors), then from above (palm down, the extensors). Each side holds
 * with a slow breath where the far hand pulls a little further, then the
 * arms come down.
 * Simplification: the hand is not a segment, so the bend of the wrist is
 * not drawn; the far hand (darker) under or over the near hand tells which
 * way it pulls.
 */
import { STAND_SIDE, arm, leg } from "../engine/helpers.js";

const HIP = [80, 84];
const NECK = [80, 52];

// Near arm straight out front; far hand pulling at `pull` (just past the
// near hand, below it for palm up, above it for palm down).
function pose(pull) {
  return {
    armR: 92,
    forearmR: 92,
    ...arm("L", NECK, pull, "down"),
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
    palmUp: pose([124, 59]),
    palmUpPull: pose([124, 62]),
    palmDown: pose([124, 47]),
    palmDownPull: pose([124, 44]),
  },

  timeline: [
    { to: "palmUp", s: 1, ease: "slow", say: "Palma arriba, dedos hacia abajo" },
    { to: "palmUpPull", s: 1.2, ease: "slow", say: "Tirá suave, sin rebotar" },
    { to: "palmDown", s: 1, ease: "slow", say: "Palma abajo" },
    { to: "palmDownPull", s: 1.2, ease: "slow", say: "Tirá suave, sin rebotar" },
    { to: "start", s: 0.9, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
