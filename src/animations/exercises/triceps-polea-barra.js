/*
 * Tríceps en polea con barra
 * Side view, facing right, standing in front of the high pulley with a
 * slight forward lean; the near ankle is the fixed point. The elbows stay
 * pinned at the sides: only the forearms move, from about horizontal down to
 * fully straight. The cable from the high pulley stretches as the bar goes
 * down. Firm push, short lockout, controlled way up.
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
    // arms fully straight, elbows have not moved
    down: {
      armR: 182,
      forearmR: 178,
      armL: 184,
      forearmL: 180,
    },
  },

  timeline: [
    { to: "down", s: 0.7, say: "Extendé completo" },
    { to: "down", s: 0.3, say: "Extendé completo" },
    { to: "start", s: 1.1, ease: "slow", say: "Codos pegados" },
    { to: "start", s: 0.4, say: "Codos pegados" },
  ],

  props: [
    // pulley frame
    { kind: "line", from: ANCHOR, to: [132, 6] },
    { kind: "line", from: [132, 6], to: [132, 148] },
    { kind: "disc", c: ANCHOR, r: 3, fill: true },
    // cable to the hands and the short bar (perpendicular to the forearm)
    { kind: "cable", anchor: ANCHOR, to: "handR" },
    { kind: "line", on: "forearmR", from: [-0.9, -4.9], to: [0.9, 4.9] },
  ],
};
