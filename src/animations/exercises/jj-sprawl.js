/*
 * Sprawl (Jiu Jitsu)
 * Side view, facing right. From standing in guard (feet staggered, hands
 * up), the hands drop to the floor and the legs shoot back wide on the
 * toes while the hips sink heavy toward the floor with the chest up; then
 * the legs snap back under and the body stands in guard again. The hips
 * set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { asStart, quad } from "../engine/poses.js";

const AT = [70, 88]; // standing

const GUARD = quad({
  base: AT,
  hip: AT,
  torso: 8,
  head: 8,
  handR: [88, 62],
  handL: [84, 64],
  ankleR: [88, 144],
  ankleL: [56, 144],
  footR: 90,
  footL: 70,
  knees: "fwd",
  elbows: "down",
});

// Hands down, legs going back.
const DROP = quad({
  base: AT,
  hip: [70, 112],
  torso: 70,
  head: 70,
  handR: [100, 144],
  handL: [97, 144],
  ankleR: [44, 140],
  ankleL: [40, 140],
  footR: 255,
  footL: 255,
  knees: "down",
  elbows: "back",
});

// Sprawled: hips heavy and low, legs long behind on the toes, chest up.
const SPRAWL = quad({
  base: AT,
  hip: [62, 134],
  torso: 62,
  head: 50,
  handR: [100, 144],
  handL: [97, 144],
  ankleR: [16, 138],
  ankleL: [20, 138],
  footR: 260,
  footL: 260,
  knees: "up",
  elbows: "back",
});

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(GUARD) },

  poses: { drop: DROP, sprawl: SPRAWL },

  timeline: [
    { to: "drop", s: 0.25, ease: "fast", say: "Manos al piso, piernas atrás" },
    { to: "sprawl", s: 0.25, say: "Cadera pesada al piso" },
    { to: "sprawl", s: 0.4, say: "Cadera pesada al piso" },
    { to: "drop", s: 0.3, ease: "fast", say: "Volvé a guardia rápido" },
    { to: "start", s: 0.35, say: "Volvé a guardia rápido" },
    { to: "start", s: 0.5 },
  ],
};
