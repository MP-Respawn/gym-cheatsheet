/*
 * Triángulo / Trikonasana (yoga)
 * Front view, legs wide and straight, the right foot pointing right. The
 * torso tilts sideways over the right leg until it is nearly level: the
 * lower hand slides down to the shin and the upper arm points straight up,
 * both arms in one line. Hold, then come back up with the arms out. The
 * hips are the fixed point and stay square.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";

const HIP = [76, 94];
const RIGHT_ANKLE = [122, 144];
const LEFT_ANKLE = [26, 144];
const PELVIS = { pelvisR: 90, pelvisL: 270 };

const LEGS = {
  ...PELVIS,
  ...leg("R", point(HIP, 6, 90), RIGHT_ANKLE, "fwd"),
  ...leg("L", point(HIP, 6, 270), LEFT_ANKLE, "back"),
  footR: 90,
  footL: 260,
};

// Torso tilt T (0 = upright, 90 = level to the right), arms in one line:
// the lower one straight down to the shin, the upper one straight up.
function tilt(T) {
  const neck = point(HIP, 32, T);
  const lower = point(neck, 13, T + 90);
  const upper = point(neck, 13, T - 90);
  return {
    torso: T,
    head: T - 10,
    clavR: T + 90,
    clavL: T - 90,
    ...arm("R", lower, point(lower, 40, T + 90), "down"),
    ...arm("L", upper, point(upper, 41, T - 90), "up"),
  };
}

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    ...LEGS,
    torso: 0,
    head: 0,
    // arms out at shoulder height
    armR: 90,
    forearmR: 90,
    armL: 270,
    forearmL: 270,
  },

  poses: {
    triangle: { ...LEGS, ...tilt(80) },
  },

  timeline: [
    { to: "triangle", s: 1.3, ease: "slow", say: "Inclinate de costado" },
    { to: "triangle", s: 2.2, say: "Sostené: brazos en una línea" },
    { to: "start", s: 1.1, ease: "slow", say: "Subí con los brazos en cruz" },
    { to: "start", s: 0.4 },
  ],
};
