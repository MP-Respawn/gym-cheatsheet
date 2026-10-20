/*
 * Flexión de tobillo con rodilla a la pared
 * Side view, facing right toward a wall. Split stance: the near foot close
 * to the wall, the far leg long behind on the ball of the foot, hands on
 * the wall. The front knee drives forward over the toes until it touches
 * the wall while the front heel stays flat, a short touch, and back. Two
 * reps. The front ankle is the fixed point; the hands stay on the wall.
 * (The cue about the knee not caving in happens toward the camera and
 * cannot be seen from the side.)
 */
import { STAND_SIDE, ankleFor, arm, leg, neckFrom } from "../engine/helpers.js";

const WALL_X = 124;
const ANKLE = [104, 144]; // front foot, toes about 8 units from the wall
const TOE_BACK = [64, 144]; // back foot on the ball of the foot
const ANKLE_BACK = ankleFor(TOE_BACK, 130);

// Hands flat on the wall at chest height.
const HAND_R = [WALL_X - 3, 66];
const HAND_L = [WALL_X - 3, 70];

// Start: shin a little forward. Touch: knee at the wall.
const HIP = [92, 93];
const HIP_TOUCH = [101, 97];
const TORSO = 14; // leaning slightly into the wall
const TORSO_TOUCH = 16;

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO - 6,
    ...leg("R", HIP, ANKLE, "fwd"),
    ...leg("L", HIP, ANKLE_BACK, "fwd"),
    footR: 90,
    footL: 130,
    ...arm("R", neckFrom(HIP, TORSO), HAND_R, "down"),
    ...arm("L", neckFrom(HIP, TORSO), HAND_L, "down"),
  },

  poses: {
    touch: {
      torso: TORSO_TOUCH,
      head: TORSO_TOUCH - 6,
      ...leg("R", HIP_TOUCH, ANKLE, "fwd"),
      ...leg("L", HIP_TOUCH, ANKLE_BACK, "fwd"),
      footR: 90, // front heel stays down
      footL: 130,
      // hands stay on the wall
      ...arm("R", neckFrom(HIP_TOUCH, TORSO_TOUCH), HAND_R, "down"),
      ...arm("L", neckFrom(HIP_TOUCH, TORSO_TOUCH), HAND_L, "down"),
    },
  },

  timeline: [
    { to: "touch", s: 0.9, say: "Rodilla a la pared" },
    { to: "touch", s: 0.4, say: "Talón apoyado" },
    { to: "start", s: 0.8 },
    { to: "touch", s: 0.9, say: "Rodilla a la pared" },
    { to: "touch", s: 0.4, say: "Talón apoyado" },
    { to: "start", s: 0.8 },
  ],

  props: [
    // the wall
    { kind: "line", from: [WALL_X + 2, 14], to: [WALL_X + 2, 148] },
  ],
};
