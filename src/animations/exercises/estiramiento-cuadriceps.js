/*
 * Estiramiento de cuádriceps de pie
 * Side view, facing right, standing on the near leg (its ankle is the
 * fixed point). The far leg folds back: the knee stays beside the standing
 * knee and the heel comes up to the glute, where the far hand holds the
 * foot; the near arm reaches forward as if on a wall, for balance. Torso
 * upright. Hold with two slow breaths (the heel a hair closer, the hips a
 * touch forward), then the foot comes back down. The other side is implied.
 */
import { STAND_SIDE, arm, neckFrom, point } from "../engine/helpers.js";

const ANKLE = [78, 144];
const HIP = [78, 84]; // standing leg straight, so the hip does not move

// Folded far leg: thigh pointing down, knee beside the other knee.
const THIGH_FOLD = 188;
const KNEE_FOLD = point(HIP, 30, THIGH_FOLD);

// Held stretch at a given shin angle (pointing up and back) and torso tilt.
function hold(shin, torso) {
  const ankle = point(KNEE_FOLD, 30, shin);
  const neck = neckFrom(HIP, torso);
  return {
    torso,
    head: torso,
    thighL: THIGH_FOLD,
    shinL: shin,
    footL: shin - 25, // toes relaxed, pointing back
    // far hand holds the foot at the instep
    ...arm("L", neck, [ankle[0] + 1, ankle[1] + 4], "back"),
    // near arm out in front for balance (a wall, if there is one)
    armR: 80,
    forearmR: 80,
  };
}

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    // far leg a hair behind so both legs show
    thighL: 182,
    shinL: 178,
    footL: 90,
  },

  poses: {
    stretch: hold(345, 0),
    // heel a little closer and the hips pushed forward
    breathe: hold(347, 358),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Talón a la cola, rodillas juntas" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Cadera adelante" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],
};
