/*
 * Balanzas a una pierna
 * Side view, facing right, no weights. Standing on the near leg with a
 * soft knee; the torso tips forward like a scale while the far leg rises
 * straight behind and the arms reach forward in line with the torso,
 * until the body is a "T". Slow way down (~1.2 s), short hold with the
 * hips level (~0.4 s), back up (~1.0 s) with a straight back.
 * The stance ankle is the fixed point and its foot stays flat.
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

const ANKLE = [72, 144];
const HIP_T = [66, 88]; // hips go back a little to stay over the foot
const TORSO_T = 84; // torso almost level

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    ...leg("R", [72, 85], ANKLE, "fwd"), // soft knee
    footR: 90,
    // far foot just off the floor, behind
    thighL: 192,
    shinL: 225,
    footL: 115,
    // arms hanging a touch forward
    armR: 172,
    forearmR: 165,
    armL: 178,
    forearmL: 172,
  },

  poses: {
    // the "T": torso, arms and back leg in one long line
    t: {
      torso: TORSO_T,
      head: TORSO_T - 4,
      ...leg("R", HIP_T, ANKLE, "fwd"),
      footR: 90,
      armR: TORSO_T + 2,
      forearmR: TORSO_T + 2,
      armL: TORSO_T + 6,
      forearmL: TORSO_T + 6,
      thighL: TORSO_T + 180,
      shinL: TORSO_T + 180,
      footL: TORSO_T + 92, // toes pointing at the floor
    },
  },

  timeline: [
    { to: "t", s: 1.2, ease: "slow", say: "Inclinate como una balanza" },
    { to: "t", s: 0.4, say: "Cadera nivelada" },
    { to: "start", s: 1.0, say: "Espalda recta" },
    { to: "start", s: 0.4 },
  ],
};
