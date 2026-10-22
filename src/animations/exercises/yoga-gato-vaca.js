/*
 * Gato y vaca / Marjaryasana / Bitilasana (yoga)
 * Side view, facing right, on four supports: hands under the shoulders,
 * knees under the hips. The back is drawn as one line, so the two shapes
 * show through the trunk and head: cat (exhale) tucks the hips, lifts the
 * mid back and drops the head; cow (inhale) tips the hips, lowers the
 * belly and lifts the head to look ahead. The knees and hands stay planted;
 * the knees are the fixed point.
 */
import { STAND_SIDE, angleBetween, arm, both, neckFrom, point } from "../engine/helpers.js";

const KNEE = [64, 141];
const HANDS = [98, 141];

function pose(thigh, torso, head) {
  const hip = point(KNEE, 30, thigh + 180);
  return {
    ...both("thigh", angleBetween(hip, KNEE)),
    ...both("shin", 270),
    ...both("foot", 270),
    torso,
    head,
    ...arm("R", neckFrom(hip, torso), HANDS, "up"),
    ...arm("L", neckFrom(hip, torso), [HANDS[0] - 3, HANDS[1]], "up"),
  };
}

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: { ...STAND_SIDE, ...pose(180, 72, 80) },

  poses: {
    // cat: hips tuck under, back rises, head hangs down
    cat: pose(186, 70, 150),
    // cow: hips tip back, belly drops, head looks ahead
    cow: pose(174, 78, 45),
  },

  timeline: [
    { to: "cat", s: 1.6, ease: "slow", say: "Exhalá: gato, redondeá" },
    { to: "cat", s: 0.3 },
    { to: "cow", s: 1.8, ease: "slow", say: "Inhalá: vaca, mirá adelante" },
    { to: "cow", s: 0.3 },
    { to: "start", s: 0.9, ease: "slow" },
  ],
};
