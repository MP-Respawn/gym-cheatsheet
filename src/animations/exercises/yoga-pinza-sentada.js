/*
 * Pinza sentada / Paschimottanasana (yoga)
 * Side view, sitting on the floor facing right with the legs long and the
 * toes up. From sitting tall with the arms overhead, the torso folds
 * forward from the hips over the legs, hands reaching toward the feet,
 * head relaxed. Hold with the breath (each exhale goes a little deeper),
 * then sit back up. The hips on the floor are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [56, 140];
const TORSO_FOLD = 64;
const TORSO_DEEP = 70;

const reach = (torso) => ({
  torso,
  head: torso + 14,
  ...arm("R", neckFrom(HIP, torso), [124, 133], "up"),
  ...arm("L", neckFrom(HIP, torso), [122, 134], "up"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 0, // sitting tall
    head: 2,
    ...both("thigh", 90), // legs long on the floor
    ...both("shin", 90),
    ...both("foot", 4), // toes up
    // arms overhead
    armR: 4,
    forearmR: 4,
    armL: 358,
    forearmL: 358,
  },

  poses: {
    fold: reach(TORSO_FOLD),
    deep: reach(TORSO_DEEP),
  },

  timeline: [
    { to: "fold", s: 1.4, ease: "slow", say: "Inclinate desde la cadera" },
    { to: "deep", s: 1.4, ease: "slow", say: "Exhalá y soltá un poco más" },
    { to: "fold", s: 1, ease: "slow", say: "Exhalá y soltá un poco más" },
    { to: "deep", s: 1.4, ease: "slow", say: "Exhalá y soltá un poco más" },
    { to: "start", s: 1.4, ease: "slow", say: "Subí despacio" },
    { to: "start", s: 0.4 },
  ],
};
