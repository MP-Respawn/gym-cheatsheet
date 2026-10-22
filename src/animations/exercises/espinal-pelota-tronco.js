/*
 * Espinales en pelota: tronco (vuelta: abdomen en pelota, paso 6)
 * Side view, facing right, lying face down over a ball with the ball under
 * the hips, legs straight back and toes on the floor, hands at the sides of
 * the head. The trunk starts folded down over the ball and lifts until it
 * lines up with the legs (no further), then lowers slowly. The hips are
 * the fixed point.
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

const HIP = [74, 108];
const BALL_R = 19;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 124, // folded down over the ball
    head: 130,
    // hands at the head, elbows out
    armR: 70,
    forearmR: 205,
    armL: 75,
    forearmL: 210,
    // legs straight back to the floor, on the toes
    ...leg("R", HIP, [26, 134], "down"),
    ...leg("L", HIP, [30, 134], "down"),
    footR: 200,
    footL: 200,
  },

  poses: {
    // trunk in line with the legs
    up: { torso: 74, head: 80 },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Subí hasta la línea" },
    { to: "up", s: 0.3 },
    { to: "start", s: 1.1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.3 },
  ],

  props: [
    { kind: "disc", c: [HIP[0] + 4, 148 - BALL_R], r: BALL_R, layer: "back" },
  ],
};
