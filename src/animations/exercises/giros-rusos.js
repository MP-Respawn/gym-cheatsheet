/*
 * Giros rusos
 * Side view, seated on the floor leaning back, knees bent and feet off the
 * floor, a medicine ball held in both hands in front of the chest. The hips
 * are the fixed point and the trunk stays still. The twist cannot be seen
 * from the side, so it is drawn as the swing of the ball: down to the hip
 * on one side, out in front on the way to the other, and back. Both arms
 * move together on the same ball.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [84, 141];
const TORSO = 325;
const NECK = neckFrom(HIP, TORSO);

// Where the ball goes: centered at the chest, down by the hip, out in front.
const CENTER = [NECK[0] + 28, NECK[1] - 2];
const LOW = [HIP[0] + 6, HIP[1] - 16];
const FRONT = [NECK[0] + 38, NECK[1] - 8];

const hold = (target) => ({
  ...arm("R", NECK, target, "down"),
  ...arm("L", NECK, [target[0] - 2, target[1] + 2], "down"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO + 12,
    ...both("thigh", 55),
    ...both("shin", 120),
    ...both("foot", 90),
    ...hold(CENTER),
  },

  poses: {
    left: hold(LOW),
    right: hold(FRONT),
  },

  timeline: [
    { to: "left", s: 0.6, say: "Girá a un lado" },
    { to: "left", s: 0.15 },
    { to: "right", s: 0.8, say: "Y al otro" },
    { to: "right", s: 0.15 },
    { to: "left", s: 0.8, say: "Girá desde el torso" },
    { to: "start", s: 0.5 },
    { to: "start", s: 0.3 },
  ],

  props: [
    // medicine ball in the hands
    { kind: "disc", on: "forearmR", r: 6 },
  ],
};
