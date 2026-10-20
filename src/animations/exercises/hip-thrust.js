/*
 * Hip thrust en punta de pie
 * Side view, head to the left, upper back on a bench, barbell across the
 * hips (a big plate) held in place with both hands. The neck/shoulders on
 * the bench are the fixed point. The feet stand on the toes the whole
 * time, heels up ("apoyá en punta de pie"). Hips drive up to a flat
 * tabletop, squeeze hold at the top, controlled way down.
 * Unlike puente-gluteos-press: no arm press, toes instead of flat feet,
 * and a loaded bar on the hips.
 */
import { STAND_SIDE, angleBetween, ankleFor, arm, both, leg, point } from "../engine/helpers.js";

const NECK = [44, 110]; // shoulders on the end of the bench

// On the toes: toes fixed on the floor, feet tilted, heels up.
const FOOT = 125;
const TOE = [114, 144];
const TOE_FAR = [110, 144];
const ANKLE = ankleFor(TOE, FOOT);
const ANKLE_FAR = ankleFor(TOE_FAR, FOOT);

// Hips placed on a circle of torso length around the neck.
const HIP_LOW = point(NECK, 32, 130);
const HIP_UP = point(NECK, 32, 92); // torso flat, in line with the thighs

// The bar sits just above the hips, square to the torso.
const BAR_GAP = 9;
const barAt = (hip, torso) => point(hip, BAR_GAP, torso + 90);

function pose(hip) {
  const torso = angleBetween(hip, NECK);
  const bar = barAt(hip, torso);
  return {
    torso,
    head: 280,
    ...leg("R", hip, ANKLE, "up"),
    ...leg("L", hip, ANKLE_FAR, "up"),
    ...both("foot", FOOT),
    // hands on the bar, a little apart so both arms show
    ...arm("R", NECK, [bar[0] - 2, bar[1] + 1], "down"),
    ...arm("L", NECK, [bar[0] - 5, bar[1] + 1], "down"),
  };
}

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: { ...STAND_SIDE, ...pose(HIP_LOW) },

  poses: {
    top: pose(HIP_UP),
  },

  timeline: [
    { to: "top", s: 0.7, say: "Empujá en punta de pie" },
    { to: "top", s: 0.5, say: "Apretá glúteos" },
    { to: "start", s: 1, say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // bench: pad and two legs
    { kind: "rect", x: 4, y: 114, w: 44, h: 7 },
    { kind: "line", from: [10, 121], to: [10, 148] },
    { kind: "line", from: [40, 121], to: [40, 148] },
    // barbell plate resting on the hips (moves with the torso)
    {
      kind: "disc",
      on: "torso",
      at: 0,
      dx: point([0, 0], BAR_GAP, angleBetween(HIP_LOW, NECK) + 90)[0],
      dy: point([0, 0], BAR_GAP, angleBetween(HIP_LOW, NECK) + 90)[1],
      r: 10,
      layer: "near",
    },
  ],
};
