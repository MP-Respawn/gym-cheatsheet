/*
 * Desplazamiento de hombros / Shoulder shuffle (Jiu Jitsu)
 * Side view, lying on the back with the head to the left, feet planted and
 * hips up in a bridge. The shoulders walk toward the head one at a time
 * (shown as the trunk and head shifting back in two small steps while the
 * hips stay up), then the feet shuffle to follow; drawn in place, so the
 * last step brings everything back. The feet are the fixed point.
 */
import { STAND_SIDE, both, leg, point } from "../engine/helpers.js";

const ANKLE = [108, 144];

// A bridge with the neck at `neck`: hips 32 from it toward the feet.
function bridge(neck, torsoAngle) {
  const hip = point(neck, 32, torsoAngle + 180);
  return {
    torso: torsoAngle,
    head: 278,
    ...both("arm", 96), // arms along the floor
    ...both("forearm", 92),
    ...leg("R", hip, ANKLE, "up"),
    ...leg("L", hip, [ANKLE[0] - 3, ANKLE[1]], "up"),
    ...both("foot", 90),
  };
}

// Hips high: the trunk slopes down steeply from the hips to the shoulders.
const START = bridge([46, 140], 236);

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: { ...STAND_SIDE, ...START },

  poses: {
    // one shoulder steps back: the trunk lengthens toward the head
    stepA: bridge([42, 139], 238),
    // the other shoulder: a bit further
    stepB: bridge([38, 140], 240),
  },

  timeline: [
    { to: "stepA", s: 0.45, say: "Avanzá un hombro" },
    { to: "stepB", s: 0.45, say: "Después el otro" },
    { to: "start", s: 0.6, say: "Los pies acompañan" },
    { to: "start", s: 0.3 },
  ],
};
