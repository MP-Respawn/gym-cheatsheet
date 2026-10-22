/*
 * Elevación de tronco con pelota (vuelta: abdomen en pelota, paso 2)
 * Side view, lying on the back with the head to the left, knees bent and
 * feet flat, holding a ball with the arms straight up over the chest. The
 * trunk curls up and the ball rides up and forward with the arms, then the
 * trunk lowers under control. The hips are the fixed point.
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";

const HIP = [86, 140];

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
    // arms straight up toward the ceiling, holding the ball
    armR: 2,
    forearmR: 2,
    armL: 358,
    forearmL: 358,
  },

  poses: {
    // the arms follow the trunk, so the ball travels up and toward the knees
    up: { torso: 310, head: 320 },
    low: { torso: 284, head: 290 },
  },

  timeline: [
    { to: "up", s: 0.6, ease: "fast", say: "Subí llevando la pelota" },
    { to: "up", s: 0.2 },
    { to: "low", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "up", s: 0.6, ease: "fast", say: "Subí llevando la pelota" },
    { to: "up", s: 0.2 },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // ball held in both hands, just above them
    { kind: "disc", on: "forearmR", dx: 0, dy: -8, r: 9 },
  ],
};
