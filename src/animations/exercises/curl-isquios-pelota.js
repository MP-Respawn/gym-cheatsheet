/*
 * Curl de isquios con pelota
 * Side view, lying on the back, head to the left, heels up on a swiss ball,
 * arms flat on the floor. The neck/shoulders are the fixed point. Hips up
 * into a bridge, then (hips still up) the heels pull the ball in toward
 * the glutes, roll it back out slowly, and the hips come down.
 * Simplification: the ball is a loose disc that rolls along the floor
 * (shift per pose) instead of being glued to the leg, so it never sinks
 * into the floor; mid-move the heels may float a hair above it.
 */
import { STAND_SIDE, angleBetween, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const BALL_R = 11;

// Heels on top of the ball (the ankle sits right on its top).
const ANKLE_OUT = [126, 126];
const ANKLE_IN = [104, 126];

// Hip positions: resting on the floor, and up in the bridge.
const HIP_DOWN = [72, 140];
const HIP_BRIDGE = point(NECK, 32, 70); // body in one line to the heels
const HIP_CURL = point(NECK, 32, 62); // hips higher while the knees bend

const ARMS = { ...both("arm", 92), ...both("forearm", 90) }; // flat on the floor

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: {
    ...STAND_SIDE,
    torso: angleBetween(HIP_DOWN, NECK),
    head: 280,
    ...ARMS,
    ...leg("R", HIP_DOWN, ANKLE_OUT, "up"),
    ...leg("L", HIP_DOWN, [ANKLE_OUT[0] - 3, ANKLE_OUT[1]], "up"),
    ...both("foot", 20), // toes up, heels on the ball
  },

  poses: {
    bridge: {
      torso: angleBetween(HIP_BRIDGE, NECK),
      head: 280,
      ...ARMS,
      ...leg("R", HIP_BRIDGE, ANKLE_OUT, "up"),
      ...leg("L", HIP_BRIDGE, [ANKLE_OUT[0] - 3, ANKLE_OUT[1]], "up"),
      ...both("foot", 20),
    },
    curl: {
      torso: angleBetween(HIP_CURL, NECK),
      head: 280,
      ...ARMS,
      ...leg("R", HIP_CURL, ANKLE_IN, "up"),
      ...leg("L", HIP_CURL, [ANKLE_IN[0] - 3, ANKLE_IN[1]], "up"),
      ...both("foot", 40),
    },
  },

  timeline: [
    { to: "bridge", s: 0.7, say: "Cadera arriba" },
    { to: "curl", s: 0.8, say: "Traé la pelota" },
    { to: "bridge", s: 1.3, ease: "slow", say: "Devolvela lento" },
    { to: "start", s: 0.8 },
    { to: "start", s: 0.3 },
  ],

  props: [
    // swiss ball under the heels, rolls in with them
    {
      kind: "disc",
      c: [ANKLE_OUT[0] + 2, 148 - BALL_R],
      r: BALL_R,
      shift: { curl: [ANKLE_IN[0] - ANKLE_OUT[0], 0] },
      layer: "mid",
    },
  ],
};
