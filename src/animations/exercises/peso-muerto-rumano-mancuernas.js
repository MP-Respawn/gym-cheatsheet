/*
 * Peso muerto rumano con mancuernas
 * Side view, facing right, a dumbbell in each hand. The near ankle is the
 * fixed point and the feet stay flat the whole time. Soft knees that barely
 * change; the hips go back ("cola atrás") and the straight back tips
 * forward while the dumbbells slide down along the legs to the shins. Short
 * stretch hold, then up. Unlike peso-muerto: dumbbells instead of a bar,
 * no floor touch, torso not flat, no rise onto the toes.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [84, 144];
const ANKLE_FAR = [80, 144];

const HIP_UP = [83, 86]; // standing tall, knees just unlocked
const HIP_LOW = [64, 90]; // hips pushed back
const TORSO_LOW = 76; // back straight, a bit above flat

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP_UP, ANKLE),
    ...leg("L", HIP_UP, ANKLE_FAR),
    torso: 2,
    head: 2,
    // dumbbells against the front of the thighs
    ...arm("R", neckFrom(HIP_UP, 2), [88, 94], "back"),
    ...arm("L", neckFrom(HIP_UP, 2), [86, 94], "back"),
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, ANKLE),
      ...leg("L", HIP_LOW, ANKLE_FAR),
      ...both("foot", 90), // feet flat
      torso: TORSO_LOW,
      head: TORSO_LOW - 6,
      // arms hang straight down: dumbbells next to the shins
      ...arm("R", neckFrom(HIP_LOW, TORSO_LOW), [90, 125], "back"),
      ...arm("L", neckFrom(HIP_LOW, TORSO_LOW), [88, 125], "back"),
    },
  },

  timeline: [
    { to: "bottom", s: 1.6, ease: "slow", say: "Cola atrás" },
    { to: "bottom", s: 0.5, say: "Sentí el isquio" },
    { to: "start", s: 1.1, say: "Subí" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // one small dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
