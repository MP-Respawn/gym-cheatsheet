/*
 * Caminata del granjero
 * Side view, facing right, walking tall with a heavy dumbbell hanging in
 * each hand. The hip is the root (it dips a little when both feet are
 * down) and the legs go through four moments of a short stride: stance,
 * toe-off, knee coming through, heel strike, each leg half a cycle behind
 * the other. The torso and head stay upright and the arms hang straight
 * down and still: the weights do not swing.
 * Simplification: the walk happens in place, so the planted foot slides
 * back under the body between poses, like on a treadmill.
 */
import { STAND_SIDE, ankleFor, leg } from "../engine/helpers.js";

const HIP = [76, 86]; // hip over the stance leg (the root)
const HIP_LOW = [76, 88]; // a little lower when both feet are down
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const Y = 144; // feet on the floor

// The four moments of one leg, short steps. Each takes the hip of its pose.
const stance = (side, hip) => ({ ...leg(side, hip, [72, Y - 1]), [`foot${side}`]: 90 });
const toeOff = (side, hip) => ({ ...leg(side, hip, ankleFor([58, Y - 0.5], 112)), [`foot${side}`]: 112 });
const swing = (side) => ({ [`thigh${side}`]: 165, [`shin${side}`]: 220, [`foot${side}`]: 100 });
const heelStrike = (side, hip) => ({ ...leg(side, hip, [90, Y]), [`foot${side}`]: 75 });

export default {
  view: "side",
  root: "hip",
  at: HIP,

  // near foot flat under the hip, far knee coming through
  start: {
    ...STAND_SIDE,
    torso: 0,
    head: 0,
    ...stance("R", HIP),
    ...swing("L"),
    // arms straight down; the far one a hair behind so both weights show
    armL: 177,
    forearmL: 177,
  },

  // The arms are never mentioned again: they hang from the (still) torso.
  poses: {
    // near toes pushing off behind, far heel landing ahead
    pushoff: {
      $root: off(HIP_LOW),
      ...toeOff("R", HIP_LOW),
      ...heelStrike("L", HIP_LOW),
    },
    // mirror of start: far foot flat, near knee coming through
    midswing: {
      ...swing("R"),
      ...stance("L", HIP),
    },
    // mirror of pushoff: near heel landing, far toes pushing off
    contact2: {
      $root: off(HIP_LOW),
      ...heelStrike("R", HIP_LOW),
      ...toeOff("L", HIP_LOW),
    },
  },

  timeline: [
    { to: "pushoff", s: 0.45, ease: "linear", say: "Hombros atrás y abajo, pecho arriba" },
    { to: "midswing", s: 0.45, ease: "linear", say: "Pasos cortos y parejos" },
    { to: "contact2", s: 0.45, ease: "linear", say: "Abdomen apretado" },
    { to: "start", s: 0.45, ease: "linear", say: "Pasos cortos y parejos" },
  ],

  props: [
    // a heavy dumbbell (seen end-on) in each hand, with its short handle
    { kind: "disc", on: "forearmL", r: 6 },
    { kind: "line", on: "forearmL", from: [-4, 0], to: [4, 0] },
    { kind: "disc", on: "forearmR", r: 6 },
    { kind: "line", on: "forearmR", from: [-4, 0], to: [4, 0] },
  ],
};
