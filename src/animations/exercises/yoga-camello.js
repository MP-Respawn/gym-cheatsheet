/*
 * Camello / Ustrasana (yoga)
 * Side view, facing right, kneeling tall with the shins and the tops of
 * the feet flat behind. The hips press forward over the knees, the chest
 * lifts and opens and the trunk leans back while the hands reach down to
 * the heels, head following last. Hold, then come back up leading with the
 * chest. The knees are the fixed point.
 */
import { STAND_SIDE, angleBetween, arm, both, neckFrom, point } from "../engine/helpers.js";

const KNEE = [76, 141];
const HEELS = [50, 138]; // where the hands land, just above the heels

const HIP_TALL = point(KNEE, 30, 0);
const HIP_FORWARD = point(KNEE, 30, 18); // hips pressed forward
const TORSO_BACK = 296;

const legs = (hip) => ({
  ...both("thigh", angleBetween(hip, KNEE)),
  ...both("shin", 270),
  ...both("foot", 270),
});

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: {
    ...STAND_SIDE,
    ...legs(HIP_TALL),
    // hands on the low back
    armR: 200,
    forearmR: 120,
    armL: 202,
    forearmL: 122,
  },

  poses: {
    camel: {
      ...legs(HIP_FORWARD),
      torso: TORSO_BACK,
      head: 262, // head released back last
      ...arm("R", neckFrom(HIP_FORWARD, TORSO_BACK), HEELS, "back"),
      ...arm("L", neckFrom(HIP_FORWARD, TORSO_BACK), [HEELS[0] - 2, HEELS[1]], "back"),
    },
  },

  timeline: [
    { to: "camel", s: 1.6, ease: "slow", say: "Cadera adelante, pecho arriba" },
    { to: "camel", s: 2, say: "Manos a los talones" },
    { to: "start", s: 1.6, ease: "slow", say: "Subí con el pecho primero" },
    { to: "start", s: 0.4 },
  ],
};
