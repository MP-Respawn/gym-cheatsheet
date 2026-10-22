/*
 * Movilidad de muñeca / Wrist Mobilizations (Animal Flow)
 * Side view, facing right, on four supports with the knees on the floor
 * (the skeleton has no wrist joint, so the wrists show through the body):
 * the weight rocks forward until the shoulders pass the hands, back until
 * they sit behind them, and forward again. Hands and feet stay planted;
 * the hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = shift(BEAST.hip, 0, 5); // knees on the floor

const rock = (dx) =>
  quad({
    base: AT,
    hip: shift(AT, dx),
    torso: 80 - dx * 0.6,
    head: 74,
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

  start: { ...STAND_SIDE, ...asStart(rock(0)) },

  poses: {
    forward: rock(7),
    back: rock(-7),
  },

  timeline: [
    { to: "forward", s: 1, ease: "slow", say: "Peso adelante sobre las muñecas" },
    { to: "back", s: 1.4, ease: "slow", say: "Peso atrás" },
    { to: "forward", s: 1.4, ease: "slow", say: "Peso adelante sobre las muñecas" },
    { to: "start", s: 1, ease: "slow", say: "Peso atrás" },
  ],
};
