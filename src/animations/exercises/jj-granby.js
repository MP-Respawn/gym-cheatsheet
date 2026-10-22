/*
 * Granby / Granby roll (Jiu Jitsu)
 * Side view, facing right. Simplified on purpose: from a turtle (curled on
 * knees and forearms), the body rolls backward over the shoulders, legs
 * passing overhead, one full turn in place, and lands back in the turtle
 * ready to face forward again. Drawn as the curled body turning around
 * its own center (engine/poses.js rollPose) without traveling, so the loop
 * closes on its own. The shoulder-to-shoulder path happens toward the
 * camera and is not drawn.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { rollPose } from "../engine/poses.js";

// Turtle: back rounded, head tucked, knees under the chest, forearms in.
const TURTLE = {
  ...STAND_SIDE,
  torso: 64,
  head: 128,
  thighR: 150,
  thighL: 154,
  shinR: 276,
  shinL: 280,
  footR: 270,
  footL: 270,
  armR: 160,
  forearmR: 60,
  armL: 164,
  forearmL: 64,
};

const STEPS = 8;
const X = 80;
const placed = (base, k) => rollPose({ base, tuck: TURTLE, turn: -k * (360 / STEPS), x: X });
const AT = placed([0, 0], 0).$root;

// g1 ... g8: the curled body after each eighth of a backward turn.
const poses = Object.fromEntries(Array.from({ length: STEPS }, (_, i) => [`g${i + 1}`, placed(AT, i + 1)]));

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: TURTLE,

  poses,

  timeline: [
    { to: "start", s: 0.5, say: "Desde la tortuga" },
    ...Array.from({ length: STEPS }, (_, i) => ({
      to: `g${i + 1}`,
      s: 0.18,
      ease: "linear",
      say: "Rodá por los hombros, piernas por arriba",
    })),
    { to: "start", s: 0.6, say: "Recuperá la guardia" },
  ],
};
