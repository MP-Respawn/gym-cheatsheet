/*
 * Dead bug
 * Side view, lying on the back with the head to the left. Start: arms
 * pointing at the ceiling, hips and knees at 90 degrees (shins level).
 * Side 1: the far arm goes overhead while the near leg reaches long and
 * low; back to the middle. Side 2: the near arm and the far leg. Slow
 * moves, as the trainer asks (exhale while reaching). The torso and low
 * back never leave the floor: the hips are the fixed point and the torso
 * angle never changes.
 */
import { STAND_SIDE } from "../engine/helpers.js";

const HIP = [86, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 272, // flat on the floor
    head: 280,
    // arms straight up at the ceiling, far arm a touch apart so both show
    armR: 4,
    forearmR: 4,
    armL: 356,
    forearmL: 356,
    // hips and knees at 90 degrees, far leg a little offset
    thighR: 2,
    shinR: 90,
    thighL: 358,
    shinL: 92,
    footR: 10,
    footL: 12,
  },

  poses: {
    // far arm overhead, near leg long and low (just off the floor)
    sideA: { armL: 266, forearmL: 266, thighR: 81, shinR: 83, footR: 40 },
    // near arm overhead, far leg long and low
    sideB: { armR: 267, forearmR: 267, thighL: 81, shinL: 83, footL: 40 },
  },

  timeline: [
    { to: "sideA", s: 1.1, ease: "slow", say: "Brazo y pierna contrarios" },
    { to: "start", s: 0.8 },
    { to: "sideB", s: 1.1, ease: "slow", say: "Cambiá de lado" },
    { to: "start", s: 0.8 },
    { to: "start", s: 0.3 },
  ],
};
