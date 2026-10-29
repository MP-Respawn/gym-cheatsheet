/*
 * Press francés
 * Side view, lying on a flat bench, head to the left, feet planted. Both
 * hands on an EZ bar seen from the side as a plate, arms straight up over
 * the shoulders. The upper arms stay pointing at the ceiling the whole
 * time: only the forearms fold back so the bar comes down to the forehead
 * in a slow ~1 s, a tiny pause, then the elbows extend again.
 * Simplification: no rack (the bar starts in the hands).
 */
import { FEET_FLAT, STAND_SIDE, leg } from "../engine/helpers.js";

const HIP = [94, 113];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 270,
    head: 272,
    // feet firm on the floor
    ...leg("R", HIP, [116, 144], "up"),
    ...leg("L", HIP, [111, 144], "up"),
    ...FEET_FLAT,
    // top: arms straight up over the shoulders, bar over the face line
    armR: 2,
    forearmR: 358,
    armL: 0,
    forearmL: 356,
  },

  poses: {
    // bar at the forehead: forearms folded back, upper arms unchanged
    down: {
      armR: 2,
      forearmR: 283,
      armL: 0,
      forearmL: 281,
    },
  },

  timeline: [
    { to: "down", s: 1, ease: "slow", say: "Bajá a la frente" },
    { to: "down", s: 0.15 },
    { to: "start", s: 0.8, say: "Extendé, codos quietos" },
    { to: "start", s: 0.5, say: "Codos apuntando al techo" },
  ],

  props: [
    // flat bench: pad and two legs
    { kind: "rect", x: 36, y: 117, w: 70, h: 6 },
    { kind: "line", from: [44, 123], to: [44, 148] },
    { kind: "line", from: [98, 123], to: [98, 148] },
    // EZ bar seen from the side: a plate at the hands
    { kind: "disc", on: "forearmR", r: 7 },
  ],
};
