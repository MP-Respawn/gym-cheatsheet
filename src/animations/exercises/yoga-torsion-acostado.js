/*
 * Torsión acostado / Supta Matsyendrasana (yoga)
 * Seen from above, lying on a mat (no floor line) with the head to the
 * left: on the back with the arms open in a cross, both knees bent. The
 * knees drop to one side and rest there while the shoulders stay down, come
 * back to the middle, then drop to the other side. The hips are the fixed
 * point.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";
import { MAT, turnPose } from "../engine/poses.js";

// Drawn upright below, then turned -90 so the body lies head left, feet right.
const TURN = -90;
const HIP = [70, 80];

// Knees bent and together, pointing "down" the screen (toward the feet).
const KNEES_UP = { thighR: 176, shinR: 184, thighL: 184, shinL: 176 };

export default {
  view: "front",
  root: "hip",
  at: HIP,
  floor: false,
  lengths: { thighL: 26, thighR: 26, shinL: 22, shinR: 22, footL: 4, footR: 4 },
  props: [MAT],

  start: turnPose(
    {
      ...STAND_FRONT,
      ...mirror("arm", 90), // arms open in a cross on the floor
      ...mirror("forearm", 90),
      ...KNEES_UP,
      ...mirror("foot", 180),
    },
    TURN,
  ),

  poses: {
    // both knees fall to the right, stacked
    right: turnPose({ thighR: 122, shinR: 204, thighL: 128, shinL: 210 }, TURN),
    // and to the left
    left: turnPose({ thighR: 232, shinR: 150, thighL: 238, shinL: 156 }, TURN),
  },

  timeline: [
    { to: "right", s: 1.4, ease: "slow", say: "Rodillas a un costado" },
    { to: "right", s: 1.8, say: "Hombros apoyados, respirá" },
    { to: "start", s: 1, ease: "slow", say: "Volvé al centro" },
    { to: "left", s: 1.4, ease: "slow", say: "Al otro costado" },
    { to: "left", s: 1.8, say: "Hombros apoyados, respirá" },
    { to: "start", s: 1, ease: "slow", say: "Volvé al centro" },
  ],
};
