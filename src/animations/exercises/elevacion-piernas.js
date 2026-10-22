/*
 * Elevaciones de piernas (vuelta: abdomen estirado, paso 2)
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the arms flat by the sides. Straight legs rise to
 * vertical and come down slowly to hover over the floor. The hips are the
 * fixed point and the low back stays on the floor.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [80, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 279, // lying back, shoulders a little up
    head: 286,
    // arms flat on the floor beside the body
    armR: 99,
    forearmR: 95,
    armL: 100,
    forearmL: 96,
    // legs straight and low, hovering over the floor
    ...both("thigh", 80),
    ...both("shin", 80),
    ...both("foot", 55), // toes pointed, in line with the legs
  },

  poses: {
    up: { ...both("thigh", 4) }, // legs vertical
  },

  timeline: [
    { to: "up", s: 0.9, say: "Subí las piernas rectas" },
    { to: "up", s: 0.2 },
    { to: "start", s: 1.3, ease: "slow", say: "Bajá lento, sin apoyar" },
    { to: "start", s: 0.4 },
  ],
};
