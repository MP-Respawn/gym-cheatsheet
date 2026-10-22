/*
 * Cambio por debajo / Underswitch (Animal Flow)
 * Side view. From the beast (face down, head right), the far hand lifts,
 * the near leg threads forward under the body and the body turns over into
 * a crab (face up), still with the head to the right: hands planted on the
 * head side, feet behind, hips hovering. Hold a moment, then the same path
 * back to the beast. The turn happens toward the camera, so it shows as
 * the body passing through a low, sideways middle position. The hips set
 * the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;

const BEAST_POSE = quad({
  base: AT,
  hip: AT,
  torso: BEAST.torso,
  head: BEAST.torso - 4,
  handR: BEAST.hands,
  handL: shift(BEAST.hands, FAR),
  ankleR: BEAST.ankles,
  ankleL: shift(BEAST.ankles, FAR),
  footR: BEAST.foot,
  footL: BEAST.foot,
});

// Halfway: far hand up, near leg threading forward under the trunk.
const THREAD = quad({
  base: AT,
  hip: [64, 122],
  torso: 70,
  head: 80,
  handR: BEAST.hands,
  handL: [112, 118],
  ankleR: [96, 134],
  ankleL: shift(BEAST.ankles, FAR),
  footR: 90,
  footL: BEAST.foot,
  knees: "up", // hips low: knees bend up, off the floor
  elbowsL: "down",
});

// Crab facing the other way (head right): hands on the right, feet left.
const CRAB_HEAD_RIGHT = quad({
  base: AT,
  hip: [60, 128],
  torso: 53,
  head: 33,
  handR: [96, 144],
  handL: [93, 144],
  ankleR: [24, 144],
  ankleL: [21, 144],
  footR: 270,
  footL: 270,
  knees: "up",
  elbows: "fwd",
});

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(BEAST_POSE) },

  poses: {
    thread: THREAD,
    crab: CRAB_HEAD_RIGHT,
  },

  timeline: [
    { to: "thread", s: 0.7, say: "Mano arriba, pierna por debajo" },
    { to: "crab", s: 0.6, say: "Girá a cangrejo" },
    { to: "crab", s: 0.6, say: "Cadera despegada" },
    { to: "thread", s: 0.6, say: "Volvé por el mismo camino" },
    { to: "start", s: 0.7, say: "Volvé por el mismo camino" },
    { to: "start", s: 0.5 },
  ],
};
