/*
 * Abdominal bicicleta
 * Side view, lying on the back with the head to the left, hands behind the
 * head. Shoulders curl up and the legs pedal: one knee is pulled in toward
 * the chest while the opposite elbow drives forward to meet it, and the
 * other leg extends long and low, hovering over the floor. Then they swap.
 * First the near (lighter) elbow meets the far knee, then the far elbow
 * meets the near knee. The hips are the fixed point.
 * Cues shown: elbow to the opposite knee, slow controlled pedaling, the
 * straight leg never touches the floor.
 */
import { STAND_SIDE, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [86, 140];
const NECK = [54, 137]; // where the shoulders rest in the start pose

// Shoulders up, slightly more than a plain crunch.
const TORSO_UP = 308;
const NECK_UP = neckFrom(HIP, TORSO_UP);
const HAND_UP = point(NECK_UP, 13, TORSO_UP + 12); // fingers behind the head

// The leading elbow points forward to the knee; the other one opens back.
const LEAD = (side) => arm(side, NECK_UP, HAND_UP, "fwd");
const STAY = (side) => arm(side, NECK_UP, [HAND_UP[0] - 2, HAND_UP[1] + 1], "up");

// One leg folded in toward the chest, the other long and low.
const KNEE_IN = (side) => ({ [`thigh${side}`]: 340, [`shin${side}`]: 80, [`foot${side}`]: 50 });
const LEG_LONG = (side) => ({ [`thigh${side}`]: 80, [`shin${side}`]: 80, [`foot${side}`]: 55 });

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276,
    head: 280,
    ...leg("R", HIP, [116, 144], "up"),
    ...leg("L", HIP, [112, 144], "up"),
    ...both("foot", 90),
    ...arm("R", NECK, [42, 131], "up"),
    ...arm("L", NECK, [40, 132], "up"),
  },

  poses: {
    // near elbow to the far knee; near leg long
    nearElbow: {
      torso: TORSO_UP,
      head: TORSO_UP + 10,
      ...LEAD("R"),
      ...STAY("L"),
      ...KNEE_IN("L"),
      ...LEG_LONG("R"),
    },
    // far elbow to the near knee; far leg long
    farElbow: {
      torso: TORSO_UP,
      head: TORSO_UP + 10,
      ...LEAD("L"),
      ...STAY("R"),
      ...KNEE_IN("R"),
      ...LEG_LONG("L"),
    },
  },

  timeline: [
    { to: "nearElbow", s: 0.6, say: "Codo a la rodilla contraria" },
    { to: "nearElbow", s: 0.2 },
    { to: "farElbow", s: 0.8, say: "Pedaleá, lento y controlado" },
    { to: "farElbow", s: 0.2 },
    { to: "nearElbow", s: 0.8, say: "Pedaleá, lento y controlado" },
    { to: "start", s: 0.6, ease: "slow", say: "La pierna estirada no toca el piso" },
    { to: "start", s: 0.3 },
  ],
};
