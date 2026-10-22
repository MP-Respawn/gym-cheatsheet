/*
 * Bestia, posición base / Beast (Animal Flow)
 * Side view, facing right. From four supports with the knees on the floor,
 * the knees lift two or three centimeters and hover: hands under the
 * shoulders, knees under the hips, on the toes, back long. Hold, then the
 * knees come down. Base pose from engine/poses.js; the hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = shift(BEAST.hip, 0, 5); // knees down: hips 5 lower

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

  start: { ...STAND_SIDE, ...asStart(beast(AT, 80)) },

  poses: {
    beast: beast(BEAST.hip, BEAST.torso),
  },

  timeline: [
    { to: "beast", s: 0.8, say: "Despegá las rodillas" },
    { to: "beast", s: 2.4, say: "Sostené: espalda larga" },
    { to: "start", s: 0.8, say: "Apoyá las rodillas" },
    { to: "start", s: 0.4 },
  ],
};
