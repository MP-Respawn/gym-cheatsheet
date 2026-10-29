/*
 * Crunch inverso
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the arms flat by the sides. Knees bent with the shins
 * level (feet in the air). The pelvis curls: the hips lift off the floor
 * and the knees roll toward the chest, then everything comes back down
 * slowly without resting the feet.
 * Cues shown: curl the pelvis, lift the tailbone, slow way down.
 *
 * The hip is the root, moved per pose with $root. The shoulders stay on
 * the floor: the torso is aimed back at the fixed neck point and the arms
 * keep their absolute angles, so nothing above the hips moves.
 */
import { STAND_SIDE, angleBetween, both, neckFrom, point } from "../engine/helpers.js";

const HIP = [80, 140];
const TORSO = 279; // lying back, shoulders a little up
const NECK = neckFrom(HIP, TORSO); // where the shoulders rest

// Arms flat on the floor beside the body (absolute angles, kept in every pose).
const ARMS_FLAT = { armR: 99, forearmR: 95, armL: 100, forearmL: 96 };

// Curled: the hips swing up around the fixed shoulders.
const HIP_UP = point(NECK, 32, 78);
const TORSO_UP = angleBetween(HIP_UP, NECK);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 286,
    ...ARMS_FLAT,
    // knees bent, thighs nearly vertical, shins level, feet relaxed
    ...both("thigh", 5),
    ...both("shin", 95),
    ...both("foot", 60),
  },

  poses: {
    up: {
      $root: [HIP_UP[0] - HIP[0], HIP_UP[1] - HIP[1]],
      torso: TORSO_UP,
      head: 286, // head stays on the floor
      ...ARMS_FLAT,
      ...both("thigh", 330), // knees roll toward the chest (shins follow)
    },
  },

  timeline: [
    { to: "up", s: 0.7, say: "Enrollá la pelvis" },
    { to: "up", s: 0.2, say: "Despegá la cola" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá lento, sin apoyar" },
    { to: "start", s: 0.4 },
  ],
};
