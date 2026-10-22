/*
 * Rolo adelante / Forward shoulder roll (Jiu Jitsu)
 * Side view, facing right. Simplified on purpose: the body tucks into a
 * ball (chin to chest, knees in, arms around the shins) that rolls one
 * full turn forward along the floor and lands crouched, then rolls back to
 * where it started so the loop closes in place (engine/poses.js
 * rollAcross). The diagonal from shoulder to the opposite hip happens
 * toward the camera and is not drawn.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { rollAcross } from "../engine/poses.js";

// Tucked: back rounded forward, chin in, knees to the chest, arms hugging the shins.
const TUCK = {
  ...STAND_SIDE,
  torso: 36,
  head: 104,
  thighR: 30,
  thighL: 36,
  shinR: 190,
  shinL: 194,
  footR: 120,
  footL: 124,
  armR: 140,
  forearmR: 206,
  armL: 144,
  forearmL: 210,
};

export default {
  view: "side",
  ...rollAcross({
    tuck: TUCK,
    direction: 1,
    say: { go: "Rolá adelante por el hombro", land: "Terminá agachado, listo", back: "Y rodá de vuelta" },
  }),
};
