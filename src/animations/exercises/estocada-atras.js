/*
 * Estocada hacia atrás
 * Side view, facing right, a dumbbell hanging in each hand. The near leg
 * stays planted in front as the working leg; the far leg takes a long step
 * BACK (foot in the air mid-step, then planted on its toes), the body drops
 * straight down until the back knee is just above the floor, rises pushing
 * through the front heel, and the back foot comes back to standing.
 * Cues shown: long step back, torso tall on the way down, drive through the
 * front heel.
 * Simplification: a real reverse lunge alternates legs; here the same far
 * leg steps back every rep so the near (working) leg reads clearly.
 *
 * The front foot never slides, but the back foot travels and the hips move,
 * so the root is the hip, moved per pose with $root, and both legs reach
 * for fixed points on the floor with leg().
 */
import { STAND_SIDE, angleBetween, ankleFor, both, leg } from "../engine/helpers.js";

const HIP = [84, 84]; // standing hip (the root)

// The front (near) foot never moves: its ankle stays here the whole time.
const FRONT_ANKLE = [86, 144];
const FRONT_ANKLE_STAND = [86, 144];
const BACK_ANKLE_STAND = [82, 144];

// The back (far) foot: lifted mid-step, then planted on its toes behind.
const BACK_TOE = [34, 144];
const BACK_ANKLE_AIR = [46, 126];
const BACK_ANKLE_TOES = ankleFor(BACK_TOE, 140); // heel up, on the toes
const BACK_FOOT_TOES = angleBetween(BACK_ANKLE_TOES, BACK_TOE);

// Hip positions for each pose (absolute), converted to $root offsets.
const HIP_STEP = [78, 86];
const HIP_HALF = [66, 98]; // halfway down (keeps the feet from dipping mid-move)
const HIP_LOW = [60, 108]; // front shin vertical, back knee just off the floor
const HIP_UP = [64, 92];
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Arms hang straight down with the dumbbells, whatever the torso does.
const ARMS_DOWN = { ...both("arm", 180), ...both("forearm", 180) };

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP, FRONT_ANKLE_STAND),
    ...leg("L", HIP, BACK_ANKLE_STAND),
    armL: 176, // far arm a little behind so both dumbbells show
    forearmL: 176,
  },

  poses: {
    // long step back: far foot in the air behind, front foot planted
    step: {
      $root: off(HIP_STEP),
      ...leg("R", HIP_STEP, FRONT_ANKLE),
      ...leg("L", HIP_STEP, BACK_ANKLE_AIR),
      footR: 90,
      footL: 130, // toes down, about to land on the ball of the foot
      torso: 3,
      ...ARMS_DOWN,
    },
    // halfway down or up: back foot on its toes, hips dropping straight
    half: {
      $root: off(HIP_HALF),
      ...leg("R", HIP_HALF, FRONT_ANKLE),
      ...leg("L", HIP_HALF, BACK_ANKLE_TOES, "down"),
      footR: 90,
      footL: BACK_FOOT_TOES,
      torso: 4,
      ...ARMS_DOWN,
    },
    // bottom: front shin vertical (knee over the ankle), back knee just
    // above the floor, back foot on its toes
    low: {
      $root: off(HIP_LOW),
      ...leg("R", HIP_LOW, FRONT_ANKLE),
      ...leg("L", HIP_LOW, BACK_ANKLE_TOES, "down"),
      footR: 90,
      footL: BACK_FOOT_TOES,
      torso: 4, // torso tall
      ...ARMS_DOWN,
    },
    // back up, still in the long stance
    up: {
      $root: off(HIP_UP),
      ...leg("R", HIP_UP, FRONT_ANKLE),
      ...leg("L", HIP_UP, BACK_ANKLE_TOES, "down"),
      footR: 90,
      footL: BACK_FOOT_TOES,
      torso: 2,
      ...ARMS_DOWN,
    },
  },

  timeline: [
    { to: "step", s: 0.5, say: "Paso largo hacia atrás" },
    // down and up pass through "half" so the feet stay on the floor;
    // linear easing keeps the speed even across both halves
    { to: "half", s: 0.6, ease: "linear", say: "Bajá derecho" },
    { to: "low", s: 0.6, ease: "linear", say: "Bajá derecho" },
    { to: "half", s: 0.5, ease: "linear", say: "Empujá con el talón de adelante" },
    { to: "up", s: 0.5, ease: "linear", say: "Empujá con el talón de adelante" },
    { to: "step", s: 0.5 }, // the back foot comes forward
    { to: "start", s: 0.4 },
  ],

  props: [
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
