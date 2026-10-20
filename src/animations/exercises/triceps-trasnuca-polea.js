/*
 * Tríceps trasnuca en polea con soga
 * Side view, facing right, back to the pulley (on the left, at about
 * shoulder height). Staggered stance and the torso leaning forward about
 * 22 degrees; the front ankle is the fixed point. The upper arms stay by the
 * head pointing forward and up. The rope starts deep behind the head (the
 * stretch the trainer asks for) and the forearms extend forward and up until
 * the arms are straight, hands opening at the end; the cable stretches.
 *
 * Simplification: hands opening sideways cannot be seen from the side; the
 * far hand ends a little apart from the near one to hint at it.
 */
import { STAND_SIDE, leg } from "../engine/helpers.js";

const HIP = [78, 88];
const ANCHOR = [10, 60]; // pulley behind the body

export default {
  view: "side",
  root: "ankleR",
  at: [96, 144],

  start: {
    ...STAND_SIDE,
    torso: 22, // leaning forward
    head: 20,
    // staggered stance: near foot in front, far foot behind
    ...leg("R", HIP, [96, 144]),
    ...leg("L", HIP, [58, 144]),
    footR: 90,
    footL: 90,
    // upper arms by the head, forearms folded deep behind it
    armR: 30,
    forearmR: 212,
    armL: 26,
    forearmL: 208,
  },

  poses: {
    // forearms extended forward and up, in line with the upper arms
    extended: {
      armR: 30,
      forearmR: 38,
      armL: 26,
      forearmL: 30,
    },
  },

  timeline: [
    { to: "extended", s: 0.8, say: "Extendé y separá las manos" },
    { to: "extended", s: 0.3, say: "Extendé y separá las manos" },
    { to: "start", s: 1.2, ease: "slow", say: "Andá bien atrás" },
    { to: "start", s: 0.4, say: "Andá bien atrás" },
  ],

  props: [
    // pulley tower behind the body
    { kind: "line", from: [10, 10], to: [10, 148] },
    { kind: "disc", c: ANCHOR, r: 3, fill: true },
    // rope from the pulley to the hands, with its knot in the hands
    { kind: "cable", anchor: ANCHOR, to: ["handL", "handR"] },
    { kind: "disc", on: "forearmR", r: 2.5, fill: true },
  ],
};
