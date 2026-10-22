/*
 * Postura del niño / Balasana (yoga)
 * Side view, facing right. From four supports (hands under the shoulders,
 * knees under the hips), the hips sink back onto the heels and the chest
 * comes down onto the thighs, arms long in front, forehead toward the
 * floor. Two slow breaths there (the back rises and settles), then back to
 * four supports. The knees and the hands stay planted; the knees are the
 * fixed point.
 */
import { STAND_SIDE, angleBetween, arm, both, neckFrom, point } from "../engine/helpers.js";

const KNEE = [86, 141];
const HANDS = [130, 141];

// Four supports: hips over the knees, back nearly flat.
const HIP_TABLE = point(KNEE, 30, 0);
const TORSO_TABLE = 74;

// Child: hips back on the heels, chest on the thighs.
const HIP_CHILD = point(KNEE, 30, 296);
const TORSO_CHILD = 98;

function pose(hip, torso, head) {
  return {
    ...both("thigh", angleBetween(hip, KNEE)),
    ...both("shin", 270), // shins flat on the floor behind
    ...both("foot", 270), // tops of the feet down
    torso,
    head,
    ...arm("R", neckFrom(hip, torso), HANDS, "up"),
    ...arm("L", neckFrom(hip, torso), [HANDS[0] - 3, HANDS[1]], "up"),
  };
}

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: { ...STAND_SIDE, ...pose(HIP_TABLE, TORSO_TABLE, TORSO_TABLE + 8) },

  poses: {
    child: pose(HIP_CHILD, TORSO_CHILD, 108),
    breathe: pose(HIP_CHILD, TORSO_CHILD - 4, 104),
  },

  timeline: [
    { to: "child", s: 1.4, ease: "slow", say: "Cola a los talones" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá en la espalda" },
    { to: "child", s: 1.2, ease: "slow", say: "Respirá en la espalda" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá en la espalda" },
    { to: "child", s: 1.2, ease: "slow", say: "Respirá en la espalda" },
    { to: "start", s: 1.2, ease: "slow", say: "Volvé a cuatro apoyos" },
    { to: "start", s: 0.4 },
  ],
};
