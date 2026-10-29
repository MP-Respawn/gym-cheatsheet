/*
 * Estiramiento de glúteo en 4
 * Side view, lying on the back with the head to the left; the hips are the
 * fixed point. From knees bent and feet on the floor, the near ankle
 * crosses onto the far knee (the "4"); then both hands reach behind the
 * far thigh and pull it toward the chest, the far foot leaves the floor
 * and the near leg rides along on top. Two slow breaths a little closer,
 * then the feet return to the floor. The other side is implied.
 * Simplification: the near knee really points at the camera, so from the
 * side its shin is drawn crossing over the far thigh at full length.
 */
import { STAND_SIDE, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [84, 140];
const TORSO = 272; // flat on the floor
const NECK = neckFrom(HIP, TORSO);

const FOOT_L = [112, 144]; // far foot on the floor in the start and the "4"
const FOOT_R = [116, 144];

const FAR_DOWN = { ...leg("L", HIP, FOOT_L, "up"), footL: 90 };
const ARMS_DOWN = { ...both("arm", 92), ...both("forearm", 90) };

// Near leg crossed: thigh up toward the chest, shin lying across the far
// thigh just above its knee, foot hanging.
const cross = (thigh, shin) => ({ thighR: thigh, shinR: shin, footR: 130 });

// Far thigh pulled in to `thighL`, shin pointing up, hands behind the knee.
function pull(thighL, shinL, thighR, shinR) {
  const knee = point(HIP, 30, thighL);
  const hold = [knee[0] - 3, knee[1] + 5];
  return {
    thighL,
    shinL,
    footL: shinL + 40, // toes relaxed
    ...cross(thighR, shinR),
    ...arm("R", NECK, hold, "down"),
    ...arm("L", NECK, [hold[0] - 2, hold[1] + 1], "down"),
  };
}

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 278,
    ...leg("R", HIP, FOOT_R, "up"),
    footR: 90,
    ...FAR_DOWN,
    ...ARMS_DOWN,
  },

  poses: {
    // the "4": near ankle on the far knee, far foot still on the floor
    four: { ...cross(340, 95), ...FAR_DOWN, ...ARMS_DOWN },
    stretch: pull(345, 35, 320, 85),
    breathe: pull(342, 32, 317, 82),
  },

  timeline: [
    { to: "four", s: 0.9, ease: "slow", say: "Tobillo sobre la rodilla, en 4" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Acercá el muslo al pecho" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "stretch", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "breathe", s: 1.2, ease: "slow", say: "Respirá y sostené" },
    { to: "start", s: 1, ease: "slow", say: "Pies al piso" },
    { to: "start", s: 0.3 },
  ],
};
