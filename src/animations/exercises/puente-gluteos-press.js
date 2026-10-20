/*
 * Puente de glúteos + press plano con mancuernas
 * Side view, head to the left, upper back on the end of a bench, feet flat
 * on the floor. The neck/shoulders on the bench are the fixed point.
 * From hips low with the dumbbells at the chest, the hips drive up to a
 * flat bridge AND both arms press the dumbbells up at the same time, fast
 * ("puente y empuje juntos"). Short hold, then everything comes down
 * together as slowly as possible.
 */
import { STAND_SIDE, angleBetween, arm, both, leg, point } from "../engine/helpers.js";

const NECK = [44, 110]; // shoulders on the end of the bench
const ANKLE = [106, 144];
const ANKLE_FAR = [102, 144];

// Hips placed on a circle of torso length around the neck.
const HIP_LOW = point(NECK, 32, 128); // sagging toward the floor
const HIP_UP = point(NECK, 32, 92); // torso and thighs in one flat line

// Dumbbells straight above the shoulders on top.
const HANDS_UP = [47, 70];

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: {
    ...STAND_SIDE,
    torso: angleBetween(HIP_LOW, NECK),
    head: 280,
    ...leg("R", HIP_LOW, ANKLE, "up"),
    ...leg("L", HIP_LOW, ANKLE_FAR, "up"),
    ...both("foot", 90),
    // dumbbells at the chest: elbows down past the end of the bench,
    // forearms vertical
    armR: 150,
    forearmR: 6,
    armL: 153,
    forearmL: 4,
  },

  poses: {
    top: {
      torso: angleBetween(HIP_UP, NECK),
      head: 280,
      ...leg("R", HIP_UP, ANKLE, "up"),
      ...leg("L", HIP_UP, ANKLE_FAR, "up"),
      ...both("foot", 90), // feet stay flat
      ...arm("R", NECK, HANDS_UP, "fwd"),
      ...arm("L", NECK, [HANDS_UP[0] - 2, HANDS_UP[1]], "fwd"),
    },
  },

  timeline: [
    { to: "top", s: 0.6, ease: "fast", say: "Puente y empuje juntos" },
    { to: "top", s: 0.4, say: "Puente y empuje juntos" },
    { to: "start", s: 1.4, ease: "slow", say: "Bajada lenta y controlada" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // bench: pad and two legs
    { kind: "rect", x: 4, y: 114, w: 44, h: 7 },
    { kind: "line", from: [10, 121], to: [10, 148] },
    { kind: "line", from: [40, 121], to: [40, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
