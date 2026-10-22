/*
 * Cangrejo, posición base / Crab (Animal Flow)
 * Side view, face up with the head to the left: hands on the floor behind
 * (on the head side), feet flat in front, knees up. From sitting on the
 * floor, the hips lift a few centimeters and hover; hold, then sit back
 * down. Hands and feet stay planted; the hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { CRAB, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = shift(CRAB.hip, 0, 11); // sitting: hips near the floor

const crab = (hip, torso) =>
  quad({
    base: AT,
    hip,
    torso,
    head: torso + 20,
    handR: CRAB.hands,
    handL: shift(CRAB.hands, FAR),
    ankleR: CRAB.ankles,
    ankleL: shift(CRAB.ankles, FAR),
    footR: CRAB.foot,
    footL: CRAB.foot,
    knees: "up",
    elbows: "back",
  });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(crab(AT, 312)) },

  poses: {
    crab: crab(CRAB.hip, CRAB.torso),
  },

  timeline: [
    { to: "crab", s: 0.8, say: "Despegá la cadera" },
    { to: "crab", s: 2.4, say: "Sostené: hombros lejos de las orejas" },
    { to: "start", s: 0.8, say: "Sentate" },
    { to: "start", s: 0.4 },
  ],
};
