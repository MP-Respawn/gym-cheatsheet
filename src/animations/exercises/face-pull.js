/*
 * Face pull
 * Side view, standing, facing a cable tower on the right with the pulley
 * at face height and a rope to both hands (the cable stretches). Arms
 * start reaching forward; the pull brings the hands to the face with the
 * elbows high (upper arm about level, pointing back) and finishes with the
 * hands beside the head. Short squeeze, controlled return. A midpoint pose
 * (elbows already up, hands in front of the face) keeps the hands on the
 * cable line; without it the upper arm would swing over the head. Each
 * half is eased "in" then "fast" so the move flows through it.
 * Simplification: "separá las manos" (the rope ends spreading apart) moves
 * toward the camera, so it only shows as a label.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg } from "../engine/helpers.js";

const HIP = [70, 84];
const NECK = [70, 52]; // torso upright
const PULLEY = [148, 40];

export default {
  view: "side",
  root: "ankleR",
  at: [76, 144],

  start: {
    ...STAND_SIDE,
    // staggered stance: near foot ahead, far foot behind
    ...leg("R", HIP, [76, 144], "fwd"),
    ...leg("L", HIP, [60, 144], "fwd"),
    ...FEET_FLAT,
    // arms reaching forward toward the pulley, almost straight
    ...arm("R", NECK, [108, 46], "down"),
    ...arm("L", NECK, [106, 46], "down"),
  },

  poses: {
    // halfway: elbows lifting above the shoulders, hands in front of the face
    mid: {
      ...arm("R", NECK, [88, 42], "up"),
      ...arm("L", NECK, [86, 42], "up"),
    },
    // elbows high and back, hands beside the head
    pulled: {
      ...arm("R", NECK, [68, 36], "back"),
      ...arm("L", NECK, [66, 36], "back"),
    },
  },

  timeline: [
    { to: "mid", s: 0.4, ease: "in", say: "Codos altos" },
    { to: "pulled", s: 0.4, ease: "fast", say: "Codos altos" },
    { to: "pulled", s: 0.5, say: "Separá las manos" },
    { to: "mid", s: 0.6, ease: "in", say: "Volvé controlado" },
    { to: "start", s: 0.6, ease: "fast", say: "Volvé controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // cable tower and pulley at face height
    { kind: "line", from: [154, 8], to: [154, 148] },
    { kind: "line", from: [148, 40], to: [154, 40] },
    { kind: "disc", c: PULLEY, r: 3 },
    // cable and rope to the hands, stretching as you pull
    { kind: "cable", anchor: PULLEY, to: ["handL", "handR"] },
  ],
};
