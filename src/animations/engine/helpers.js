/*
 * helpers.js
 *
 * Shortcuts for writing exercise animations (the files in ../exercises/).
 * Everything here is plain math that returns angles or points; nothing draws.
 *
 * Quick reminder of the conventions (more in kinematics.js):
 *   angles: 0 up, 90 right, 180 down, 270 left, clockwise
 *   points: [x, y] in a 160 x 160 box, y grows downward, floor contact y = 144
 *   side view figures face RIGHT; R limbs are the near side, L the far side
 *   front view: R is the limb on the right of the screen, L on the left
 */
import { angleBetween, direction } from "./kinematics.js";

// Angle of the line from point a to point b. Handy to aim a segment at a
// point: torso: angleBetween(hip, shoulder).
export { angleBetween };

// Feet flat on the floor. Feet follow the shin by default (natural when the
// legs are in the air), so poses with planted feet should include this.
export const FEET_FLAT = { footL: 90, footR: 90 };

/* ---- Ready-made start poses ---- */

// Standing, side view, facing right, arms hanging.
export const STAND_SIDE = {
  torso: 0,
  head: 0,
  clavL: 270,
  clavR: 90,
  armL: 180,
  forearmL: 180,
  armR: 180,
  forearmR: 180,
  pelvisL: 270,
  pelvisR: 90,
  thighL: 180,
  shinL: 180,
  footL: 90,
  thighR: 180,
  shinR: 180,
  footR: 90,
};

// Standing, front view, feet a little apart, arms hanging by the sides.
export const STAND_FRONT = {
  torso: 0,
  head: 0,
  clavL: 270,
  clavR: 90,
  armL: 188,
  forearmL: 182,
  armR: 172,
  forearmR: 178,
  pelvisL: 270,
  pelvisR: 90,
  thighL: 186,
  shinL: 181,
  footL: 270,
  thighR: 174,
  shinR: 179,
  footR: 90,
};

/* ---- Points ---- */

// The point `len` units away from `from`, in the direction `angle`.
export function point(from, len, angle) {
  const [dx, dy] = direction(angle);
  return [from[0] + dx * len, from[1] + dy * len];
}

// Where the neck (and, in side view, the shoulders) ends up for a hip
// position and a torso angle.
export function neckFrom(hip, torsoAngle, len = 32) {
  return point(hip, len, torsoAngle);
}

// Where the ankle must be so the toe stays on `toe` with the foot at `angle`.
// Example: a heel raise keeps the toe fixed and tilts the foot.
export function ankleFor(toe, footAngle, len = 12) {
  return point(toe, len, footAngle + 180);
}

/* ---- Two-segment reach (inverse kinematics) ---- */

/*
 * Given the start of a two-segment limb (hip or shoulder), where its end
 * should be (ankle or hand) and the two lengths, returns the angles of both
 * segments. `bend` picks which way the middle joint (knee or elbow) points:
 * "fwd" (to the right), "back" (left), "up" or "down".
 * If the target is too far, the limb is simply stretched straight toward it.
 */
export function reach(from, to, len1, len2, bend = "fwd") {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const d = Math.min(Math.hypot(dx, dy), len1 + len2 - 0.001);
  const base = angleBetween(from, to);
  // Law of cosines: angle between the first segment and the straight line.
  const cos = (len1 * len1 + d * d - len2 * len2) / (2 * len1 * d);
  const offset = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const options = [base + offset, base - offset].map((a1) => {
    const mid = point(from, len1, a1);
    const end = point(from, d, base);
    return { a1, a2: angleBetween(mid, end), mid };
  });
  const pick = {
    fwd: (a, b) => (a.mid[0] >= b.mid[0] ? a : b),
    back: (a, b) => (a.mid[0] <= b.mid[0] ? a : b),
    up: (a, b) => (a.mid[1] <= b.mid[1] ? a : b),
    down: (a, b) => (a.mid[1] >= b.mid[1] ? a : b),
  }[bend];
  const best = pick(options[0], options[1]);
  return [best.a1, best.a2];
}

// Leg angles that put the ankle at `ankle` when the hip joint is at `hip`.
// side = "L" or "R". Example: ...leg("R", [80, 110], [96, 144])
export function leg(side, hip, ankle, bend = "fwd", lengths = [30, 30]) {
  const [a1, a2] = reach(hip, ankle, lengths[0], lengths[1], bend);
  return { [`thigh${side}`]: a1, [`shin${side}`]: a2 };
}

// Arm angles that put the hand at `hand` when the shoulder is at `shoulder`.
export function arm(side, shoulder, hand, bend = "down", lengths = [21, 20]) {
  const [a1, a2] = reach(shoulder, hand, lengths[0], lengths[1], bend);
  return { [`arm${side}`]: a1, [`forearm${side}`]: a2 };
}

/* ---- Symmetry ---- */

// Same angle on both sides: both("arm", 90) -> { armL: 90, armR: 90 }.
export function both(segment, angle) {
  return { [`${segment}L`]: angle, [`${segment}R`]: angle };
}

// Mirrored left/right for FRONT view, where R simply means "the side on the
// right of the screen". The angle is for R; L gets the reflection.
// mirror("arm", 90) -> { armR: 90, armL: 270 } (arms straight out).
export function mirror(segment, angle) {
  return { [`${segment}R`]: angle, [`${segment}L`]: 360 - angle };
}
