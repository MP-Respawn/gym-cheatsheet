/*
 * Flexiones de rodillas
 * Side view, head to the right. The knees rest on the floor and are the
 * pivot: the body stays one straight line from the knees through the hips
 * to the neck, the shins lie flat on the floor behind with the toes
 * pointing back, and the hands stay flat on the floor under the shoulders.
 * Two normal reps: down ~0.8 s to the chest almost on the floor, up ~0.6 s.
 *
 * Root: the near KNEE, which never moves. Each half rep passes through a
 * midpoint pose: a folding arm does not interpolate linearly, and without
 * it the hands slid ~4 units along the floor mid-rep; with it they stay
 * within about a unit.
 */
import { STAND_SIDE, arm, both, point } from "../engine/helpers.js";

const KNEE = [52, 142]; // knees on the floor
const HAND = [104, 144]; // near hand flat on the floor, under the shoulder at the top
const HAND_FAR = [102, 144]; // far hand a little behind, so both arms show

/*
 * The whole body for a tilt of the knee-to-neck line (90 = flat). Thighs
 * and torso share one line from the knees, the shins and feet lie on the
 * floor pointing back, and both arms are aimed at their fixed spots on the
 * floor (elbows bend back, toward the knees).
 */
function plank(body) {
  const neck = point(KNEE, 62, body); // thigh 30 + torso 32
  return {
    torso: body,
    ...both("thigh", body + 180),
    ...both("shin", 270),
    ...both("foot", 270),
    ...arm("R", neck, HAND, "back"),
    ...arm("L", neck, HAND_FAR, "back"),
  };
}

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: {
    ...STAND_SIDE,
    ...plank(52), // arms straight
    head: 62, // looking at the floor a bit ahead of the hands
  },

  poses: {
    mid: plank(62), // a little above halfway, keeps the hands from sliding
    bottom: plank(76), // chest almost on the floor
  },

  timeline: [
    { to: "mid", s: 0.4, ease: "in", say: "Bajá el pecho casi al piso" },
    { to: "bottom", s: 0.4, ease: "fast", say: "Bajá el pecho casi al piso" },
    { to: "mid", s: 0.3, ease: "in", say: "Empujá" },
    { to: "start", s: 0.3, ease: "fast", say: "Empujá" },
    { to: "mid", s: 0.4, ease: "in", say: "Bajá el pecho casi al piso" },
    { to: "bottom", s: 0.4, ease: "fast", say: "Bajá el pecho casi al piso" },
    { to: "mid", s: 0.3, ease: "in", say: "Empujá" },
    { to: "start", s: 0.3, ease: "fast", say: "Empujá" },
    { to: "start", s: 0.4, say: "Cuerpo en línea de rodillas a cabeza" },
  ],
};
