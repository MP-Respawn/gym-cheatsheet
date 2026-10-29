/*
 * Estiramiento de isquiotibiales con el pie en un banco
 * Side view, facing right. The near heel rests on a low step in front,
 * leg straight and toes pulled up; the far leg stands (its ankle is the
 * fixed point). From upright, the torso hinges forward from the hips with
 * a flat back and the hands slide down the front thigh to the knee. Two
 * slow breaths there (a few degrees deeper), then back up. The standing
 * knee bends a hair as the hips settle. The other side is implied.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [70, 144]; // standing (far) foot, the fixed point
const HEEL = [118, 118]; // near heel on the step, leg almost straight
const STEP = { x: 104, y: 122, w: 40, h: 22 };

const HIP_UP = [70, 84];
const HIP_FOLD = [68, 86];
const FOOT_UP = 10; // toes pulled up toward the shin

function pose(hip, torso, head, handR, handL) {
  const neck = neckFrom(hip, torso);
  return {
    torso,
    head,
    ...leg("L", hip, ANKLE, "fwd"),
    footL: 90,
    ...leg("R", hip, HEEL, "fwd"),
    footR: FOOT_UP,
    ...arm("R", neck, handR, "back"),
    ...arm("L", neck, handL, "back"),
  };
}

export default {
  view: "side",
  root: "ankleL",
  at: ANKLE,

  // upright, hands on the hips
  start: { ...STAND_SIDE, ...pose(HIP_UP, 0, 0, [77, 87], [75, 88]) },

  poses: {
    // hinged forward, hands down at the knee
    stretch: pose(HIP_FOLD, 55, 48, [95, 104], [93, 106]),
    breathe: pose(HIP_FOLD, 60, 52, [95, 104], [93, 106]),
  },

  timeline: [
    { to: "stretch", s: 1.2, ease: "slow", say: "Espalda recta, inclinate desde la cadera" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Punta del pie hacia vos" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the low step under the front heel
    { kind: "rect", x: STEP.x, y: STEP.y, w: STEP.w, h: STEP.h, fill: true },
  ],
};
