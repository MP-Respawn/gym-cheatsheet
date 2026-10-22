/*
 * Parada técnica / Technical stand-up (Jiu Jitsu)
 * Side view, facing right. Sitting with the far (darker) hand posted on
 * the floor behind, the near foot planted and the near hand up in front
 * guarding. The hips lift off the floor on that hand and foot, the far leg
 * swings back underneath, the body comes up into a kneeling lunge and then
 * stands in guard. Then it sits back down the same way. The hips set the
 * place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { asStart, quad } from "../engine/poses.js";

const AT = [70, 140]; // sitting
const POST = [46, 144]; // far hand on the floor behind
const FRONT_FOOT = [96, 144];

const SIT = quad({
  base: AT,
  hip: AT,
  torso: 340,
  head: 350,
  handR: [84, 108], // near hand up, guarding the face
  handL: POST,
  ankleR: FRONT_FOOT,
  ankleL: [72, 138], // far leg folded flat on the floor
  footR: 90,
  footL: 260,
  knees: "up",
  elbows: "down",
  elbowsL: "back",
});

// Hips up on the posted hand and the front foot; the far leg swings under.
const LIFT = quad({
  base: AT,
  hip: [74, 120],
  torso: 300,
  head: 320,
  handR: [80, 96],
  handL: POST,
  ankleR: FRONT_FOOT,
  ankleL: [48, 136],
  footR: 90,
  footL: 240,
  knees: "up",
  kneesL: "up",
  elbows: "down",
  elbowsL: "back",
});

// Kneeling lunge: far knee down behind, hands up guarding.
const LUNGE = quad({
  base: AT,
  hip: [80, 108],
  torso: 10,
  head: 10,
  handR: [96, 90],
  handL: [92, 92],
  ankleR: [100, 144],
  ankleL: [44, 137],
  footR: 90,
  footL: 225,
  knees: "fwd",
  kneesL: "down",
  elbows: "down",
});

// Standing in guard, feet staggered.
const STAND = quad({
  base: AT,
  hip: [80, 88],
  torso: 6,
  head: 6,
  handR: [96, 66],
  handL: [92, 68],
  ankleR: [100, 144],
  ankleL: [59, 144],
  footR: 90,
  footL: 70,
  knees: "fwd",
  elbows: "down",
});

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(SIT) },

  poses: { lift: LIFT, lunge: LUNGE, stand: STAND },

  timeline: [
    { to: "lift", s: 0.5, say: "Mano atrás y pie adelante: cadera arriba" },
    { to: "lunge", s: 0.5, say: "Pasá la pierna por debajo, hacia atrás" },
    { to: "stand", s: 0.5, say: "Parate en guardia" },
    { to: "stand", s: 0.5, say: "Parate en guardia" },
    { to: "lunge", s: 0.5, say: "Volvé a sentarte" },
    { to: "lift", s: 0.5, say: "Volvé a sentarte" },
    { to: "start", s: 0.5, say: "Volvé a sentarte" },
    { to: "start", s: 0.4 },
  ],
};
