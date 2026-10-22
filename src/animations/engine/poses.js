/*
 * poses.js
 *
 * Ground-movement base positions shared by the Animal Flow animations (and
 * reused by the Jiu Jitsu crawls), so every file draws the same beast,
 * crab and ape. All side view, in the 160 x 160 box, floor contact y = 144.
 *
 *   BEAST  on hands and toes, knees hovering just off the floor, hips over
 *          the knees, hands under the shoulders. Faces right.
 *   CRAB   face up, hands on the floor behind (on the head side), feet
 *          planted in front, hips hovering. Head to the LEFT, feet right.
 *   APE    deep squat with the heels down, hands on the floor in front of
 *          the feet, chest up. Faces right.
 *
 * quad() turns "where the hips, hands and feet are" into segment angles
 * with the two-segment reach helpers, so a file only has to say where
 * things go: a hand lifted 10 higher, the hips shifted back...
 *
 * rollPose() draws rolls (Jiu Jitsu): the body tucked into a ball that
 * turns around its own center while it travels along the floor.
 */
import { arm, leg, neckFrom, point } from "./helpers.js";

// Beast: knees 5 above the floor (y 136), hips 30 above them.
export const BEAST = {
  hip: [66, 106],
  torso: 84.6, // shoulders a little higher than the hips
  hands: [98, 144],
  ankles: [36, 137],
  foot: 225, // on the toes, heels up
};

// Crab: hips 16 off the floor, head to the left.
export const CRAB = {
  hip: [80, 128],
  torso: 307, // up and to the left, toward the hands
  hands: [42, 144],
  ankles: [116, 144],
  foot: 90, // feet flat
};

// Ape: hips just above the heels, chest leaning forward over the hands.
export const APE = {
  hip: [58, 128],
  torso: 50,
  hands: [100, 144],
  ankles: [70, 144],
  foot: 90,
};

/*
 * Angles for a body on hands and feet. Every point is absolute; `base` is
 * the spec's `at` (its root, the hips) so the hips can move between poses.
 *   hip, torso       where the hips are and the trunk's angle
 *   handR, handL     where each hand is (R = near, L = far)
 *   ankleR, ankleL   where each ankle is
 *   footR, footL     foot angles
 *   knees, elbows    which way they bend ("down", "up", "fwd", "back")
 *   head             head angle (defaults to following the trunk)
 */
export function quad({
  base,
  hip,
  torso,
  head = torso,
  handR,
  handL,
  ankleR,
  ankleL,
  footR,
  footL,
  knees = "down",
  elbows = "back",
  kneesL = knees,
  elbowsL = elbows,
}) {
  const neck = neckFrom(hip, torso);
  return {
    $root: [hip[0] - base[0], hip[1] - base[1]],
    torso,
    head,
    ...arm("R", neck, handR, elbows),
    ...arm("L", neck, handL, elbowsL),
    ...leg("R", hip, ankleR, knees),
    ...leg("L", hip, ankleL, kneesL),
    footR,
    footL,
  };
}

// A quad() pose used as a spec's start pose: the start pose has no $root
// (its hips are the spec's `at`).
export function asStart(pose) {
  const { $root: _ignored, ...angles } = pose;
  return angles;
}

// A point moved by [dx, dy].
export function shift(p, dx, dy = 0) {
  return [p[0] + dx, p[1] + dy];
}

// The far limb drawn a hair behind the near one so both show.
export const FAR = -3;

/* ---- Rolls ---- */

// Head drawn as a circle of this radius at the head joint (kinematics.js).
const HEAD_RADIUS = 9;

// The joints of a side-view pose, measured from the hips at [0, 0].
function jointsOf(a) {
  const hip = [0, 0];
  const neck = point(hip, 32, a.torso);
  const out = [hip, neck, point(neck, 15, a.head)];
  for (const side of ["R", "L"]) {
    const elbow = point(neck, 21, a[`arm${side}`]);
    const knee = point(hip, 30, a[`thigh${side}`]);
    const ankle = point(knee, 30, a[`shin${side}`]);
    out.push(elbow, point(elbow, 20, a[`forearm${side}`]), knee, ankle, point(ankle, 12, a[`foot${side}`]));
  }
  return out;
}

/*
 * The ball a tucked pose makes: its center (from the hips) and its radius
 * (the farthest joint, the head counting its circle).
 */
export function tuckBall(tuck) {
  const pts = jointsOf(tuck);
  const center = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const radius = Math.max(
    ...pts.map((p, i) => Math.hypot(p[0] - center[0], p[1] - center[1]) + (i === 2 ? HEAD_RADIUS : 0)),
  );
  return { center, radius };
}

/*
 * The tucked pose `tuck` (every segment angle, side view) turned by `turn`
 * degrees (clockwise: a forward roll for a figure facing right), with the
 * ball's center at x and the ball resting on the floor. `base` is the
 * spec's `at` (the hips of its start pose).
 */
export function rollPose({ base, tuck, turn, x }) {
  const { center, radius } = tuckBall(tuck);
  const cy = 145.5 - radius; // the lowest point just touches the floor
  // where the hips go: the center plus the turned hip-from-center vector
  const t = (turn * Math.PI) / 180;
  const v = [-center[0], -center[1]];
  const hip = [x + v[0] * Math.cos(t) - v[1] * Math.sin(t), cy + v[0] * Math.sin(t) + v[1] * Math.cos(t)];
  const angles = Object.fromEntries(Object.entries(tuck).map(([k, a]) => [k, a + turn]));
  return { ...angles, $root: [hip[0] - base[0], hip[1] - base[1]] };
}

/*
 * A roll across the box and back, as a spec: the tucked ball rolls one full
 * turn in its direction (forward = 1: clockwise, traveling right; backward
 * = -1: counterclockwise, traveling left), pauses where it lands, then rolls
 * back to where it started, so the loop closes in place. Eight steps per
 * turn keep the ball round. `say` holds the three labels: { go, land, back }.
 */
export function rollAcross({ tuck, direction, say }) {
  const STEPS = 8;
  const { radius } = tuckBall(tuck);
  const left = radius + 4;
  const right = 160 - radius - 4;
  const x0 = direction > 0 ? left : right;
  const dx = ((right - left) / STEPS) * direction;
  const placed = (base, k) => rollPose({ base, tuck, turn: k * (360 / STEPS) * direction, x: x0 + k * dx });
  const at = placed([0, 0], 0).$root;
  const poses = Object.fromEntries(Array.from({ length: STEPS }, (_, i) => [`r${i + 1}`, placed(at, i + 1)]));
  const go = Array.from({ length: STEPS }, (_, i) => ({ to: `r${i + 1}`, s: 0.17, ease: "linear", say: say.go }));
  const back = Array.from({ length: STEPS }, (_, i) => ({
    to: i === STEPS - 1 ? "start" : `r${STEPS - 1 - i}`,
    s: 0.19,
    ease: "linear",
    say: say.back,
  }));
  return {
    root: "hip",
    at,
    start: tuck,
    poses,
    timeline: [...go, { to: `r${STEPS}`, s: 0.5, say: say.land }, ...back, { to: "start", s: 0.5 }],
  };
}

/* ---- Seen from above ---- */

/*
 * Front-view poses drawn upright (head up) turned by `deg` degrees, for
 * figures seen from above: turned -90, someone lying on the floor reads as
 * lying (head left, feet right) instead of standing. $root is left as is.
 */
export function turnPose(pose, deg) {
  return Object.fromEntries(Object.entries(pose).map(([k, a]) => [k, k === "$root" ? a : a + deg]));
}

// A mat seen from above, behind a lying figure (head at the left edge).
export const MAT = { kind: "rect", x: 10, y: 50, w: 140, h: 60, rx: 6, layer: "back" };
