/*
 * Escaladores
 * Side view, head to the right, in a high plank: hands flat on the floor
 * under the shoulders, arms straight, one line from the shoulders to the
 * toes. One knee drives in under the chest (foot off the floor) while the
 * other leg stays long on its toes, then they swap fast. The hips stay low
 * and level the whole time.
 * Cues shown: knee to the chest, quick switch, hips low and still.
 *
 * Root: the near ELBOW, as in the push-up file. The arms and the torso
 * never change, so the hands and the hips stay exactly put and only the
 * legs move.
 */
import { STAND_SIDE, ankleFor, arm, both, leg, point } from "../engine/helpers.js";

const TOE = [30, 144];
const HAND = [112, 144]; // near hand flat on the floor, under the shoulder
const HAND_FAR = [110, 144]; // far hand a little behind, so both arms show

// The plank line (90 = flat): legs and torso share one line, the foot sits
// roughly square to it, and both arms reach straight down to the hands.
const BODY = 71;
const FOOT_PLANK = BODY + 85;
const LEG_PLANK = BODY + 180;
const ANKLE = ankleFor(TOE, FOOT_PLANK);
const HIP = point(ANKLE, 60, BODY); // shin 30 + thigh 30
const NECK = point(HIP, 32, BODY);

const ARMS = { ...arm("R", NECK, HAND, "back"), ...arm("L", NECK, HAND_FAR, "back") };
const ELBOW = point(HAND, 20, ARMS.forearmR + 180);

// The knee that drives in: thigh forward under the chest, foot hanging
// behind the knee, toes pointing down just above the floor.
const ANKLE_IN = [80, 128];
const kneeIn = (side) => ({ ...leg(side, HIP, ANKLE_IN, "fwd"), [`foot${side}`]: 165 });
const legLong = (side) => ({ [`thigh${side}`]: LEG_PLANK, [`shin${side}`]: LEG_PLANK, [`foot${side}`]: FOOT_PLANK });

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW,

  start: {
    ...STAND_SIDE,
    torso: BODY,
    head: 81, // looking at the floor a bit ahead of the hands
    ...both("thigh", LEG_PLANK),
    ...both("shin", LEG_PLANK),
    ...both("foot", FOOT_PLANK),
    ...ARMS,
  },

  poses: {
    nearKnee: { ...kneeIn("R"), ...legLong("L") },
    farKnee: { ...kneeIn("L"), ...legLong("R") },
  },

  timeline: [
    { to: "nearKnee", s: 0.35, say: "Rodilla al pecho" },
    { to: "farKnee", s: 0.45, say: "Cambiá rápido" },
    { to: "nearKnee", s: 0.45, say: "Cambiá rápido" },
    { to: "farKnee", s: 0.45, say: "Cadera baja y quieta" },
    { to: "start", s: 0.4, say: "Cadera baja y quieta" },
    { to: "start", s: 0.3 },
  ],
};
