/*
 * Árbol / Vrksasana (yoga)
 * Front view, standing on the left leg. The right foot lifts and its sole
 * rests on the inside of the left thigh, knee open to the side, while the
 * hands rise and meet overhead. Hold with a tiny balancing sway, then the
 * foot and the arms come down. The standing ankle is the fixed point.
 */
import { STAND_FRONT, arm, mirror, point } from "../engine/helpers.js";

const ANKLE = [74, 144];

// Standing on both feet, arms down.
const STAND = {
  ...STAND_FRONT,
  thighL: 180,
  shinL: 180,
  footL: 270,
  thighR: 176,
  shinR: 180,
  footR: 90,
  ...mirror("arm", 172),
  ...mirror("forearm", 176),
};

// With the left leg straight up from the ankle, the left hip joint is 60
// above it and the body's center (hip) 6 to its right; the neck 32 above.
const NECK = [ANKLE[0] + 6, ANKLE[1] - 60 - 32];
const OVERHEAD = [NECK[0], NECK[1] - 40]; // hands together above the head

function tree(sway) {
  return {
    thighL: 180 + sway,
    shinL: 180 + sway,
    footL: 270,
    torso: -sway,
    head: -sway,
    // right foot on the inside of the left thigh, knee out
    thighR: 128,
    shinR: 243,
    footR: 200,
    ...arm("R", point(NECK, 13, 90), [OVERHEAD[0] + 1, OVERHEAD[1]], "fwd"),
    ...arm("L", point(NECK, 13, 270), [OVERHEAD[0] - 1, OVERHEAD[1]], "back"),
  };
}

export default {
  view: "front",
  root: "ankleL",
  at: ANKLE,

  start: STAND,

  poses: {
    tree: tree(0),
    swayA: tree(1.5),
    swayB: tree(-1.5),
  },

  timeline: [
    { to: "tree", s: 1.2, ease: "slow", say: "Pie al muslo, manos arriba" },
    { to: "swayA", s: 1, say: "Mirá un punto fijo" },
    { to: "swayB", s: 1.2, say: "Mirá un punto fijo" },
    { to: "tree", s: 0.8, say: "Mirá un punto fijo" },
    { to: "start", s: 1, ease: "slow", say: "Bajá despacio" },
    { to: "start", s: 0.4 },
  ],
};
