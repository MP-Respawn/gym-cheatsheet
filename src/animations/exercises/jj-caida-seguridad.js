/*
 * Caída de seguridad / Breakfall (Jiu Jitsu)
 * Side view, facing right. From a low squat the body sits back and rolls
 * onto the rounded back, chin tucked and legs swinging up, while both arms
 * slap the floor at about 45 degrees from the body; then it rocks forward
 * to sitting and back up to the squat. The hips set the place.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const AT = [72, 126]; // squatting
const off = (hip) => [hip[0] - AT[0], hip[1] - AT[1]];
const FEET = [90, 144];

const SQUAT = {
  torso: 30,
  head: 40,
  ...leg("R", AT, FEET, "fwd"),
  ...leg("L", AT, [FEET[0] - 3, FEET[1]], "fwd"),
  ...both("foot", 90),
  ...both("arm", 70), // arms forward for balance
  ...both("forearm", 70),
};

const HIP_SIT = [68, 140];
const SIT = {
  $root: off(HIP_SIT),
  torso: 340,
  head: 10,
  ...leg("R", HIP_SIT, [92, 144], "up"),
  ...leg("L", HIP_SIT, [89, 144], "up"),
  ...both("foot", 90),
  ...both("arm", 60),
  ...both("forearm", 60),
};

// Rolled back on the rounded back: chin in, legs up, arms slapping the floor.
const HIP_BACK = [80, 134];
const TORSO_BACK = 285;
const NECK_BACK = neckFrom(HIP_BACK, TORSO_BACK);
const SLAP = {
  $root: off(HIP_BACK),
  torso: TORSO_BACK,
  head: 320, // chin to the chest
  ...arm("R", NECK_BACK, [16, 144], "up"),
  ...arm("L", NECK_BACK, [19, 144], "up"),
  thighR: 338,
  shinR: 20,
  thighL: 342,
  shinL: 24,
  ...both("foot", 60),
};

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...SQUAT },

  poses: { sit: SIT, slap: SLAP },

  timeline: [
    { to: "sit", s: 0.4, say: "Sentate atrás" },
    { to: "slap", s: 0.35, ease: "fast", say: "Rodá en la espalda y golpeá con los brazos" },
    { to: "slap", s: 0.3, say: "Mentón al pecho" },
    { to: "sit", s: 0.5, say: "Volvé adelante" },
    { to: "start", s: 0.5, say: "Volvé adelante" },
    { to: "start", s: 0.4 },
  ],
};
