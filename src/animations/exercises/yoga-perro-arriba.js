/*
 * Perro boca arriba / Urdhva Mukha Svanasana (yoga)
 * Side view, facing right: hands planted under the shoulders with the arms
 * straight, chest up, hips and thighs off the floor, legs long behind on
 * the tops of the feet. Held with the breath: on the inhale the chest lifts
 * and opens a little more, on the exhale it settles. The near hand is the
 * fixed point.
 */
import { STAND_SIDE, angleBetween, both, point } from "../engine/helpers.js";

const HAND = [108, 144];
const NECK = [108, 103]; // shoulders straight above the hands

// Torso pointing up-right from the hips to the shoulders.
function body(torso, head) {
  const hip = point(NECK, 32, torso + 180);
  const ankle = [22, 140];
  return {
    torso,
    head,
    ...both("arm", 180),
    ...both("forearm", 180),
    // legs long and straight to the ankles, tops of the feet down
    ...both("thigh", angleBetween(hip, ankle)),
    ...both("shin", angleBetween(hip, ankle)),
    ...both("foot", 255),
  };
}

export default {
  view: "side",
  root: "handR",
  at: HAND,
  lengths: { footL: 8, footR: 8 },

  start: { ...STAND_SIDE, ...body(57, 60) },

  poses: {
    inhale: body(50, 40),
  },

  timeline: [
    { to: "inhale", s: 1.6, ease: "slow", say: "Inhalá: abrí el pecho" },
    { to: "inhale", s: 0.6, say: "Hombros lejos de las orejas" },
    { to: "start", s: 1.6, ease: "slow", say: "Exhalá" },
    { to: "start", s: 0.4 },
  ],
};
