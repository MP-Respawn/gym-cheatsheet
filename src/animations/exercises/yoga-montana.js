/*
 * Postura de la montaña / Tadasana (yoga)
 * Front view, standing tall with the feet hip-width apart and the arms by
 * the sides. A slow breath: on the inhale the body grows a little and the
 * arms float a few degrees away from the body; on the exhale they settle.
 * The left ankle is the fixed point.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

const STAND = {
  ...STAND_FRONT,
  ...mirror("thigh", 177),
  ...mirror("shin", 180),
  ...mirror("foot", 90),
  ...mirror("arm", 172),
  ...mirror("forearm", 176),
};

export default {
  view: "front",
  root: "ankleL",
  at: [74, 144],

  start: STAND,

  poses: {
    // inhale: arms a touch away, head and torso tall
    inhale: { ...mirror("arm", 160), ...mirror("forearm", 166) },
  },

  timeline: [
    { to: "inhale", s: 2, ease: "slow", say: "Inhalá: crecé hacia arriba" },
    { to: "start", s: 2, ease: "slow", say: "Exhalá: hombros abajo" },
    { to: "start", s: 0.4 },
  ],
};
