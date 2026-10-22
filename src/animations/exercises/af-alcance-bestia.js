/*
 * Alcance de bestia / Beast Reach (Animal Flow)
 * Side view, facing right. From the beast, the hips drive up and back like
 * a one-arm down dog while the near (lighter) arm reaches long forward in
 * line with the back; back to the beast, then the far (darker) arm.
 * The supporting hand and the toes stay planted; the hips set the place.
 */
import { STAND_SIDE, point } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;
const HANDS_R = BEAST.hands;
const HANDS_L = shift(BEAST.hands, FAR);

// Hips up and back, trunk pointing down toward the planted hand.
const REACH_HIP = [60, 96];
const REACH_TORSO = 118;
const REACH_NECK = point(REACH_HIP, 32, REACH_TORSO);
const REACH_HAND = point(REACH_NECK, 41, REACH_TORSO);

const pose = ({ hip, torso, handR, handL }) =>
  quad({
    base: AT,
    hip,
    torso,
    head: torso,
    handR,
    handL,
    ankleR: BEAST.ankles,
    ankleL: shift(BEAST.ankles, FAR),
    footR: BEAST.foot,
    footL: BEAST.foot,
  });

const BEAST_POSE = pose({ hip: AT, torso: BEAST.torso, handR: HANDS_R, handL: HANDS_L });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(BEAST_POSE) },

  poses: {
    nearReach: pose({ hip: REACH_HIP, torso: REACH_TORSO, handR: REACH_HAND, handL: HANDS_L }),
    farReach: pose({ hip: REACH_HIP, torso: REACH_TORSO, handR: HANDS_R, handL: shift(REACH_HAND, FAR) }),
  },

  timeline: [
    { to: "nearReach", s: 1, ease: "slow", say: "Cadera arriba, brazo adelante" },
    { to: "nearReach", s: 0.5 },
    { to: "start", s: 0.8, say: "Volvé a la bestia" },
    { to: "farReach", s: 1, ease: "slow", say: "Ahora el otro brazo" },
    { to: "farReach", s: 0.5 },
    { to: "start", s: 0.8, say: "Volvé a la bestia" },
  ],
};
