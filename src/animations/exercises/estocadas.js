/*
 * Estocadas caminando
 * Side view, facing right, a dumbbell hanging in each hand. The near leg
 * takes a long step forward (foot in the air mid-step), the body drops
 * deep and controlled until the back knee nearly touches the floor (back
 * foot on its toes), rises controlled, and the front foot steps back.
 * Cues shown: long stance for stability, front knee stays behind the toes,
 * deep controlled way down and controlled way up.
 * Simplification: a real walking lunge keeps traveling forward; here the
 * front foot steps back so the loop closes in place.
 *
 * Nothing stays fully still (the back heel lifts, the front foot travels),
 * so the root is the hip, moved per pose with $root, and both legs reach
 * for fixed points on the floor with leg().
 */
import { STAND_SIDE, angleBetween, ankleFor, both, leg } from "../engine/helpers.js";

const HIP = [62, 84]; // standing hip (the root)

// The back (far) foot never slides: its toe stays here the whole time.
const BACK_TOE = [72, 144];
const BACK_ANKLE_FLAT = [60, 144];
const BACK_ANKLE_PUSH = ankleFor(BACK_TOE, 105); // heel starts to peel off
const BACK_ANKLE_TOES = ankleFor(BACK_TOE, 140); // heel up, on the toes
const BACK_ANKLE_HALF = ankleFor(BACK_TOE, 120); // heel halfway up

// The front (near) foot: lifted mid-step, then planted a long step ahead.
const FRONT_ANKLE_AIR = [92, 128];
const FRONT_ANKLE = [123, 144];

// Hip positions for each pose (absolute), converted to $root offsets.
const HIP_STEP = [70, 86];
const HIP_HALF = [88, 98]; // halfway down (keeps the feet from dipping mid-move)
const HIP_LOW = [94, 108]; // back knee under the hip, just off the floor
const HIP_UP = [96, 89];
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Arms hang straight down with the dumbbells, whatever the torso does.
const ARMS_DOWN = { ...both("arm", 180), ...both("forearm", 180) };

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...leg("L", HIP, BACK_ANKLE_FLAT),
    ...leg("R", HIP, [63, 144]),
    armL: 176, // far arm a little behind so both dumbbells show
    forearmL: 176,
  },

  poses: {
    // long step: front foot in the air, back heel starting to lift
    step: {
      $root: off(HIP_STEP),
      ...leg("R", HIP_STEP, FRONT_ANKLE_AIR),
      ...leg("L", HIP_STEP, BACK_ANKLE_PUSH),
      footR: 95, // toes slightly down, about to land
      footL: 105,
      torso: 3,
      ...ARMS_DOWN,
    },
    // halfway down or up: front foot planted, back heel lifting
    half: {
      $root: off(HIP_HALF),
      ...leg("R", HIP_HALF, FRONT_ANKLE),
      ...leg("L", HIP_HALF, BACK_ANKLE_HALF, "down"),
      footR: 90,
      footL: 120,
      torso: 4,
      ...ARMS_DOWN,
    },
    // bottom: front shin almost vertical (knee behind the toes),
    // back knee just above the floor, back foot on its toes
    low: {
      $root: off(HIP_LOW),
      ...leg("R", HIP_LOW, FRONT_ANKLE),
      ...leg("L", HIP_LOW, BACK_ANKLE_TOES, "down"),
      footR: 90,
      footL: angleBetween(BACK_ANKLE_TOES, BACK_TOE),
      torso: 4, // torso tall
      ...ARMS_DOWN,
    },
    // back up, still in the long stance
    up: {
      $root: off(HIP_UP),
      ...leg("R", HIP_UP, FRONT_ANKLE),
      ...leg("L", HIP_UP, BACK_ANKLE_TOES, "down"),
      footR: 90,
      footL: angleBetween(BACK_ANKLE_TOES, BACK_TOE),
      torso: 2,
      ...ARMS_DOWN,
    },
  },

  timeline: [
    { to: "step", s: 0.5, say: "Paso largo" },
    // down and up pass through "half" so the feet stay on the floor;
    // linear easing keeps the speed even across both halves
    { to: "half", s: 0.65, ease: "linear", say: "Bajá profundo y controlado" },
    { to: "low", s: 0.65, ease: "linear", say: "Bajá profundo y controlado" },
    { to: "half", s: 0.5, ease: "linear", say: "Subí controlado" },
    { to: "up", s: 0.5, ease: "linear", say: "Subí controlado" },
    { to: "step", s: 0.5 }, // the front foot comes back
    { to: "start", s: 0.4 },
  ],

  props: [
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
