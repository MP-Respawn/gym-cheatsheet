/*
 * Abdominales en pelota con pies en el suelo (vuelta: abdomen en pelota, paso 1)
 * Side view, head to the left: the lower back rests on top of a ball, the
 * upper back drapes over it, feet flat on the floor with the knees at about
 * 90 degrees, hands behind the head. Two crunches: the shoulders curl up
 * with the abs, a tiny squeeze, then a controlled way down over the ball.
 * The hips are the fixed point; the legs stay planted.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [84, 112]; // just in front of the ball, about level with its top
const BALL = { c: [66, 127], r: 18 }; // its top touches the lower back

// Lying back over the ball.
const TORSO_DOWN = 280;
const NECK = neckFrom(HIP, TORSO_DOWN);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO_DOWN,
    head: 286,
    // feet planted, far leg a little behind so both show
    ...leg("R", HIP, [114, 140], "up"),
    ...leg("L", HIP, [110, 140], "up"),
    ...FEET_FLAT,
    // fingers behind the head, elbows open
    ...arm("R", NECK, point(NECK, 13, TORSO_DOWN + 12), "up"),
    ...arm("L", NECK, point(NECK, 13, TORSO_DOWN + 8), "up"),
  },

  poses: {
    up: { torso: 315, head: 324 },
    low: { torso: 286, head: 292 },
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
    // the ball under the lower back
    { kind: "disc", c: BALL.c, r: BALL.r, layer: "mid" },
  ],
};
