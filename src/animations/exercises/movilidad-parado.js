/*
 * Movilidad articular de parado
 * Front view, standing. Two samples of the full head-to-toe warm-up:
 * (1) a big arm circle: both arms rise through the sides to overhead and
 * come back down the same way; (2) the hips shift side to side with the
 * feet planted. Wide, smooth moves with no bouncing. The hips are the
 * root and slide with $root; the legs reach to fixed ankle points, so the
 * feet never move.
 */
import { STAND_FRONT, leg, mirror } from "../engine/helpers.js";

const HIP = [80, 84.2]; // legs just short of fully locked
const ANKLE_L = [70, 144];
const ANKLE_R = [90, 144];
const SHIFT = 8; // how far the hips slide each way

// Hips slid sideways by dx (and down a hair, knees soften), legs re-aimed
// at the planted ankles, torso leaning a little the other way.
function hips(dx) {
  const hip = [HIP[0] + dx, HIP[1] + 1];
  return {
    $root: [dx, 1],
    ...leg("L", [hip[0] - 6, hip[1]], ANKLE_L, "back"),
    ...leg("R", [hip[0] + 6, hip[1]], ANKLE_R, "fwd"),
    footL: 270,
    footR: 90,
    torso: -dx * 0.5,
  };
}

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    ...leg("L", [HIP[0] - 6, HIP[1]], ANKLE_L, "back"),
    ...leg("R", [HIP[0] + 6, HIP[1]], ANKLE_R, "fwd"),
  },

  poses: {
    // arms out to the sides, a T
    side: { ...mirror("arm", 90), ...mirror("forearm", 88) },
    // arms overhead
    up: { ...mirror("arm", 14), ...mirror("forearm", 8) },
    hipsR: hips(SHIFT),
    hipsL: hips(-SHIFT),
  },

  timeline: [
    { to: "side", s: 0.6, say: "Brazos arriba" },
    { to: "up", s: 0.6, say: "Brazos arriba" },
    { to: "start", s: 1.0, say: "Bajalos por los costados" },
    { to: "hipsR", s: 0.8, say: "Cadera a un lado" },
    { to: "hipsL", s: 1.1, say: "Al otro lado" },
    { to: "start", s: 0.7 },
  ],
};
