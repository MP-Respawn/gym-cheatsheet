/*
 * Abdominales bolita (vuelta: abdomen clásico, paso 4)
 * Side view, lying on the back with the head to the left, knees bent and
 * feet flat, hands behind the head. Each rep is a classic crunch where the
 * knees also come in to the chest: shoulders up, feet off the floor, and
 * elbows and knees meet in a ball. Then back down under control. The hips
 * are the fixed point.
 */
import { STAND_SIDE, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [86, 140];
const NECK = [54, 137]; // where the shoulders rest in the start pose

// Curled up: shoulders high, elbows forward to the knees.
const TORSO_UP = 318;
const NECK_UP = neckFrom(HIP, TORSO_UP);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276,
    head: 280,
    // knees up, far leg a little behind so both show
    ...leg("R", HIP, [116, 144], "up"),
    ...leg("L", HIP, [112, 144], "up"),
    ...both("foot", 90),
    // fingers behind the head, elbows pointing toward the knees
    ...arm("R", NECK, [42, 131], "up"),
    ...arm("L", NECK, [40, 132], "up"),
  },

  poses: {
    ball: {
      torso: TORSO_UP,
      head: TORSO_UP + 10,
      // hands stay behind the head, the elbows come forward to the knees
      ...arm("R", NECK_UP, point(NECK_UP, 13, TORSO_UP + 30), "fwd"),
      ...arm("L", NECK_UP, point(NECK_UP, 13, TORSO_UP + 24), "fwd"),
      // knees in to the chest, feet off the floor
      thighR: 2,
      shinR: 140,
      footR: 120,
      thighL: 358,
      shinL: 136,
      footL: 116,
    },
  },

  timeline: [
    { to: "ball", s: 0.6, ease: "fast", say: "Codos y rodillas juntos" },
    { to: "ball", s: 0.2 },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "ball", s: 0.6, ease: "fast", say: "Codos y rodillas juntos" },
    { to: "ball", s: 0.2 },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],
};
