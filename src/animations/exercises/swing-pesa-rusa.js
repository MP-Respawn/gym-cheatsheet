/*
 * Swing con pesa rusa
 * Side view, facing right, feet flat; the near ankle is the fixed point.
 * Two reps around a standing start with the bell hanging in front: the hips
 * go back into a hinge (flat back, soft knees, eyes forward) with the
 * straight arms swinging the bell back between the legs, then a fast hip
 * snap stands the body tall and floats the bell out to chest height with
 * the arms straight. The bell falls back into the hinge on its own and the
 * last swing is parked slowly in front of the hips.
 * Simplification: the bell (a filled ball under a short handle) hangs from
 * the near hand only.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [84, 144];
const ANKLE_FAR = [81, 144];

const HIP_TALL = [84, 84];
const NECK_TALL = neckFrom(HIP_TALL, 0); // [84, 52]
const HIP_HINGE = [60, 95]; // hips pushed back
const TORSO_HINGE = 62; // flat back, well above horizontal
const NECK_HINGE = neckFrom(HIP_HINGE, TORSO_HINGE); // about [88, 80]

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  // standing, the bell hanging in front of the hips
  start: {
    ...STAND_SIDE,
    ...leg("L", HIP_TALL, ANKLE_FAR),
    ...arm("R", NECK_TALL, [92, 100], "back"),
    ...arm("L", NECK_TALL, [90, 100], "back"),
  },

  poses: {
    // bottom: hips back, shins vertical, bell swung back between the legs
    hinge: {
      ...leg("R", HIP_HINGE, ANKLE, "fwd"),
      ...leg("L", HIP_HINGE, ANKLE_FAR, "fwd"),
      ...FEET_FLAT,
      torso: TORSO_HINGE,
      head: TORSO_HINGE - 10, // eyes forward
      ...arm("R", NECK_HINGE, [70, 118], "back"),
      ...arm("L", NECK_HINGE, [68, 118], "back"),
    },
    // top: standing tall, glutes squeezed, bell floating at chest height
    top: {
      ...leg("R", HIP_TALL, ANKLE),
      ...leg("L", HIP_TALL, ANKLE_FAR),
      ...FEET_FLAT,
      torso: 0,
      head: 0,
      ...arm("R", NECK_TALL, [124, 58], "down"),
      ...arm("L", NECK_TALL, [122, 58], "down"),
    },
  },

  timeline: [
    { to: "hinge", s: 0.6, say: "Cola atrás, espalda recta" },
    { to: "top", s: 0.45, ease: "fast", say: "Golpe de cadera" },
    { to: "top", s: 0.2, say: "Glúteos apretados arriba" },
    { to: "hinge", s: 0.6, ease: "in", say: "Dejala caer entre las piernas" },
    { to: "top", s: 0.45, ease: "fast", say: "Golpe de cadera" },
    { to: "start", s: 0.6, ease: "slow" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // kettlebell in the near hand: short handle, the ball hanging below it
    { kind: "line", on: "forearmR", from: [-3, 0], to: [3, 0] },
    { kind: "disc", on: "forearmR", dy: 7, r: 6, fill: true },
  ],
};
