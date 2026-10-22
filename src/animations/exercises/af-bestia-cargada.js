/*
 * Bestia cargada / Loaded Beast (Animal Flow)
 * Side view, facing right. From the beast (knees hovering), the hips shift
 * back toward the heels while the knees stay off the floor and the arms
 * lengthen; hold the loaded position, then back to the beast. Hands and
 * toes stay planted; the hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;

const beast = (hip, torso) =>
  quad({
    base: AT,
    hip,
    torso,
    head: torso - 4,
    handR: BEAST.hands,
    handL: shift(BEAST.hands, FAR),
    ankleR: BEAST.ankles,
    ankleL: shift(BEAST.ankles, FAR),
    footR: BEAST.foot,
    footL: BEAST.foot,
  });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(beast(AT, BEAST.torso)) },

  poses: {
    loaded: beast([52, 113], 80),
  },

  timeline: [
    { to: "start", s: 0.6, say: "Bestia" },
    { to: "loaded", s: 1, ease: "slow", say: "Cadera atrás, rodillas despegadas" },
    { to: "loaded", s: 1.6, say: "Sostené" },
    { to: "start", s: 0.9, say: "Volvé a la bestia" },
  ],
};
