/*
 * Vuelta de abdomen estirado
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the arms flat by the sides (palms down, no ball). Same
 * circuit as the ball version, so it shows a different part of it: one
 * full straight-leg raise and lower, then "tijeras" with the near and far
 * legs crossing high and low. The hips are the fixed point and the low
 * back stays on the floor; the legs never rest between moves.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [80, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 279, // lying back, shoulders a little up
    head: 286,
    // arms flat on the floor beside the body
    armR: 99,
    forearmR: 95,
    armL: 100,
    forearmL: 96,
    // legs straight and low, hovering over the floor
    ...both("thigh", 80),
    ...both("shin", 80),
    ...both("foot", 55), // toes pointed, in line with the legs
  },

  poses: {
    up: { ...both("thigh", 4) }, // legs vertical
    // scissors: one leg high, the other low, then swap
    scissorA: { thighR: 48, thighL: 78 },
    scissorB: { thighR: 78, thighL: 48 },
  },

  timeline: [
    { to: "up", s: 0.9, say: "Elevación" },
    { to: "start", s: 1.1, ease: "slow", say: "Elevación" },
    { to: "scissorA", s: 0.4, say: "Tijeras" },
    { to: "scissorB", s: 0.4, say: "Tijeras" },
    { to: "scissorA", s: 0.4, say: "Tijeras" },
    { to: "scissorB", s: 0.4, say: "Tijeras" },
    { to: "start", s: 0.4 },
  ],
};
