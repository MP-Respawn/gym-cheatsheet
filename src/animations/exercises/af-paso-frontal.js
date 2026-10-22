/*
 * Paso frontal / Front Step (Animal Flow)
 * Side view, facing right. From the beast, the near (lighter) foot steps
 * forward to land flat beside the near hand, hips low, chest forward:
 * the transition from beast toward ape. Back to the beast. Hands and the
 * far foot stay planted; the hips set the place.
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

const STEP = quad({
  base: AT,
  hip: [70, 110],
  torso: 80,
  head: 70,
  handR: BEAST.hands,
  handL: shift(BEAST.hands, FAR),
  ankleR: [90, 144], // near foot flat beside the hand
  ankleL: shift(BEAST.ankles, FAR),
  footR: 90,
  footL: BEAST.foot,
  knees: "fwd",
  kneesL: "down",
});

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(BEAST_POSE) },

  poses: { step: STEP },

  timeline: [
    { to: "step", s: 0.8, say: "Pie al lado de la mano" },
    { to: "step", s: 0.8, say: "Pecho adelante, cadera baja" },
    { to: "start", s: 0.8, say: "Volvé a la bestia" },
    { to: "start", s: 0.5 },
  ],
};
