/*
 * Abdominales laterales en pelota (vuelta: abdomen en pelota, paso 5)
 * Front view, lying on one side with the hip on top of a ball and the feet
 * planted wide on the floor to the right, arms crossed on the chest. The trunk
 * bends sideways up toward the ceiling (a side crunch), then lowers under
 * control over the ball. The hips are the fixed point and stay square.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";

const HIP = [76, 110];
const BALL_R = 19;

// Torso tilt (hip -> neck), measured from vertical: lowered over the ball, and up.
const T_DOWN = 292;
const T_UP = 322;

// Arms crossed on the chest for a torso tilt T: each hand rests near the
// opposite shoulder, a little down the trunk.
function upper(T) {
  const neck = point(HIP, 32, T);
  const shoulderR = point(neck, 13, T + 90); // top shoulder
  const shoulderL = point(neck, 13, T - 90); // bottom shoulder
  const chest = point(neck, 9, T + 180);
  return {
    ...arm("R", shoulderR, point(chest, 7, T - 90), "fwd"),
    ...arm("L", shoulderL, point(chest, 7, T + 90), "fwd"),
  };
}

// The pelvis stays square while the trunk bends.
const PELVIS = { pelvisR: T_DOWN + 90, pelvisL: T_DOWN - 90 };
const HIP_R = point(HIP, 6, T_DOWN + 90);
const HIP_L = point(HIP, 6, T_DOWN - 90);

export default {
  view: "front",
  root: "hip",
  at: HIP,
  lengths: { footL: 5, footR: 5 },

  start: {
    ...STAND_FRONT,
    torso: T_DOWN,
    head: T_DOWN,
    clavL: T_DOWN - 90,
    clavR: T_DOWN + 90,
    ...PELVIS,
    ...upper(T_DOWN),
    // feet planted on the floor, top leg a little ahead of the bottom one
    ...leg("R", HIP_R, [132, 141], "up"),
    ...leg("L", HIP_L, [124, 141], "up"),
    footR: 90,
    footL: 90,
  },

  poses: {
    up: { torso: T_UP, head: T_UP, ...PELVIS, ...upper(T_UP) },
  },

  timeline: [
    { to: "up", s: 0.7, ease: "fast", say: "Subí de costado" },
    { to: "up", s: 0.2 },
    { to: "start", s: 0.9, ease: "slow", say: "Bajá sobre la pelota" },
    { to: "start", s: 0.3 },
  ],

  props: [
    { kind: "disc", c: [HIP[0] + 2, 148 - BALL_R], r: BALL_R, layer: "back" },
  ],
};
