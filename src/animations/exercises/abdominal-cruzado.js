/*
 * Abdominal cruzado (vuelta: abdomen clásico, pasos 2 y 3)
 * Side view, lying on the back with the head to the left, knees bent and
 * feet flat, hands behind the head. Each crunch twists: one elbow drives
 * forward toward the opposite knee while the other stays back. First the
 * near (lighter) elbow leads, then the far (darker) one. The hips are the
 * fixed point.
 */
import { STAND_SIDE, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [86, 140];
const NECK = [54, 137]; // where the shoulders rest in the start pose

// Shoulders up, slightly more than a plain crunch.
const TORSO_UP = 308;
const NECK_UP = neckFrom(HIP, TORSO_UP);
const HAND_UP = point(NECK_UP, 13, TORSO_UP + 12); // fingers behind the head

// The leading elbow points forward to the knees; the other one opens back.
const LEAD = (side) => arm(side, NECK_UP, HAND_UP, "fwd");
const STAY = (side) => arm(side, NECK_UP, [HAND_UP[0] - 2, HAND_UP[1] + 1], "up");

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276,
    head: 280,
    ...leg("R", HIP, [116, 144], "up"),
    ...leg("L", HIP, [112, 144], "up"),
    ...both("foot", 90),
    ...arm("R", NECK, [42, 131], "up"),
    ...arm("L", NECK, [40, 132], "up"),
  },

  poses: {
    nearElbow: { torso: TORSO_UP, head: TORSO_UP + 10, ...LEAD("R"), ...STAY("L") },
    farElbow: { torso: TORSO_UP, head: TORSO_UP + 10, ...LEAD("L"), ...STAY("R") },
  },

  timeline: [
    { to: "nearElbow", s: 0.6, ease: "fast", say: "Codo a la rodilla opuesta" },
    { to: "nearElbow", s: 0.2 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "farElbow", s: 0.6, ease: "fast", say: "Ahora con el otro brazo" },
    { to: "farElbow", s: 0.2 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],
};
