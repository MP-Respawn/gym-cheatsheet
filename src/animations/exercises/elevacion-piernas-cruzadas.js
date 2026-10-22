/*
 * Elevaciones con piernas cruzadas (vuelta: abdomen estirado, paso 3)
 * Side view, lying on the back with the head to the left, shoulders just
 * off the floor and the arms flat by the sides. The straight legs rise
 * while crossing like scissors (near leg over, then far leg over) and come
 * back down to hover over the floor. The hips are the fixed point and the
 * low back stays down.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const HIP = [80, 140];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 279,
    head: 286,
    armR: 99,
    forearmR: 95,
    armL: 100,
    forearmL: 96,
    // legs straight and low, hovering over the floor
    ...both("thigh", 80),
    ...both("shin", 80),
    ...both("foot", 55),
  },

  poses: {
    // halfway up the legs cross; at the top they swap which one is in front
    crossA: { thighR: 38, shinR: 38, thighL: 52, shinL: 52 },
    topA: { thighR: 8, shinR: 8, thighL: 18, shinL: 18 },
    crossB: { thighR: 52, shinR: 52, thighL: 38, shinL: 38 },
    topB: { thighR: 18, shinR: 18, thighL: 8, shinL: 8 },
  },

  timeline: [
    { to: "crossA", s: 0.5, say: "Subí cruzando las piernas" },
    { to: "topA", s: 0.4, say: "Subí cruzando las piernas" },
    { to: "crossB", s: 0.5, say: "Bajá cruzando al revés" },
    { to: "start", s: 0.6, ease: "slow", say: "Bajá cruzando al revés" },
    { to: "crossB", s: 0.5, say: "Subí cruzando las piernas" },
    { to: "topB", s: 0.4, say: "Subí cruzando las piernas" },
    { to: "crossA", s: 0.5, say: "Bajá cruzando al revés" },
    { to: "start", s: 0.6, ease: "slow", say: "Bajá cruzando al revés" },
    { to: "start", s: 0.3 },
  ],
};
