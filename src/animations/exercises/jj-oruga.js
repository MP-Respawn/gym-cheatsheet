/*
 * Oruga / Inchworm (Jiu Jitsu)
 * Side view, facing right, feet together and planted. From standing, the
 * body folds and the hands reach the floor in front of the feet, then the
 * hands walk forward in two steps out to a plank with the legs straight;
 * then they walk back in to the feet and the body rolls up to standing,
 * so the loop closes in place. The ankles are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom, point } from "../engine/helpers.js";

const ANKLE = [30, 144];

// Legs straight from the ankle at angle a (0 = straight up); the hips land
// 60 away. Trunk at angle t; hands at `hands` (or hanging down if absent).
function worm(a, t, hands) {
  const hip = point(ANKLE, 60, a);
  const neck = neckFrom(hip, t);
  return {
    ...both("thigh", a + 180),
    ...both("shin", a + 180),
    ...both("foot", 90),
    torso: t,
    head: t + (hands ? 10 : 0),
    ...(hands
      ? { ...arm("R", neck, hands, "back"), ...arm("L", neck, [hands[0] - 3, hands[1]], "back") }
      : { ...both("arm", 180), ...both("forearm", 180) }),
  };
}

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: { ...STAND_SIDE, ...worm(1, 0) },

  poses: {
    fold: worm(6, 165, [52, 144]),
    walk: worm(34, 128, [78, 144]),
    plank: worm(62, 94, [108, 144]),
  },

  timeline: [
    { to: "fold", s: 0.9, ease: "slow", say: "Manos al piso, piernas estiradas" },
    { to: "walk", s: 0.6, say: "Caminá con las manos" },
    { to: "plank", s: 0.6, say: "Hasta la plancha" },
    { to: "plank", s: 0.4, say: "Hasta la plancha" },
    { to: "walk", s: 0.6, say: "Volvé caminando" },
    { to: "fold", s: 0.6, say: "Volvé caminando" },
    { to: "start", s: 0.9, ease: "slow", say: "Subí despacio" },
    { to: "start", s: 0.4 },
  ],
};
