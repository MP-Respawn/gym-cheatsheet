/*
 * Patada de tríceps
 * Side view, facing right. Far knee and far hand on a flat bench, near foot
 * on the floor a little behind the hip, back about parallel to the floor.
 * The hip is the fixed point. The near upper arm is held back along the
 * torso (a bit under it, so both read apart) and never moves: only the
 * forearm swings, from hanging straight down to extended back in line with
 * the upper arm, dumbbell behind the hip. Extend, squeeze, slow way down.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [60, 90];
const TORSO = 82; // back about parallel to the floor
const SHOULDER = neckFrom(HIP, TORSO);
const ARM_BACK = 244; // upper arm pointing back toward the hip, just under the torso

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 88,
    // far leg kneeling on the bench, shin along the pad, foot off the end
    thighL: 185,
    shinL: 270,
    footL: 220,
    // near leg standing on the floor, foot a little behind the hip
    ...leg("R", HIP, [48, 144]),
    footR: 90,
    // far hand on the bench, under the shoulder
    ...arm("L", SHOULDER, [95, 120], "back"),
    // near upper arm back along the torso, forearm hanging from the elbow
    armR: ARM_BACK,
    forearmR: 180,
  },

  poses: {
    // forearm swung back, arm straight, dumbbell behind the hip
    back: {
      armR: ARM_BACK,
      forearmR: ARM_BACK + 10,
    },
  },

  timeline: [
    { to: "back", s: 0.7, say: "Extendé hacia atrás" },
    { to: "back", s: 0.3, say: "Apretá atrás" },
    { to: "start", s: 1.1, ease: "slow", say: "Solo se mueve el antebrazo" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // flat bench and its legs
    { kind: "rect", x: 24, y: 123, w: 80, h: 6 },
    { kind: "line", from: [30, 129], to: [30, 148] },
    { kind: "line", from: [98, 129], to: [98, 148] },
    // dumbbell in the near hand
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
