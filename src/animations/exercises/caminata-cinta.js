/*
 * Caminata en cinta
 * Side view, facing right, brisk walk on a treadmill (same machine as the
 * jog). The hip is the fixed point (it dips a little when both feet are
 * down); the legs go through four moments of the stride (mid-stance,
 * toe-off, knee coming through, heel strike), each leg half a cycle
 * behind the other. One foot is always on the belt, the knee lift is
 * small, the arms swing almost straight and the torso stays upright.
 * Cues shown: long step with loose arms, conversational pace.
 * Simplification: the floor line sits on the belt's top edge (y 140), so
 * the feet contact at y 136 and a planted foot travels BACK on the belt
 * between poses, the way a treadmill drags it.
 */
import { STAND_SIDE, ankleFor, leg } from "../engine/helpers.js";

const HIP = [76, 78]; // hip over the straight stance leg (the root)
const HIP_LOW = [76, 80]; // a little lower when both feet are on the belt
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const BELT_Y = 136; // where a flat foot rests on the belt

// The four moments of one leg. Each takes the hip of its pose.
const stance = (side, hip) => ({ ...leg(side, hip, [70, BELT_Y - 1]), [`foot${side}`]: 90 });
const toeOff = (side, hip) => ({ ...leg(side, hip, ankleFor([54, BELT_Y - 0.5], 112)), [`foot${side}`]: 112 });
const swing = (side) => ({ [`thigh${side}`]: 160, [`shin${side}`]: 225, [`foot${side}`]: 110 });
const heelStrike = (side, hip) => ({ ...leg(side, hip, [94, BELT_Y]), [`foot${side}`]: 75 });

// Arms almost straight (elbows bent about 20 degrees), swinging from the shoulder.
const arms = (near, far) => ({ armR: near, forearmR: near - 20, armL: far, forearmL: far - 20 });

export default {
  view: "side",
  root: "hip",
  at: HIP,
  floor: 140,

  // near foot flat under the hip, far knee coming through
  start: {
    ...STAND_SIDE,
    torso: 0,
    head: 2,
    ...stance("R", HIP),
    ...swing("L"),
    ...arms(180, 180),
  },

  poses: {
    // near toes pushing off behind, far heel landing ahead
    pushoff: {
      $root: off(HIP_LOW),
      ...toeOff("R", HIP_LOW),
      ...heelStrike("L", HIP_LOW),
      ...arms(165, 195),
    },
    // mirror of start: far foot flat, near knee coming through
    midswing: {
      ...swing("R"),
      ...stance("L", HIP),
      ...arms(180, 180),
    },
    // mirror of pushoff: near heel landing, far toes pushing off
    contact2: {
      $root: off(HIP_LOW),
      ...heelStrike("R", HIP_LOW),
      ...toeOff("L", HIP_LOW),
      ...arms(195, 165),
    },
  },

  timeline: [
    { to: "pushoff", s: 0.45, ease: "linear", say: "Paso largo, brazos sueltos" },
    { to: "midswing", s: 0.45, ease: "linear", say: "Paso largo, brazos sueltos" },
    { to: "contact2", s: 0.45, ease: "linear", say: "Ritmo de conversación" },
    { to: "start", s: 0.45, ease: "linear", say: "Ritmo de conversación" },
  ],

  props: [
    // treadmill: belt, front post, console and handrail
    { kind: "rect", x: 30, y: 140, w: 100, h: 6, fill: true },
    { kind: "line", from: [126, 140], to: [126, 60] },
    { kind: "rect", x: 116, y: 52, w: 22, h: 8 },
    { kind: "line", from: [126, 78], to: [100, 78] },
  ],
};
