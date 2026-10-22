/*
 * Puente con piernas en la pelota (vuelta: abdomen en pelota, paso 4)
 * Side view, lying on the back with the head to the left, arms flat on the
 * floor and the calves resting on top of a ball. The hips rise until the
 * body makes one line from the shoulders to the heels, hold a moment, and
 * come down slowly. The shoulders are the fixed point; the ball stays put.
 */
import { STAND_SIDE, angleBetween, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const BALL_R = 11;

// Heels on top of the ball.
const ANKLE = [124, 126];

const HIP_DOWN = [72, 140];
const HIP_BRIDGE = point(NECK, 32, 70); // body in one line to the heels

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
    ...leg("R", HIP_DOWN, ANKLE, "up"),
    ...leg("L", HIP_DOWN, [ANKLE[0] - 3, ANKLE[1]], "up"),
    ...both("foot", 20),
  },

  poses: {
    bridge: {
      torso: angleBetween(HIP_BRIDGE, NECK),
      head: 280,
      ...ARMS,
      ...leg("R", HIP_BRIDGE, ANKLE, "up"),
      ...leg("L", HIP_BRIDGE, [ANKLE[0] - 3, ANKLE[1]], "up"),
      ...both("foot", 20),
    },
  },

  timeline: [
    { to: "bridge", s: 0.8, say: "Subí la cadera apretando glúteos" },
    { to: "bridge", s: 0.6, say: "Sostené" },
    { to: "start", s: 1.1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4 },
  ],

  props: [
    { kind: "disc", c: [ANKLE[0] + 2, 148 - BALL_R], r: BALL_R, layer: "mid" },
  ],
};
