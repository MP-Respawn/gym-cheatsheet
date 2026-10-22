/*
 * Alcance de mono / Ape Reach (Animal Flow)
 * Side view, facing right. From the ape (deep squat, heels down, hands on
 * the floor in front), the near (lighter) hand lifts and reaches up and
 * forward as the chest turns open; back to the floor, then the far
 * (darker) hand. The feet and the supporting hand stay planted; the hips
 * set the place.
 */
import { STAND_SIDE, point } from "../engine/helpers.js";
import { APE, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = APE.hip;
const NECK = point(AT, 32, APE.torso);
const UP_HAND = point(NECK, 41, 18); // reaching up and a little forward

const pose = (handR, handL, head) =>
  quad({
    base: AT,
    hip: AT,
    torso: APE.torso,
    head,
    handR,
    handL,
    ankleR: APE.ankles,
    ankleL: shift(APE.ankles, FAR),
    footR: APE.foot,
    footL: APE.foot,
    knees: "fwd",
  });

const HANDS_R = APE.hands;
const HANDS_L = shift(APE.hands, FAR);

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(pose(HANDS_R, HANDS_L, APE.torso - 20)) },

  poses: {
    nearUp: pose(UP_HAND, HANDS_L, 10),
    farUp: pose(HANDS_R, shift(UP_HAND, FAR), 10),
  },

  timeline: [
    { to: "nearUp", s: 0.9, ease: "slow", say: "Mano arriba, girá el pecho" },
    { to: "nearUp", s: 0.4 },
    { to: "start", s: 0.8, say: "Mano al piso" },
    { to: "farUp", s: 0.9, ease: "slow", say: "Ahora la otra mano" },
    { to: "farUp", s: 0.4 },
    { to: "start", s: 0.8, say: "Mano al piso" },
  ],
};
