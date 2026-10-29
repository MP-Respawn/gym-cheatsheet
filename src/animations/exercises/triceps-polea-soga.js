/*
 * Tríceps en polea con soga
 * Side view, facing right, standing in front of the high pulley with a
 * slight forward lean; the near ankle is the fixed point. The elbows stay
 * pinned at the sides: only the forearms move, from about horizontal down to
 * fully straight, and at the bottom the hands end a touch apart (the rope
 * ends are pulled open). The rope is two short lines in a V attached to the
 * near forearm, so it rotates with it instead of hanging: a simplification.
 * Firm push, short lockout, controlled way up.
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

const HIP = [74, 85];
const ANCHOR = [112, 6]; // high pulley, above and in front

export default {
  view: "side",
  root: "ankleR",
  at: [78, 144],

  start: {
    ...STAND_SIDE,
    torso: 8, // slight lean toward the pulley
    head: 10,
    ...leg("R", HIP, [78, 144]),
    ...leg("L", HIP, [74, 144]),
    footR: 90,
    footL: 90,
    // upper arms by the sides, forearms about horizontal
    armR: 182,
    forearmR: 80,
    armL: 184,
    forearmL: 84,
  },

  poses: {
    // arms fully straight, elbows have not moved; the hands open a little
    down: {
      armR: 182,
      forearmR: 183,
      armL: 184,
      forearmL: 175,
    },
  },

  timeline: [
    { to: "down", s: 0.7, say: "Extendé y separá la soga" },
    { to: "down", s: 0.3, say: "Extendé y separá la soga" },
    { to: "start", s: 1.1, ease: "slow", say: "Codos pegados al cuerpo" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // pulley frame
    { kind: "line", from: ANCHOR, to: [132, 6] },
    { kind: "line", from: [132, 6], to: [132, 148] },
    { kind: "disc", c: ANCHOR, r: 3, fill: true },
    // cable to the hands, and the rope: two ends in a V past the hands
    { kind: "cable", anchor: ANCHOR, to: "handR" },
    { kind: "line", on: "forearmR", from: [0, 0], to: [7, 2] },
    { kind: "line", on: "forearmR", from: [0, 0], to: [2, 7] },
  ],
};
