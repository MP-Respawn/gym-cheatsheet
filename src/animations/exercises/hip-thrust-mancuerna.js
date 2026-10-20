/*
 * Hip thrust con mancuerna en el piso
 * Side view, lying on the back on the mat, head to the left, a dumbbell on
 * the hips held with both hands. No bench: the neck/shoulders on the floor
 * are the fixed point. Feet flat with the heels close to the glutes. Hips
 * up until shoulders, hips and knees line up, squeeze 1 second at the top,
 * then down.
 */
import { STAND_SIDE, angleBetween, arm, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const ANKLE = [98, 144]; // heels close to the glutes
const ANKLE_FAR = [94, 144];

// Hips placed on a circle of torso length around the neck.
const HIP_DOWN = point(NECK, 32, 90); // flat on the floor
const HIP_UP = point(NECK, 32, 66); // bridge: shoulders, hips and knees in line

// The dumbbell sits on the hips, square to the torso.
const DB_GAP = 7;

function pose(hip) {
  const torso = angleBetween(hip, NECK);
  const db = point(hip, DB_GAP, torso + 90);
  return {
    torso,
    head: 280,
    ...leg("R", hip, ANKLE, "up"),
    ...leg("L", hip, ANKLE_FAR, "up"),
    ...both("foot", 90), // feet flat
    // both hands on the dumbbell, elbows resting low by the sides
    ...arm("R", NECK, [db[0] + 5, db[1]], "down"),
    ...arm("L", NECK, [db[0] + 5, db[1] - 1], "down"),
  };
}

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: { ...STAND_SIDE, ...pose(HIP_DOWN) },

  poses: {
    top: pose(HIP_UP),
  },

  timeline: [
    { to: "top", s: 0.6, say: "Empujá con los talones" },
    { to: "top", s: 1, say: "Apretá 1 segundo" },
    { to: "start", s: 0.9, say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // dumbbell on the hips (moves with the torso)
    { kind: "disc", on: "torso", at: 0, dx: 0, dy: -DB_GAP, r: 6, layer: "near" },
  ],
};
