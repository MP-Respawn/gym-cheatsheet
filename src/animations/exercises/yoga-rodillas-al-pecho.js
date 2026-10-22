/*
 * Rodillas al pecho / Apanasana (yoga)
 * Side view, lying on the back with the head to the left. From knees bent
 * and feet on the floor, both knees come up to the chest and the arms
 * hug the shins; a gentle rock (knees a little closer, a little away),
 * then the feet return to the floor. The hips are the fixed point.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP = [84, 140];
const TORSO = 272; // flat on the floor
const NECK = neckFrom(HIP, TORSO);

// Knees to the chest at thigh angle T; hands on the shins below the knees.
const hug = (t) => ({
  thighR: t,
  thighL: t + 4,
  shinR: 110,
  shinL: 114,
  ...both("foot", 40),
  ...arm("R", NECK, [74, 114 - (t - 330) * 0.5], "down"),
  ...arm("L", NECK, [72, 115 - (t - 330) * 0.5], "down"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 278,
    ...leg("R", HIP, [112, 144], "up"),
    ...leg("L", HIP, [108, 144], "up"),
    ...both("foot", 90),
    ...both("arm", 92),
    ...both("forearm", 90),
  },

  poses: {
    hug: hug(330),
    closer: hug(322),
  },

  timeline: [
    { to: "hug", s: 1.2, ease: "slow", say: "Abrazá las rodillas" },
    { to: "closer", s: 1, ease: "slow", say: "Balanceate suave" },
    { to: "hug", s: 1, ease: "slow", say: "Balanceate suave" },
    { to: "closer", s: 1, ease: "slow", say: "Balanceate suave" },
    { to: "hug", s: 1, ease: "slow", say: "Balanceate suave" },
    { to: "start", s: 1.2, ease: "slow", say: "Pies al piso" },
  ],
};
