/*
 * Paso de rodilla / Knee cut, solo (Jiu Jitsu)
 * Side view, facing right. From a low staggered stance with the hands in
 * front, the near (lighter) knee drives forward and down until it slides
 * on the floor, shin flat behind it, while the far leg extends long behind
 * on the toes, hips low and chest forward; then back to the stance. The
 * hips set the place.
 */
import { STAND_SIDE, angleBetween } from "../engine/helpers.js";
import { asStart, quad } from "../engine/poses.js";

const AT = [72, 104]; // low stance

const STANCE = quad({
  base: AT,
  hip: AT,
  torso: 20,
  head: 20,
  handR: [100, 100],
  handL: [96, 102],
  ankleR: [100, 144],
  ankleL: [44, 144],
  footR: 90,
  footL: 70,
  knees: "fwd",
  elbows: "down",
});

// Knee on the floor ahead, far leg long behind, chest forward.
const HIP_CUT = [84, 113.6];
const KNEE = [96, 141];
const CUT = {
  ...quad({
    base: AT,
    hip: HIP_CUT,
    torso: 50,
    head: 60,
    handR: [118, 128], // near hand forward, toward the floor
    handL: [112, 120],
    ankleR: [66, 141], // overridden below: knee down, shin flat
    ankleL: [30, 138],
    footR: 270,
    footL: 250,
    knees: "fwd",
    kneesL: "up",
    elbows: "down",
  }),
  thighR: angleBetween(HIP_CUT, KNEE),
  shinR: 270, // shin flat on the floor behind the knee
  footR: 270,
};

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(STANCE) },

  poses: { cut: CUT },

  timeline: [
    { to: "cut", s: 0.6, say: "Rodilla adelante, deslizando por el piso" },
    { to: "cut", s: 0.5, say: "Cadera baja, pecho adelante" },
    { to: "start", s: 0.7, say: "Volvé a la guardia" },
    { to: "start", s: 0.4 },
  ],
};
