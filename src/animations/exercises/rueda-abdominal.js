/*
 * Rueda abdominal hacia adelante (vuelta: abdomen estirado, paso 4)
 * Side view, facing right, kneeling with the shins flat on the floor and
 * both hands on an ab wheel under the shoulders. The wheel rolls forward
 * as the hips go down and forward until the body is long (back flat, not
 * sagging), then the abs pull it back. The knees are the fixed point.
 */
import { STAND_SIDE, angleBetween, arm, point } from "../engine/helpers.js";

const KNEE = [50, 141];
const WHEEL_R = 7;
const WHEEL_IN = [88, 148 - WHEEL_R];
const WHEEL_OUT = [142, 148 - WHEEL_R];

// Kneeling tall with the hips over the knees, then long and low.
const HIP_IN = point(KNEE, 30, 8);
const HIP_OUT = point(KNEE, 30, 62);
const TORSO_IN = 68;
const TORSO_OUT = 84;
const NECK_IN = point(HIP_IN, 32, TORSO_IN);
const NECK_OUT = point(HIP_OUT, 32, TORSO_OUT);

// Hands on the wheel's axle, far hand a hair behind so both show.
const hands = (neck, wheel) => ({
  ...arm("R", neck, wheel, "fwd"),
  ...arm("L", neck, [wheel[0] - 2, wheel[1]], "fwd"),
});

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: {
    ...STAND_SIDE,
    thighR: angleBetween(HIP_IN, KNEE),
    thighL: angleBetween(HIP_IN, KNEE),
    shinR: 270, // shins flat on the floor behind
    shinL: 270,
    footR: 270,
    footL: 270,
    torso: TORSO_IN,
    head: TORSO_IN + 8,
    ...hands(NECK_IN, WHEEL_IN),
  },

  poses: {
    out: {
      thighR: angleBetween(HIP_OUT, KNEE),
      thighL: angleBetween(HIP_OUT, KNEE),
      shinR: 270,
      shinL: 270,
      torso: TORSO_OUT,
      head: TORSO_OUT + 6,
      ...hands(NECK_OUT, WHEEL_OUT),
    },
  },

  timeline: [
    { to: "out", s: 1.3, ease: "slow", say: "Rodá adelante, abdomen apretado" },
    { to: "out", s: 0.3, say: "Espalda sin hundirse" },
    { to: "start", s: 1, say: "Volvé con el abdomen" },
    { to: "start", s: 0.4 },
  ],

  props: [
    {
      kind: "disc",
      c: WHEEL_IN,
      r: WHEEL_R,
      shift: { out: [WHEEL_OUT[0] - WHEEL_IN[0], 0] },
      layer: "mid",
    },
  ],
};
