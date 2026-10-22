/*
 * Guerrero II / Virabhadrasana II (yoga)
 * Front view, legs wide: the right foot points right, the left foot turns
 * slightly in. The right knee bends over the ankle as the hips sink, the
 * torso stays upright between the legs and the arms rise from the sides
 * to shoulder height; hold, then back up. The left ankle is the fixed
 * point; both feet stay planted.
 */
import { STAND_FRONT, leg, point } from "../engine/helpers.js";

const LEFT_ANKLE = [30, 144];
const RIGHT_ANKLE = [124, 144];

// Legs for a hip position (the pelvis is level, 6 units to each side).
function stance(hip) {
  return {
    ...leg("R", point(hip, 6, 90), RIGHT_ANKLE, "fwd"),
    ...leg("L", point(hip, 6, 270), LEFT_ANKLE, "back"),
    footR: 90,
    footL: 260,
  };
}

export default {
  view: "front",
  root: "ankleL",
  at: LEFT_ANKLE,

  start: {
    ...STAND_FRONT,
    ...stance([78, 103]),
    // arms down by the sides
    armR: 168,
    forearmR: 172,
    armL: 192,
    forearmL: 188,
  },

  poses: {
    warrior: {
      ...stance([80, 110]),
      armR: 90, // arms out at shoulder height
      forearmR: 90,
      armL: 270,
      forearmL: 270,
    },
  },

  timeline: [
    { to: "warrior", s: 1.2, ease: "slow", say: "Flexioná la rodilla, brazos en cruz" },
    { to: "warrior", s: 2.2, say: "Sostené respirando" },
    { to: "start", s: 1, ease: "slow", say: "Volvé despacio" },
    { to: "start", s: 0.4 },
  ],
};
