/*
 * Clamshell con banda
 * Lying on the side on the mat, head to the left resting on the bottom
 * arm, torso flat along the floor. Hips and knees bent: thighs forward to
 * the right, lower legs folded back so the feet sit in line with the hips.
 * The hip is the fixed point. The top knee (near leg) opens upward against
 * an elastic band around the knees while the feet stay together, short
 * hold, and closes slower. Two reps.
 * Simplification: the opening really happens toward the ceiling; here the
 * folded top leg swings up in the plane of the drawing around the hip, so
 * the top ankle shifts only about 3 units, still next to the bottom one.
 */
import { STAND_SIDE, arm, leg, point } from "../engine/helpers.js";

const HIP = [86, 130];
const NECK = [54, 130]; // torso flat, pointing left

// Bottom leg (far): knee on the floor in front, foot back under the hips.
const ANKLE_BOTTOM = [84, 138];
const BOTTOM_LEG = leg("L", HIP, ANKLE_BOTTOM, "fwd");
// The band's fixed end: on the bottom thigh just above the knee.
const BAND_ANCHOR = point(HIP, 24, BOTTOM_LEG.thighL);

// Top leg (near): resting on the bottom one, knee a few units higher.
// Opening rotates the whole folded leg 35 degrees around the hip; the
// ankle sits close to the hip, so it barely moves: feet stay together.
const TOP_THIGH = 102;
const TOP_SHIN = 274;
const OPEN = 35;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 270,
    head: 276, // head on the arm
    // bottom arm stretched under the head, top hand resting on the hip
    ...arm("L", NECK, [20, 140], "down"),
    ...arm("R", NECK, [82, 124], "up"),
    ...BOTTOM_LEG,
    thighR: TOP_THIGH,
    shinR: TOP_SHIN,
    footL: 120,
    footR: 112,
  },

  poses: {
    open: {
      thighR: TOP_THIGH - OPEN,
      shinR: TOP_SHIN - OPEN,
    },
  },

  timeline: [
    { to: "open", s: 0.6, say: "Abrí la rodilla" },
    { to: "open", s: 0.3, say: "Abrí la rodilla" },
    { to: "start", s: 0.9, ease: "slow", say: "Pies juntos" },
    { to: "open", s: 0.6, say: "Abrí la rodilla" },
    { to: "open", s: 0.3, say: "Abrí la rodilla" },
    { to: "start", s: 0.9, ease: "slow", say: "Pies juntos" },
  ],

  props: [
    // elastic band around the knees: from the bottom thigh to the top knee
    { kind: "cable", anchor: BAND_ANCHOR, to: "kneeR", band: true },
  ],
};
