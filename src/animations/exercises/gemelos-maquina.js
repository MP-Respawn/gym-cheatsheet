/*
 * Gemelos en máquina
 * Side view, facing right, in the standing calf machine: the padded yoke
 * rests on top of the shoulders, hands on its handles, the front of the
 * feet on the platform with the heels hanging off. The heels sink all the
 * way down (full stretch), stay there a moment (no bounce), then the body
 * rises onto the toes, controlled. The yoke's arm and the weight stack
 * behind ride up and down with the body.
 * Cues shown: full range with a good stretch at the bottom, no bouncing.
 *
 * The near toe on the platform edge is the fixed point; only the feet
 * change angle, the straight body rides on top of them.
 */
import { STAND_SIDE, ankleFor, arm } from "../engine/helpers.js";

const TOE = [92, 128]; // on the platform, whose top is at y = 132
const NECK = [TOE[0] - 12, 36]; // body straight above the flat-foot ankle

// How far the body (and so the weight stack) moves in each pose.
const LOW_FOOT = 60;
const HIGH_FOOT = 128;
const rise = (footAngle) => [0, ankleFor(TOE, footAngle)[1] - TOE[1]];

export default {
  view: "side",
  root: "toeR",
  at: TOE,

  start: {
    ...STAND_SIDE,
    thighL: 182, // far leg a touch behind so both legs show
    shinL: 180,
    // hands on the yoke handles, just in front of the shoulders
    ...arm("R", NECK, [NECK[0] + 8, NECK[1] + 1], "down"),
    ...arm("L", NECK, [NECK[0] + 6, NECK[1] + 1], "down"),
  },

  poses: {
    low: { footR: LOW_FOOT, footL: LOW_FOOT }, // heels below the platform
    high: { footR: HIGH_FOOT, footL: HIGH_FOOT }, // high on the toes
  },

  timeline: [
    { to: "low", s: 1.0, ease: "slow", say: "Recorrido completo" },
    { to: "low", s: 0.4, say: "Sin rebotar" },
    { to: "high", s: 1.0, ease: "slow", say: "Sin rebotar" },
    { to: "high", s: 0.3 },
    { to: "start", s: 0.6 },
  ],

  props: [
    // machine frame: column the yoke slides on, and the platform
    { kind: "line", from: [40, 8], to: [40, 148] },
    { kind: "rect", x: TOE[0] - 6, y: 132, w: 26, h: 16 },
    // shoulder yoke: pad on top of the shoulders and its arm back to the
    // column. Attached to the torso, so it rides with the body.
    { kind: "rect", on: "torso", x: -9, y: -6, w: 16, h: 4, fill: true, layer: "far" },
    { kind: "line", on: "torso", from: [-9, -4], to: [-38, -4], layer: "far" },
    // weight stack behind the column, rising and falling with the body
    {
      kind: "rect",
      x: 14,
      y: 100,
      w: 16,
      h: 28,
      fill: true,
      shift: { low: rise(LOW_FOOT), high: rise(HIGH_FOOT) },
    },
    // stack cable (runs into the stack, so it never shows a gap)
    { kind: "line", from: [22, 8], to: [22, 106] },
  ],
};
