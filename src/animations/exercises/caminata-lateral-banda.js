/*
 * Caminata lateral con banda
 * Front view, in a quarter squat with an elastic band around the knees and
 * the hands together in front of the chest. The hip is the root and it
 * shifts sideways with each step. Two short steps to the right (the right
 * foot steps out, the left one follows), a pause, then two back to the
 * left, so the loop closes in place. The knees stay pushed out (band taut)
 * and the squat depth does not change; the planted foot never moves.
 * Simplification: the stepping foot shuffles flat along the floor instead
 * of lifting (it stays within 0.3 of the floor line between poses).
 */
import { STAND_FRONT, arm, leg } from "../engine/helpers.js";

const HIP = [80, 100]; // quarter squat: hip 44 above the feet
const SHOULDER_L = [67, 68];
const SHOULDER_R = [93, 68];
const Y = 144; // feet on the floor

const hipL = (hip) => [hip[0] - 6, hip[1]];
const hipR = (hip) => [hip[0] + 6, hip[1]];
const off = (hip) => [hip[0] - HIP[0], hip[1] - HIP[1]];

// Both legs for a hip position and two ankles; the knees bend outward and
// the feet stay flat.
const legs = (hip, ankleL, ankleR) => ({
  $root: off(hip),
  ...leg("L", hipL(hip), ankleL, "back"),
  ...leg("R", hipR(hip), ankleR, "fwd"),
  footL: 270,
  footR: 90,
});

const HIP_MID = [89, 100]; // hips between the feet in the wide stance
const HIP_RIGHT = [98, 100]; // stance restored, shifted right

// The wide stance is the same whether the right foot just stepped out or
// the left one is about to come home.
const WIDE = legs(HIP_MID, [58, Y], [120, Y]);

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    ...legs(HIP, [58, Y], [102, Y]),
    // hands together in front of the chest, elbows down
    ...arm("L", SHOULDER_L, [79, 80], "back"),
    ...arm("R", SHOULDER_R, [81, 80], "fwd"),
  },

  poses: {
    // right foot steps out to the right
    stepR: WIDE,
    // left foot follows: the start stance, shifted right
    closeL: legs(HIP_RIGHT, [76, Y], [120, Y]),
    // back to the left: the left foot steps out (the right one then follows home)
    stepL: WIDE,
  },

  timeline: [
    { to: "stepR", s: 0.5, say: "Pasos cortos, banda tensa" },
    { to: "closeL", s: 0.5, say: "Media sentadilla todo el tiempo" },
    { to: "closeL", s: 0.3, say: "Rodillas hacia afuera" },
    { to: "stepL", s: 0.5, say: "Pasos cortos, banda tensa" },
    { to: "start", s: 0.5, say: "Media sentadilla todo el tiempo" },
    { to: "start", s: 0.3, say: "Rodillas hacia afuera" },
  ],

  props: [
    // elastic band around the knees
    { kind: "span", from: "kneeL", to: "kneeR", cls: "band", layer: "front" },
  ],
};
