/*
 * Movilidad articular en posición de arquero
 * Side view, facing right, archer stance: near foot in front, far foot
 * long behind, both flat. The hips set the rhythm, rocking forward and
 * back over a medium, steady tempo with big ranges. Shows three moments
 * of the trainer's variants in one loop:
 *   1. hips forward over the front knee with the near arm overhead, then
 *      hips back (front leg long) with the hand reaching for the toes of
 *      the straightened leg (variant 1);
 *   2. hands on the floor beside the front foot, hips back into a ball
 *      (variant 3), then hips up and forward while the near arm rotates up
 *      to the ceiling.
 * The twist of variant 2 happens toward the camera and is left out. The
 * hips are the root and travel with $root; the legs reach to fixed ankle
 * points so the feet stay planted.
 */
import { STAND_SIDE, FEET_FLAT, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP = [76, 100];
const FRONT = [108, 144]; // near ankle
const BACK = [40, 144]; // far ankle

// Legs for a hip position: front knee forward, back knee toward the floor.
const legs = (hip) => ({
  ...leg("R", hip, FRONT, "fwd"),
  ...leg("L", hip, BACK, "fwd"),
  ...FEET_FLAT,
});
const at = (hip) => [hip[0] - HIP[0], hip[1] - HIP[1]];

// 1a. Hips forward and down over the front knee, torso upright.
const HIP_FWD = [86, 106];
const TORSO_FWD = 356;

// 1b. Hips back over the back leg, front leg long, chest over it.
const HIP_BACK = [64, 104];
const TORSO_BACK = 78;

// 2a. Ball: hands on the floor by the front foot, hips back, back rounded.
const HIP_BALL = [58, 114];
const TORSO_BALL = 82;
const HAND_FLOOR = [100, 143]; // far hand; the near one goes 3 units ahead

// 2b. Hips up and forward, one hand down, the other arm to the ceiling.
const HIP_OPEN = [74, 108];
const TORSO_OPEN = 84;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...legs(HIP),
    torso: 2,
    head: 2,
    // arms relaxed, hanging a touch forward (so the near arm rises in
    // front, not behind, on the way overhead)
    armR: 172,
    forearmR: 160,
    armL: 176,
    forearmL: 166,
  },

  poses: {
    fwd: {
      $root: at(HIP_FWD),
      ...legs(HIP_FWD),
      torso: TORSO_FWD,
      head: TORSO_FWD + 4,
      // near arm reaches overhead, far hand stays on the hip
      ...both("arm", 4),
      ...both("forearm", 2),
      ...arm("L", neckFrom(HIP_FWD, TORSO_FWD), [HIP_FWD[0] + 6, HIP_FWD[1] - 2], "back"),
    },
    back: {
      $root: at(HIP_BACK),
      ...legs(HIP_BACK),
      torso: TORSO_BACK,
      head: TORSO_BACK + 10,
      // near hand reaches for the toes of the long front leg
      ...arm("R", neckFrom(HIP_BACK, TORSO_BACK), [114, 134], "up"),
      armL: 172, // far arm hangs loose
      forearmL: 166,
    },
    ball: {
      $root: at(HIP_BALL),
      ...legs(HIP_BALL),
      torso: TORSO_BALL,
      head: TORSO_BALL + 60, // chin tucked: curled up
      ...arm("R", neckFrom(HIP_BALL, TORSO_BALL), [HAND_FLOOR[0] + 3, HAND_FLOOR[1]], "back"),
      ...arm("L", neckFrom(HIP_BALL, TORSO_BALL), HAND_FLOOR, "back"),
    },
    open: {
      $root: at(HIP_OPEN),
      ...legs(HIP_OPEN),
      torso: TORSO_OPEN,
      head: TORSO_OPEN - 40, // eyes follow the top hand
      // far hand stays on the floor, near arm rotates up to the ceiling
      ...arm("L", neckFrom(HIP_OPEN, TORSO_OPEN), HAND_FLOOR, "back"),
      armR: 356,
      forearmR: 356,
    },
  },

  timeline: [
    { to: "fwd", s: 0.9, say: "Cadera adelante, mano arriba" },
    { to: "back", s: 1.0, say: "Atrás, mano al pie" },
    { to: "ball", s: 1.0, say: "Manos al piso, hacete bolita" },
    { to: "open", s: 1.0, say: "Elevá cadera y rotá" },
    { to: "ball", s: 0.9, say: "Manos al piso, hacete bolita" },
    { to: "start", s: 1.0 },
  ],
};
