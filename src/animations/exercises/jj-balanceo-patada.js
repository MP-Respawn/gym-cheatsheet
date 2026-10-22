/*
 * Balanceo y patada / Rock and kick (Jiu Jitsu)
 * Side view, facing right. Sitting tucked with the knees to the chest and
 * the arms around them, the body rocks back onto the rounded back, the
 * legs kick straight up toward the ceiling, tuck in again and the body
 * rocks forward to sitting. The hips set the place.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const AT = [74, 136]; // sitting tucked, on the seat

// Sitting tucked: trunk leaning back a little, knees in, arms around the shins.
const SIT = {
  torso: 346,
  head: 10,
  thighR: 32,
  thighL: 36,
  shinR: 168,
  shinL: 172,
  ...both("foot", 70),
  armR: 140,
  forearmR: 60,
  armL: 144,
  forearmL: 64,
};

// Rocked back onto the shoulders: the whole ball tips back.
const tip = (pose, d) =>
  Object.fromEntries(Object.entries(pose).map(([k, a]) => [k, typeof a === "number" ? a - d : a]));

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...SIT },

  poses: {
    back: { ...tip(SIT, 70), $root: [4, 2] },
    kick: {
      ...tip(SIT, 70),
      $root: [6, -2],
      // legs straight up toward the ceiling
      thighR: 352,
      shinR: 352,
      thighL: 356,
      shinL: 356,
      ...both("foot", 40),
    },
  },

  timeline: [
    { to: "back", s: 0.5, say: "Balanceate atrás" },
    { to: "kick", s: 0.3, ease: "fast", say: "Pateá hacia arriba" },
    { to: "back", s: 0.35, say: "Recogé" },
    { to: "start", s: 0.5, say: "Volvé adelante" },
    { to: "start", s: 0.3 },
  ],
};
