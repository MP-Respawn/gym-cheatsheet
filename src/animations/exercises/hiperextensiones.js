/*
 * Hiperextensiones
 * Side view, lying face down on a 45 degree roman chair, head to the right
 * and feet hooked at the left (figures always face right, so the chair is
 * mirrored from the usual gym layout). The hips on the edge of the pad are
 * the fixed point; the legs stay straight along the pad, toes against the
 * foot plate and a roller over the ankles. Arms crossed on the chest and
 * carried by the torso. The torso folds down at the hip and comes back up
 * until it is in one line with the legs, never past it.
 */
import { STAND_SIDE, arm, both, neckFrom, point } from "../engine/helpers.js";

const HIP = [84, 96];
const LINE = 55; // legs and torso in one straight line, up to the right
const NECK = neckFrom(HIP, LINE);
// Hands on the chest: a little down the torso and in front of it.
const CHEST = point(point(NECK, 10, LINE + 180), 6, LINE + 90);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: LINE,
    head: LINE,
    // legs straight down the pad, feet hooked
    ...both("thigh", LINE + 180),
    ...both("shin", LINE + 180),
    ...both("foot", 150),
    // arms crossed on the chest
    ...arm("R", NECK, CHEST, "down"),
    ...arm("L", NECK, [CHEST[0] - 2, CHEST[1] + 2], "down"),
  },

  poses: {
    // torso folded down at the hip; head and arms come along
    down: {
      torso: 110,
    },
  },

  timeline: [
    { to: "down", s: 1.1, ease: "slow", say: "Bajá con la espalda recta" },
    { to: "start", s: 0.8, say: "Subí hasta quedar en línea" },
    { to: "start", s: 0.4, say: "Apretá los glúteos arriba" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // 45 degree pad under the thighs, ending at the hip crease
    { kind: "path", d: "M89 98 L54 123 L58.6 129.6 L93.6 104.6 Z" },
    // post under the pad, foot plate and the base block on the floor
    { kind: "line", from: [76, 117], to: [76, 148] },
    { kind: "line", from: [43, 135], to: [51, 145] },
    { kind: "rect", x: 50, y: 143, w: 50, h: 5, fill: true },
    // roller holding the ankles down
    { kind: "disc", c: [30.8, 124.7], r: 3, fill: true, layer: "front" },
  ],
};
