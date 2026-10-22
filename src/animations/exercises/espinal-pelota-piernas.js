/*
 * Espinales en pelota: piernas (vuelta: abdomen en pelota, paso 7)
 * Side view, facing right, chest and belly on top of a ball, hands planted
 * on the floor in front. The legs start down behind, toes near the floor,
 * and lift straight and together until they line up with the trunk,
 * squeezing the glutes, then lower slowly. The hips are the fixed point;
 * the trunk and arms stay put.
 */
import { STAND_SIDE, arm, leg } from "../engine/helpers.js";

const HIP = [74, 104];
const NECK = [104, 115]; // torso pointing right and slightly down, over the ball
const BALL_R = 18;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 110,
    head: 100,
    // hands planted on the floor in front of the ball
    ...arm("R", NECK, [128, 144], "fwd"),
    ...arm("L", NECK, [124, 144], "fwd"),
    // legs down behind, knees soft
    ...leg("R", HIP, [30, 133], "down"),
    ...leg("L", HIP, [34, 133], "down"),
    footR: 200,
    footL: 200,
  },

  poses: {
    up: {
      thighR: 268,
      shinR: 268,
      thighL: 271,
      shinL: 271,
      footR: 250,
      footL: 250,
    },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Subí las piernas juntas" },
    { to: "up", s: 0.3, say: "Apretá glúteos" },
    { to: "start", s: 1.1, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.3 },
  ],

  props: [
    { kind: "disc", c: [90, 148 - BALL_R], r: BALL_R, layer: "back" },
  ],
};
