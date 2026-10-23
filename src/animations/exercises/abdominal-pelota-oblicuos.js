/*
 * Abdominales en pelota oblicuos (vuelta: abdomen en pelota, paso 2)
 * Same setup as "abdominales en pelota con pies en el suelo": side view,
 * head to the left, lower back on top of the ball, feet flat on the floor,
 * hands behind the head. Each crunch goes diagonally forward: the torso
 * rises a bit further than the straight crunch and one elbow drives toward
 * the opposite knee while the other stays back. First the near (lighter)
 * elbow leads, then the far (darker) one. The hips are the fixed point.
 *
 * Simplification: the twist itself turns toward the camera, so from the
 * side it shows as the leading elbow reaching for the knees.
 */
import { FEET_FLAT, STAND_SIDE, angleBetween, arm, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [84, 112]; // just in front of the ball, about level with its top
const BALL = { c: [66, 127], r: 18 }; // its top touches the lower back

// Lying back over the ball.
const TORSO_DOWN = 280;
const NECK = neckFrom(HIP, TORSO_DOWN);

// Diagonal crunch: a little higher than the straight one (315).
const TORSO_UP = 322;
const NECK_UP = neckFrom(HIP, TORSO_UP);
const HEAD_UP = point(NECK_UP, 15, TORSO_UP + 10); // where the head ends up
const KNEE = [114, 110];

// The leading elbow aims at the knees, its hand still at the head; the other
// elbow opens up and back. Each upper arm points somewhere, and the forearm
// folds back toward the head.
function elbowTo(side, armAngle) {
  const elbow = point(NECK_UP, 21, armAngle);
  return { [`arm${side}`]: armAngle, [`forearm${side}`]: angleBetween(elbow, HEAD_UP) };
}
const LEAD = (side) => elbowTo(side, angleBetween(NECK_UP, KNEE));
const STAY = (side) => elbowTo(side, 300);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO_DOWN,
    head: 286,
    // feet planted, far leg a little behind so both show
    ...leg("R", HIP, [114, 140], "up"),
    ...leg("L", HIP, [110, 140], "up"),
    ...FEET_FLAT,
    // fingers behind the head, elbows open
    ...arm("R", NECK, point(NECK, 13, TORSO_DOWN + 12), "up"),
    ...arm("L", NECK, point(NECK, 13, TORSO_DOWN + 8), "up"),
  },

  poses: {
    nearElbow: { torso: TORSO_UP, head: TORSO_UP + 10, ...LEAD("R"), ...STAY("L") },
    farElbow: { torso: TORSO_UP, head: TORSO_UP + 10, ...LEAD("L"), ...STAY("R") },
  },

  timeline: [
    { to: "nearElbow", s: 0.6, ease: "fast", say: "En diagonal, hombro a la rodilla" },
    { to: "nearElbow", s: 0.2 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "farElbow", s: 0.6, ease: "fast", say: "Al otro lado" },
    { to: "farElbow", s: 0.2 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the ball under the lower back
    { kind: "disc", c: BALL.c, r: BALL.r, layer: "mid" },
  ],
};
