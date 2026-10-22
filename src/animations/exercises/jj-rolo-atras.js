/*
 * Rolo atrás / Backward shoulder roll (Jiu Jitsu)
 * Side view, facing right, starting near the right edge. Simplified on
 * purpose: the body tucks into a ball (head turned to one side, knees in,
 * arms around the shins) that rolls one full turn backward, traveling
 * left over the shoulders, and lands on the knees; then it rolls forward
 * back to where it started so the loop closes in place (engine/poses.js
 * rollAcross). The head turning aside happens toward the camera.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { rollAcross } from "../engine/poses.js";

// Tucked for rolling back: seat low, back rounded, knees in, chin in.
const TUCK = {
  ...STAND_SIDE,
  torso: 24,
  head: 96,
  thighR: 34,
  thighL: 40,
  shinR: 196,
  shinL: 200,
  footR: 130,
  footL: 134,
  armR: 130,
  forearmR: 200,
  armL: 134,
  forearmL: 204,
};

export default {
  view: "side",
  ...rollAcross({
    tuck: TUCK,
    direction: -1,
    say: { go: "Rolá atrás por el hombro", land: "Terminá en rodillas", back: "Y rodá de vuelta adelante" },
  }),
};
