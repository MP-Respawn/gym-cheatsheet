/*
 * Equilibrio en bosu
 * Side view, facing right. Standing on the near leg on top of a bosu
 * dome, knee slightly bent (not locked), the far knee lifted in front.
 * The body wobbles in small irregular sways (stance leg and torso a few
 * degrees each way) while the arms swing out front and back to catch the
 * balance. The eyes stay on a fixed point ahead: the head barely moves.
 * The stance ankle on the dome is the fixed point.
 */
import { STAND_SIDE } from "../engine/helpers.js";

// Stance leg with a soft knee: shin leans forward, thigh back.
const SHIN = 190; // knee -> ankle
const THIGH = 168; // hip -> knee

// One sway pose: lean of the stance leg (+ = forward), torso tilt in
// degrees (+ = forward), and where each arm points (shoulder -> elbow).
function sway(lean, torso, armR, armL) {
  return {
    shinR: SHIN + lean,
    thighR: THIGH + lean,
    footR: 90, // foot flat on the dome
    torso,
    head: torso * 0.3, // eyes on a fixed point: the head stays almost level
    armR,
    forearmR: armR - 12,
    armL,
    forearmL: armL - 12,
    thighL: 112 + lean, // lifted knee rides along
  };
}

export default {
  view: "side",
  root: "ankleR",
  at: [76, 129], // on top of the dome

  start: {
    ...STAND_SIDE,
    shinR: SHIN,
    thighR: THIGH,
    footR: 90,
    // free leg: knee lifted forward, foot hanging below it
    thighL: 112,
    shinL: 192,
    footL: 120,
    // arms a little away from the body, ready to balance
    armR: 160,
    forearmR: 148,
    armL: 200,
    forearmL: 188,
  },

  poses: {
    swayA: sway(4, -4, 132, 212), // tips forward: near arm reaches out front
    swayB: sway(-3, 5, 186, 160), // tips back: far arm comes forward
    swayC: sway(2, -1, 145, 226),
    swayD: sway(-4, 6, 198, 150),
  },

  timeline: [
    { to: "swayA", s: 0.7, say: "Mirá un punto fijo" },
    { to: "swayB", s: 0.8, say: "Mirá un punto fijo" },
    { to: "swayC", s: 0.6, say: "Rodilla apenas flexionada" },
    { to: "swayD", s: 0.8, say: "Rodilla apenas flexionada" },
    { to: "start", s: 0.7 },
  ],

  props: [
    // bosu: half dome on the floor
    { kind: "path", d: "M 56 148 A 24 16 0 0 1 104 148 Z", fill: true },
  ],
};
