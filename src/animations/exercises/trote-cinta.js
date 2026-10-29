/*
 * Trote en cinta
 * Side view, facing right, jogging on a treadmill: belt under the feet,
 * a front post with the console and a handrail. The hip is the fixed
 * point (it only bobs a little); the legs run through four moments of
 * the stride (stance, toe-off, heel tucked mid-swing, landing), each leg
 * half a cycle behind the other, and the arms swing bent at 90 degrees
 * against the legs. Torso a hair forward, eyes ahead.
 * Cues shown: short quick steps, torso tall with loose shoulders.
 * Simplification: the floor line sits on the belt's top edge (y 140), so
 * the feet contact at y 136 and a planted foot travels BACK on the belt
 * between poses, the way a treadmill drags it.
 */
import { STAND_SIDE, ankleFor, leg } from "../engine/helpers.js";

const HIP = [76, 82]; // hip in mid-stance (the root)
const HIP_UP = [76, 80]; // a little higher at toe-off / landing
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];
const BELT_Y = 136; // where a flat foot rests on the belt

const TORSO = 6;

// The four moments of one leg. Each takes the hip of its pose. The stance
// ankle sits a hair above the belt so the foot never dips while the leg
// bends on the way from landing to toe-off.
const stance = (side, hip) => ({ ...leg(side, hip, [70, BELT_Y - 1]), [`foot${side}`]: 90 });
const toeOff = (side, hip) => ({ ...leg(side, hip, ankleFor([58, BELT_Y + 0.5], 125)), [`foot${side}`]: 125 });
const swing = (side) => ({ [`thigh${side}`]: 150, [`shin${side}`]: 258, [`foot${side}`]: 130 });
const landing = (side, hip) => ({ ...leg(side, hip, [92, BELT_Y]), [`foot${side}`]: 85 });

// Arms bent at 90 degrees: the upper arm swings, the forearm keeps the bend.
const arms = (near, far) => ({ armR: near, forearmR: near - 90, armL: far, forearmL: far - 90 });

export default {
  view: "side",
  root: "hip",
  at: HIP,
  floor: 140,

  // near foot planted under the hip, far leg tucked and coming through
  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 8,
    ...stance("R", HIP),
    ...swing("L"),
    ...arms(180, 180),
  },

  poses: {
    // near toes leaving the belt behind, far foot landing ahead
    pushoff: {
      $root: off(HIP_UP),
      ...toeOff("R", HIP_UP),
      ...landing("L", HIP_UP),
      ...arms(160, 200),
    },
    // mirror of start: far foot planted, near leg tucked
    flight: {
      ...swing("R"),
      ...stance("L", HIP),
      ...arms(180, 180),
    },
    // mirror of pushoff: near foot landing, far toes leaving
    contact2: {
      $root: off(HIP_UP),
      ...landing("R", HIP_UP),
      ...toeOff("L", HIP_UP),
      ...arms(200, 160),
    },
  },

  timeline: [
    { to: "pushoff", s: 0.3, ease: "linear", say: "Pasos cortos y frecuentes" },
    { to: "flight", s: 0.3, ease: "linear", say: "Pasos cortos y frecuentes" },
    { to: "contact2", s: 0.3, ease: "linear", say: "Torso derecho, hombros sueltos" },
    { to: "start", s: 0.3, ease: "linear", say: "Torso derecho, hombros sueltos" },
  ],

  props: [
    // treadmill: belt, front post, console and handrail
    { kind: "rect", x: 30, y: 140, w: 100, h: 6, fill: true },
    { kind: "line", from: [126, 140], to: [126, 60] },
    { kind: "rect", x: 116, y: 52, w: 22, h: 8 },
    { kind: "line", from: [126, 78], to: [100, 78] },
  ],
};
