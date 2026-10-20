/*
 * Flexiones de brazos al fallo
 * Side view, head to the right. The body stays one straight line from the
 * ankles to the neck and pivots on the toes; the hands stay flat on the
 * floor. Three reps: two normal ones (down ~0.7 s, up ~0.5 s) and a last
 * slow, grinding one (down ~0.9 s, up ~1.4 s with a sticking point a third
 * of the way up), to show "al fallo".
 *
 * Root: the near ELBOW, moved per pose with $root. Rooting at the hand or
 * the toe made the other end drift ~4 units mid-rep (a folding arm does not
 * interpolate linearly); from the elbow the drift splits into ~1 unit at
 * the hand and ~2 at the toes, which reads as solid.
 */
import { STAND_SIDE, ankleFor, arm, both, point } from "../engine/helpers.js";

const TOE = [22, 144];
const HAND = [104, 144]; // near hand flat on the floor, under the shoulder at the top
const HAND_FAR = [102, 144]; // far hand a little behind, so both arms show

/*
 * The whole plank for a body tilt (90 = flat). Legs and torso share one
 * line, the foot stays roughly square to it, and both arms are aimed at
 * their fixed spots on the floor (elbows bend back, toward the feet).
 */
function plank(body) {
  const foot = body + 85;
  const ankle = ankleFor(TOE, foot);
  const neck = point(ankle, 92, body); // shin 30 + thigh 30 + torso 32
  return {
    torso: body,
    ...both("thigh", body + 180),
    ...both("shin", body + 180),
    ...both("foot", foot),
    ...arm("R", neck, HAND, "back"),
    ...arm("L", neck, HAND_FAR, "back"),
  };
}

// Where the near elbow is in a pose (one forearm back from the hand).
const elbowOf = (pose) => point(HAND, 20, pose.forearmR + 180);

const TOP = plank(71); // arms straight
const ELBOW_TOP = elbowOf(TOP);

// A pose for a body tilt, with the root shift that keeps hands and toes put.
function at(body) {
  const pose = plank(body);
  const e = elbowOf(pose);
  return { ...pose, $root: [e[0] - ELBOW_TOP[0], e[1] - ELBOW_TOP[1]] };
}

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW_TOP,

  start: {
    ...STAND_SIDE,
    ...TOP,
    head: 81, // looking at the floor a bit ahead of the hands
  },

  poses: {
    bottom: at(86), // chest almost on the floor
    grind: at(81), // last rep: stuck a third of the way up
  },

  timeline: [
    { to: "bottom", s: 0.7, say: "Bajá casi al piso" },
    { to: "start", s: 0.5, say: "Empujá" },
    { to: "bottom", s: 0.7, say: "Bajá casi al piso" },
    { to: "start", s: 0.5, say: "Empujá" },
    { to: "bottom", s: 0.9, ease: "slow", say: "Última: al fallo" },
    { to: "grind", s: 0.8, ease: "linear", say: "Última: al fallo" },
    { to: "start", s: 0.6, ease: "slow", say: "Última: al fallo" },
  ],
};
