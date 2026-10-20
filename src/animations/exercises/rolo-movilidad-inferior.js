/*
 * Rolo + movilidad articular de tren inferior
 * Side view, head to the right. Face down on the forearms with a foam
 * roller under the thighs (quads). The body slides slowly back and forth
 * over the roller, two passes from near the hip to near the knee, while the
 * forearms stay planted (the upper arms rock over the elbows). Then a short
 * mobility block on the roller: the near knee bends (heel toward the glute)
 * and straightens. The roller itself stays put (a real one would roll a
 * bit). The near elbow is the fixed point.
 */
import { STAND_SIDE, angleBetween, both, point } from "../engine/helpers.js";

const ELBOW = [118, 141];
const ROLLER = [70, 140]; // center of the roller, radius 7
const CONTACT = [70, 129.5]; // where the thigh line rests on top of it

/*
 * Whole-body pose for one tilt of the upper arm over the elbow (degrees
 * from vertical, + = shoulders forward). The body is one straight line
 * from the shoulders over the roller; the lower legs float a little up.
 */
function slide(tilt) {
  const shoulder = point(ELBOW, 21, tilt); // elbow -> shoulder
  const line = angleBetween(shoulder, CONTACT); // shoulder -> hips -> knees
  return {
    ...both("arm", tilt + 180), // shoulder -> elbow
    ...both("forearm", 90), // forearms flat on the floor
    torso: line + 180,
    head: line + 180 - 8, // looking down and ahead
    ...both("thigh", line),
    shinR: line + 22,
    shinL: line + 18,
    ...both("foot", line - 15), // toes pointed back, toward the floor
  };
}

const MID = slide(0);

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW,

  start: { ...STAND_SIDE, ...MID },

  poses: {
    toKnee: slide(28), // body forward: the roller ends near the knees
    toHip: slide(-28), // body back: the roller ends near the hips
    kneeBent: { ...MID, shinR: 12, footR: 330 }, // heel toward the glute
  },

  timeline: [
    { to: "toKnee", s: 0.9, ease: "slow", say: "Rolo lento, ida y vuelta" },
    { to: "toHip", s: 1.2, ease: "slow", say: "Rolo lento, ida y vuelta" },
    { to: "toKnee", s: 1.2, ease: "slow", say: "Rolo lento, ida y vuelta" },
    { to: "start", s: 0.7 },
    { to: "kneeBent", s: 0.6, say: "Movilidad de rodilla" },
    { to: "start", s: 0.6, say: "Movilidad de rodilla" },
  ],

  props: [
    // foam roller, resting on the floor under the thighs
    { kind: "disc", c: ROLLER, r: 7 },
  ],
};
