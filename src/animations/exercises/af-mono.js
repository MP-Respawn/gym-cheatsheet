/*
 * Mono, posición base / Ape (Animal Flow)
 * Side view, facing right, feet flat. From standing with the arms down,
 * the body sinks into a deep squat with the heels down and the hands on
 * the floor in front of the feet, chest up; hold, then stand back up. The
 * feet stay planted; the hips set the place.
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";
import { APE, FAR, quad, shift } from "../engine/poses.js";

const AT = [71, 84.5]; // standing hips

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: {
    ...STAND_SIDE,
    ...leg("R", AT, APE.ankles, "fwd"),
    ...leg("L", AT, shift(APE.ankles, FAR), "fwd"),
    ...both("foot", 90),
  },

  poses: {
    ape: quad({
      base: AT,
      hip: APE.hip,
      torso: APE.torso,
      head: APE.torso - 20,
      handR: APE.hands,
      handL: shift(APE.hands, FAR),
      ankleR: APE.ankles,
      ankleL: shift(APE.ankles, FAR),
      footR: APE.foot,
      footL: APE.foot,
      knees: "fwd",
    }),
  },

  timeline: [
    { to: "ape", s: 1.2, ease: "slow", say: "Bajá a la sentadilla, manos al piso" },
    { to: "ape", s: 2.2, say: "Sostené: talones abajo, pecho alto" },
    { to: "start", s: 1.1, ease: "slow", say: "Subí" },
    { to: "start", s: 0.4 },
  ],
};
