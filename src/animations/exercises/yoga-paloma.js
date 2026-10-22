/*
 * Paloma, preparación / Eka Pada Rajakapotasana (yoga)
 * Side view, facing right, seated on the floor: the near (front) leg is
 * folded in front with the shin across the body (pointing at the camera,
 * so it looks short), the far (back) leg long behind with the top of the
 * foot down. From sitting tall with the hands beside the hips, the torso
 * folds forward over the front leg with the arms long in front; hold,
 * then back up. The hips are the fixed point.
 */
import { STAND_SIDE, arm, neckFrom } from "../engine/helpers.js";

const HIP = [70, 134];
const TORSO_FOLD = 78;

export default {
  view: "side",
  root: "hip",
  at: HIP,
  // front shin across the body and short feet: they point at the camera
  lengths: { shinR: 16, footL: 5, footR: 5 },

  start: {
    ...STAND_SIDE,
    torso: 0,
    head: 2,
    // front leg folded: thigh forward along the floor, shin back across
    thighR: 98,
    shinR: 250,
    footR: 250,
    // back leg long behind
    thighL: 268,
    shinL: 270,
    footL: 250,
    // hands on the floor beside the hips
    ...arm("R", neckFrom(HIP, 0), [86, 141], "back"),
    ...arm("L", neckFrom(HIP, 0), [84, 141], "back"),
  },

  poses: {
    fold: {
      torso: TORSO_FOLD,
      head: TORSO_FOLD + 10,
      ...arm("R", neckFrom(HIP, TORSO_FOLD), [140, 141], "up"),
      ...arm("L", neckFrom(HIP, TORSO_FOLD), [137, 141], "up"),
    },
  },

  timeline: [
    { to: "start", s: 1.2, say: "Primero alto, cadera nivelada" },
    { to: "fold", s: 1.6, ease: "slow", say: "Inclinate sobre la pierna de adelante" },
    { to: "fold", s: 2.2, say: "Respirá en el glúteo" },
    { to: "start", s: 1.4, ease: "slow", say: "Volvé arriba" },
  ],
};
