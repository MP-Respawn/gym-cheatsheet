/*
 * Gemelos de pie
 * Side view, facing right, standing on a step with only the front of the
 * feet on it; the heels hang off the back edge. A dumbbell hangs in each
 * hand. The heels drop well below the step (full stretch), then the body
 * rises high onto the toes and pauses there before coming back to flat.
 * Cues shown: full range at the bottom and at the top, short pause on top.
 *
 * The near toe is the fixed point (on the step edge). Only the feet change
 * angle; legs and torso stay straight and simply ride up and down.
 */
import { STAND_SIDE } from "../engine/helpers.js";

const TOE = [92, 128]; // on the step, whose top is at y = 132

export default {
  view: "side",
  root: "toeR",
  at: TOE,

  start: {
    ...STAND_SIDE,
    // far leg a touch behind so both legs show
    thighL: 183,
    shinL: 181,
  },

  poses: {
    // heels below the step: the foot tilts toes-up
    low: { footR: 60, footL: 60 },
    // high on the toes
    high: { footR: 128, footL: 128 },
  },

  timeline: [
    { to: "low", s: 0.9, ease: "slow", say: "Bajá bien abajo" },
    { to: "high", s: 1.0, say: "Subí bien arriba" },
    { to: "high", s: 0.6, say: "Pausa arriba" },
    { to: "start", s: 0.6 },
  ],

  props: [
    // the step: only the front of the foot is on it
    { kind: "rect", x: TOE[0] - 6, y: 132, w: 40, h: 16 },
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
