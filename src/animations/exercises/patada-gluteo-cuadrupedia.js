/*
 * Patada de glúteo en cuadrupedia
 * Side view, facing right, on hands and knees: hands under the shoulders,
 * knees under the hips, back flat, a small ankle weight on the near leg.
 * The hips are the fixed point and stay level. The near leg lifts behind
 * with the knee bent at 90 degrees until the thigh is a little above the
 * line of the back, sole of the foot to the ceiling; short squeeze, then
 * it lowers slowly without resting the knee, and a second rep. The arms
 * stay planted and the torso does not move.
 */
import { STAND_SIDE, angleBetween, both, point } from "../engine/helpers.js";

const HIP = [66, 111];
const TORSO = 70; // back nearly flat, shoulders a little higher than the hips
const NECK = point(HIP, 32, TORSO);

// Four supports: arms straight down to the floor, thighs straight down,
// shins flat on the floor behind.
const HAND = [NECK[0], 141];
const ARM_DOWN = angleBetween(NECK, HAND);

// Kick: thigh back and up, shin pointing up (knee at 90), foot flexed so
// the sole faces the ceiling.
const KICK_THIGH = 285;
const KICK_SHIN = 5;
const KICK_FOOT = KICK_SHIN - 90;

export default {
  view: "side",
  root: "hip",
  at: HIP,
  lengths: { footL: 8, footR: 8 },

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO + 8,
    ...both("arm", ARM_DOWN),
    ...both("forearm", ARM_DOWN),
    ...both("thigh", 180),
    ...both("shin", 270),
    ...both("foot", 270),
  },

  poses: {
    up: {
      thighR: KICK_THIGH,
      shinR: KICK_SHIN,
      footR: KICK_FOOT,
    },
    // between reps: knee a few units above the floor, not resting
    hover: {
      thighR: 188,
      shinR: 268,
      footR: 272,
    },
  },

  timeline: [
    { to: "up", s: 0.7, say: "Planta del pie al techo" },
    { to: "up", s: 0.3, say: "Apretá el glúteo" },
    { to: "hover", s: 0.9, ease: "slow", say: "Bajá sin apoyar la rodilla" },
    { to: "up", s: 0.6, say: "Planta del pie al techo" },
    { to: "up", s: 0.3, say: "Apretá el glúteo" },
    { to: "start", s: 0.9, ease: "slow", say: "Bajá sin apoyar la rodilla" },
  ],

  props: [
    // ankle weight strapped just above the near ankle
    { kind: "rect", on: "shinR", x: 0, y: -3, w: 7, h: 6, fill: true },
  ],
};
