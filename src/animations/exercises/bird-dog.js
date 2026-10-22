/*
 * Superman en equilibrio / bird dog (vuelta: abdomen isométrico, paso 6)
 * Side view, facing right, on hands and knees: hands under the shoulders,
 * knees under the hips, back flat. One arm reaches forward and the
 * opposite leg reaches back, both in line with the back, and hold the
 * balance; back to four supports, then the other pair. Near (lighter)
 * arm with the far (darker) leg first. The hips are the fixed point.
 */
import { STAND_SIDE, angleBetween, both, point } from "../engine/helpers.js";

const HIP = [66, 111];
const TORSO = 70; // back nearly flat, shoulders a little higher than the hips
const NECK = point(HIP, 32, TORSO);

// Four supports: arms straight down to the floor, thighs straight down,
// shins flat on the floor behind.
const HAND = [NECK[0], 141];
const ARM_DOWN = angleBetween(NECK, HAND);

const REACH_ARM = 82; // arm forward, about in line with the back
const REACH_LEG = 266; // leg back, in line with the back

export default {
  view: "side",
  root: "hip",
  at: HIP,
  lengths: { footL: 8, footR: 8 },

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO + 8,
    ...both("arm", ARM_DOWN),
    ...both("forearm", ARM_DOWN),
    ...both("thigh", 180),
    ...both("shin", 270),
    ...both("foot", 270),
  },

  poses: {
    // near arm forward, far leg back
    pairA: {
      ...both("arm", ARM_DOWN),
      ...both("forearm", ARM_DOWN),
      armR: REACH_ARM,
      forearmR: REACH_ARM,
      thighL: REACH_LEG,
      shinL: REACH_LEG,
      footL: 200,
    },
    // far arm forward, near leg back
    pairB: {
      ...both("arm", ARM_DOWN),
      ...both("forearm", ARM_DOWN),
      armL: REACH_ARM,
      forearmL: REACH_ARM,
      thighR: REACH_LEG,
      shinR: REACH_LEG,
      footR: 200,
    },
  },

  timeline: [
    { to: "pairA", s: 0.9, say: "Brazo y pierna contrarios" },
    { to: "pairA", s: 1.6, say: "Sostené el equilibrio" },
    { to: "start", s: 0.7, say: "Volvé a cuatro apoyos" },
    { to: "pairB", s: 0.9, say: "Ahora el otro par" },
    { to: "pairB", s: 1.6, say: "Sostené el equilibrio" },
    { to: "start", s: 0.7, say: "Volvé a cuatro apoyos" },
    { to: "start", s: 0.3 },
  ],
};
