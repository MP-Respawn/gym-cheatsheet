/*
 * Jalón con brazos rectos
 * Side view, standing in front of the high pulley with a slight forward
 * lean and soft knees; the near ankle is the fixed point. The arms stay
 * straight the whole time: from reaching up and forward toward the pulley,
 * they sweep down in an arc until the bar meets the front of the thighs.
 * The cable from the high pulley stretches as the bar goes down and the
 * weight stack by the post rises. Pull, squeeze, slow return.
 * Simplification: the elbows are drawn fully straight (the real cue is
 * "casi estirados").
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const ANKLE = [70, 144];
const ANKLE_FAR = [66, 144];
const HIP = [66, 86];
const TORSO = 10; // slight lean toward the pulley
const NECK = neckFrom(HIP, TORSO); // about [72, 55]
const ANCHOR = [118, 6]; // high pulley, above and in front

// Targets a hair beyond reach, so arm() returns straight arms aimed at them.
const HAND_UP = [112, 46];
const HAND_DOWN = [88, 102]; // in front of the thighs
const ARMS_UP = { ...arm("R", NECK, HAND_UP, "down"), ...arm("L", NECK, [110, 46], "down") };
// Short bar across the hands, square to the forearm in the start pose.
const BAR_END = point([0, 0], 5, ARMS_UP.forearmR + 90);

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 12,
    ...leg("R", HIP, ANKLE),
    ...leg("L", HIP, ANKLE_FAR),
    ...FEET_FLAT,
    // arms straight, reaching up and forward to the bar
    ...ARMS_UP,
  },

  poses: {
    // the straight arms have swept down to the thighs
    down: {
      ...arm("R", NECK, HAND_DOWN, "down"),
      ...arm("L", NECK, [HAND_DOWN[0] - 2, HAND_DOWN[1]], "down"),
    },
  },

  timeline: [
    { to: "down", s: 0.9, say: "Bajá en arco hasta los muslos" },
    { to: "down", s: 0.25, say: "Apretá los dorsales" },
    { to: "start", s: 1.2, ease: "slow", say: "Codos casi estirados y fijos" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // pulley frame and the weight stack by the post (rises with the pull)
    { kind: "line", from: ANCHOR, to: [138, 6] },
    { kind: "line", from: [138, 6], to: [138, 148] },
    { kind: "disc", c: ANCHOR, r: 3, fill: true },
    { kind: "rect", x: 140, y: 112, w: 14, h: 30, fill: true, shift: { down: [0, -18] } },
    // cable to the hands and the short bar (square to the forearm)
    { kind: "cable", anchor: ANCHOR, to: "handR" },
    { kind: "line", on: "forearmR", from: [-BAR_END[0], -BAR_END[1]], to: BAR_END },
  ],
};
