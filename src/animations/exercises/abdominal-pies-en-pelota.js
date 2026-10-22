/*
 * Abdominales con pies en la pelota (vuelta: abdomen en pelota, paso 1)
 * Side view, lying on the back with the head to the left, hands behind the
 * head and the feet resting on top of a ball (knees bent, shins about
 * level). Two crunches: the shoulders curl up with the abs, a tiny squeeze,
 * then a controlled way down that stops short of resting. The hips are the
 * fixed point; the legs stay on the ball.
 */
import { STAND_SIDE, arm, both, leg } from "../engine/helpers.js";

const HIP = [86, 140];
const NECK = [54, 137]; // where the shoulders rest in the start pose
const BALL_R = 15;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276, // lying back, shoulders barely off the floor
    head: 280,
    // feet up on the ball, far leg a little behind so both show
    ...leg("R", HIP, [122, 113], "up"),
    ...leg("L", HIP, [118, 113], "up"),
    ...both("foot", 20),
    // fingers behind the head, elbows pointing toward the knees
    ...arm("R", NECK, [42, 131], "up"),
    ...arm("L", NECK, [40, 132], "up"),
  },

  poses: {
    up: { torso: 306, head: 316 },
    low: { torso: 282, head: 288 },
  },

  timeline: [
    { to: "up", s: 0.5, ease: "fast", say: "Hombros bien arriba" },
    { to: "up", s: 0.15 },
    { to: "low", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "up", s: 0.5, ease: "fast", say: "Hombros bien arriba" },
    { to: "up", s: 0.15 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // the ball under the feet
    { kind: "disc", c: [120, 148 - BALL_R], r: BALL_R, layer: "mid" },
  ],
};
