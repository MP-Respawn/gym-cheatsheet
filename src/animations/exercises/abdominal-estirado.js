/*
 * Abdominales estirados (vuelta: abdomen estirado, paso 1)
 * Side view, lying on the back with the head to the left, legs straight
 * along the floor the whole time, arms straight out past the head. The
 * crunch lifts the shoulders with the arms staying in line with the trunk
 * (they do not swing forward), then lowers under control. The hips are the
 * fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [86, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276,
    head: 280,
    // legs straight and resting on the floor, toes up
    ...both("thigh", 90),
    ...both("shin", 90),
    ...both("foot", 10),
    // arms straight past the head, next to the ears
    armR: 274,
    forearmR: 274,
    armL: 276,
    forearmL: 276,
  },

  poses: {
    // the arms follow the trunk, so they stay in line with it
    up: { torso: 304, head: 310 },
    low: { torso: 282, head: 287 },
  },

  timeline: [
    { to: "up", s: 0.6, ease: "fast", say: "Subí con los brazos estirados" },
    { to: "up", s: 0.15 },
    { to: "low", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "up", s: 0.6, ease: "fast", say: "Subí con los brazos estirados" },
    { to: "up", s: 0.15 },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],
};
