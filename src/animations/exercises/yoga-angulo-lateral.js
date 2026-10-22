/*
 * Ángulo lateral extendido / Utthita Parsvakonasana (yoga)
 * Front view, from Guerrero II (legs wide, right knee bent over the ankle,
 * arms out). The torso leans over the right thigh: the lower forearm rests
 * on the thigh and the upper arm reaches long over the ear, one diagonal
 * line from the back foot to the top hand. Hold, then back to Guerrero II.
 * The left ankle is the fixed point; both feet stay planted.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";

const LEFT_ANKLE = [26, 144];
const RIGHT_ANKLE = [122, 144];
const HIP = [78, 110]; // low, right knee bent

const PELVIS = { pelvisR: 90, pelvisL: 270 };
const LEGS = {
  ...PELVIS,
  ...leg("R", point(HIP, 6, 90), RIGHT_ANKLE, "fwd"),
  ...leg("L", point(HIP, 6, 270), LEFT_ANKLE, "back"),
  footR: 90,
  footL: 260,
};

// Leaning over the thigh, torso tilt T.
function lean(T) {
  const neck = point(HIP, 32, T);
  const lower = point(neck, 13, T + 90);
  const upper = point(neck, 13, T - 90);
  return {
    torso: T,
    head: T - 15,
    clavR: T + 90,
    clavL: T - 90,
    // lower forearm on the thigh, elbow near the knee
    ...arm("R", lower, [lower[0] + 14, lower[1] - 2], "down"),
    // upper arm long over the ear, continuing the line from the back leg
    ...arm("L", upper, point(upper, 41, T - 6), "up"),
  };
}

export default {
  view: "front",
  root: "ankleL",
  at: LEFT_ANKLE,

  start: {
    ...STAND_FRONT,
    ...LEGS,
    armR: 90,
    forearmR: 90,
    armL: 270,
    forearmL: 270,
  },

  poses: {
    angle: { ...LEGS, ...lean(64) },
  },

  timeline: [
    { to: "angle", s: 1.3, ease: "slow", say: "Antebrazo al muslo, brazo largo" },
    { to: "angle", s: 2.2, say: "Sostené: una línea del pie a la mano" },
    { to: "start", s: 1.1, ease: "slow", say: "Volvé al Guerrero II" },
    { to: "start", s: 0.4 },
  ],
};
