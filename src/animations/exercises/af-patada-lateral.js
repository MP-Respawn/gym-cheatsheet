/*
 * Patada lateral / Side Kickthrough (Animal Flow)
 * Side view, facing right. From the beast, the near (lighter) hand lifts
 * and the near leg kicks straight through under the body and out to the
 * front, hips low but off the floor, chest turning open (shown as the
 * trunk rising). Back to the beast; the far hand and foot stay planted.
 * The hips set the place.
 */
import { STAND_SIDE, point } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;
const KICK_HIP = [64, 122];
const KICK_TORSO = 60;
const KICK_NECK = point(KICK_HIP, 32, KICK_TORSO);

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

const KICK = quad({
  base: AT,
  hip: KICK_HIP,
  torso: KICK_TORSO,
  head: 50,
  handR: point(KICK_NECK, 40, 350), // near hand up
  handL: shift(BEAST.hands, FAR), // far hand planted
  ankleR: [126, 120], // near leg kicked out straight
  ankleL: shift(BEAST.ankles, FAR),
  footR: 60,
  footL: BEAST.foot,
  kneesL: "up", // hips low: the planted leg's knee bends up
  elbows: "fwd",
});

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(BEAST_POSE) },

  poses: { kick: KICK },

  timeline: [
    { to: "kick", s: 0.7, ease: "fast", say: "Mano arriba, pateá por debajo" },
    { to: "kick", s: 0.6, say: "Pierna estirada, cadera baja" },
    { to: "start", s: 0.8, say: "Volvé a la bestia" },
    { to: "start", s: 0.5 },
  ],
};
