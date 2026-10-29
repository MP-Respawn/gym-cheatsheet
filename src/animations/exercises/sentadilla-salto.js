/*
 * Sentadilla con salto
 * Side view, facing right, no load. A deep squat with the arms swung back
 * behind the hips, an explosive jump (toe-off, then the body fully extended
 * in the air with the toes pointed and the arms swung forward and up), a
 * soft landing into a shallow squat with the arms forward, and back to
 * standing.
 * Cues shown: deep squat, jump with everything, soft landing absorbing
 * with the knees, chest up.
 *
 * The near ankle is the root (as in the goblet squat, so the planted feet
 * never slide); in the toe-off and in the air it is moved with $root. The
 * toe-off pose is a pass-through: without it the foot dipped under the
 * floor while the leg unfolded, and the arms swung back over the head
 * instead of forward.
 */
import { STAND_SIDE, ankleFor, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP = [80, 84]; // standing hip
const NEAR_ANKLE = [80, 144]; // the root
const FAR_ANKLE = [76, 144];
const NEAR_TOE = [92, 144];
const FAR_TOE = [88, 144];

// Deep bottom: hips under knee height, shins well forward, chest tall.
const HIP_LOW = [67, 122];
const TORSO_LOW = 18;
const NECK_LOW = neckFrom(HIP_LOW, TORSO_LOW);

// Toe-off: tall on the balls of the feet, heels up, arms swinging forward.
const FOOT_PUSH = 135;
const NEAR_ANKLE_PUSH = ankleFor(NEAR_TOE, FOOT_PUSH);
const FAR_ANKLE_PUSH = ankleFor(FAR_TOE, FOOT_PUSH);
const HIP_PUSH = [86, 76];

// In the air: body straight, feet about 22 units off the floor.
const HIP_AIR = [86, 62];
const NEAR_ANKLE_AIR = [HIP_AIR[0], HIP_AIR[1] + 60]; // legs straight down

// Landing: a shallow squat, hips back, arms forward for balance.
const HIP_LAND = [74, 106];
const TORSO_LAND = 15;

const off = (p) => [p[0] - NEAR_ANKLE[0], p[1] - NEAR_ANKLE[1]];

export default {
  view: "side",
  root: "ankleR",
  at: NEAR_ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("L", HIP, FAR_ANKLE),
    // arms hanging a little forward
    ...both("arm", 170),
    ...both("forearm", 165),
  },

  poses: {
    // deep squat, arms swung back behind the hips
    bottom: {
      ...leg("R", HIP_LOW, NEAR_ANKLE),
      ...leg("L", HIP_LOW, FAR_ANKLE),
      ...both("foot", 90),
      torso: TORSO_LOW,
      head: 5, // eyes forward, chest up
      ...arm("R", NECK_LOW, [NECK_LOW[0] - 16, NECK_LOW[1] + 22], "back"),
      ...arm("L", NECK_LOW, [NECK_LOW[0] - 18, NECK_LOW[1] + 22], "back"),
    },
    // toe-off: legs long, heels up, toes still on the floor
    push: {
      $root: off(NEAR_ANKLE_PUSH),
      ...leg("R", HIP_PUSH, NEAR_ANKLE_PUSH),
      ...leg("L", HIP_PUSH, FAR_ANKLE_PUSH),
      ...both("foot", FOOT_PUSH),
      torso: 0,
      head: 0,
      ...both("arm", 150),
      ...both("forearm", 140),
    },
    // in the air: everything extended, toes pointed, arms swung forward-up
    air: {
      $root: off(NEAR_ANKLE_AIR),
      ...both("thigh", 180),
      ...both("shin", 180),
      ...both("foot", 160),
      torso: 0,
      head: 0,
      ...both("arm", 70),
      ...both("forearm", 60),
    },
    // landing: shallow squat, feet planted, arms forward
    land: {
      ...leg("R", HIP_LAND, NEAR_ANKLE),
      ...leg("L", HIP_LAND, FAR_ANKLE),
      ...both("foot", 90),
      torso: TORSO_LAND,
      head: 5,
      ...both("arm", 105),
      ...both("forearm", 100),
    },
  },

  timeline: [
    { to: "bottom", s: 0.7, say: "Bajá a la sentadilla" },
    { to: "push", s: 0.2, ease: "fast", say: "Saltá con todo" },
    { to: "air", s: 0.15, ease: "fast", say: "Saltá con todo" },
    { to: "air", s: 0.15 },
    { to: "land", s: 0.4, ease: "in", say: "Amortiguá con las rodillas" },
    { to: "start", s: 0.6, ease: "slow" },
    { to: "start", s: 0.3, say: "Pecho arriba" },
  ],
};
