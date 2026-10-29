/*
 * Boxeo de sombra
 * Side view, facing right, in a boxing stance: the near (lead) foot ahead
 * and flat, the far (rear) foot behind on the ball of the foot, knees soft,
 * torso almost upright. Guard: both fists up by the chin with the elbows
 * down. A jab with the lead (near) arm, back to the guard, a cross with
 * the rear (far) arm as the torso turns forward and the rear heel pivots,
 * back to the guard, and a small bounce on the toes.
 * Cues shown: jab, cross, back to the guard, stay on the toes.
 * Simplification: the hips shift forward a few units with each punch
 * instead of rotating; the feet keep their spots (the rear heel just
 * lifts), reached with leg() from the moving hip.
 */
import { STAND_SIDE, ankleFor, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [80, 91]; // the root
const TORSO = 5;
const NEAR_TOE = [106, 144];
const FAR_TOE = [78, 144]; // rear foot on the ball: the toe stays, the heel lifts

const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Legs for a hip position and both foot angles (the toes never move).
function legs(hip, nearFoot, farFoot) {
  return {
    ...leg("R", hip, ankleFor(NEAR_TOE, nearFoot)),
    ...leg("L", hip, ankleFor(FAR_TOE, farFoot)),
    footR: nearFoot,
    footL: farFoot,
  };
}

// Guard fists, relative to the neck: just in front of and below the chin.
const guardNear = (neck) => arm("R", neck, [neck[0] + 9, neck[1] - 3], "down");
const guardFar = (neck) => arm("L", neck, [neck[0] + 5, neck[1] - 1], "down");

const NECK = neckFrom(HIP, TORSO);

const JAB_HIP = [83, 91];
const JAB_NECK = neckFrom(JAB_HIP, TORSO);

const CROSS_HIP = [85, 91];
const CROSS_TORSO = 12;
const CROSS_NECK = neckFrom(CROSS_HIP, CROSS_TORSO);

const BOUNCE_HIP = [80, 89];
const BOUNCE_NECK = neckFrom(BOUNCE_HIP, TORSO);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 8, // chin tucked a little
    ...legs(HIP, 90, 115),
    ...guardNear(NECK),
    ...guardFar(NECK),
  },

  poses: {
    // lead arm straight forward at shoulder height, rear fist stays up
    jab: {
      $root: off(JAB_HIP),
      ...legs(JAB_HIP, 90, 118),
      ...arm("R", JAB_NECK, [128, 58], "down"),
      ...guardFar(JAB_NECK),
    },
    // rear arm straight forward as the torso turns in, lead fist back up
    cross: {
      $root: off(CROSS_HIP),
      torso: CROSS_TORSO,
      ...legs(CROSS_HIP, 90, 130),
      ...arm("L", CROSS_NECK, [130, 60], "down"),
      ...guardNear(CROSS_NECK),
    },
    // a light hop: both heels up, guard unchanged
    bounce: {
      $root: off(BOUNCE_HIP),
      ...legs(BOUNCE_HIP, 100, 120),
      ...guardNear(BOUNCE_NECK),
      ...guardFar(BOUNCE_NECK),
    },
  },

  timeline: [
    { to: "jab", s: 0.2, ease: "fast", say: "Jab" },
    { to: "start", s: 0.25, say: "Volvé a la guardia" },
    { to: "cross", s: 0.22, ease: "fast", say: "Cruzado" },
    { to: "start", s: 0.3, say: "Volvé a la guardia" },
    { to: "bounce", s: 0.3, say: "Movete en la punta de los pies" },
    { to: "start", s: 0.3, say: "Movete en la punta de los pies" },
  ],
};
