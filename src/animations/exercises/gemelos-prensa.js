/*
 * Gemelos en prensa
 * Side view, reclined on the leg press seat like prensa-45, but the legs
 * stay extended (knees soft, never locked) and only the ankles work: the
 * balls of the feet sit on the lower edge of the platform with the heels
 * hanging off. The toes push the platform away (it slides a little up the
 * rail), then the heels come back down slowly past neutral into a full
 * stretch before the next push.
 * Cues shown: push with the balls of the feet, knees extended but not
 * locked, slow way down to a good stretch.
 *
 * Root is the hip on the seat. The platform is a sliding prop: each pose
 * moves it along the 45 degree rail by exactly as much as the toes travel
 * in that direction.
 */
import { STAND_SIDE, arm, point } from "../engine/helpers.js";

const HIP = [58, 116];
const TORSO = 300; // same reclined seat as prensa-45
const NECK = point(HIP, 32, TORSO);

// Legs fixed: extended with a soft knee.
const THIGH = 30;
const SHIN = 40;
const ANKLE = point(point(HIP, 30, THIGH), 30, SHIN);

// Foot angles: neutral (start), pushed (toes pressing), stretched (heels down).
const FOOT_NEUTRAL = SHIN - 90;
const FOOT_PUSH = FOOT_NEUTRAL + 35;
const FOOT_STRETCH = FOOT_NEUTRAL - 20;

// The platform only moves along the rail (45 degrees): follow the toe's
// travel in that direction.
const RAIL = point([0, 0], 1, 45);
const toe = (foot) => point(ANKLE, 12, foot);
const slide = (foot) => {
  const d = [toe(foot)[0] - toe(FOOT_NEUTRAL)[0], toe(foot)[1] - toe(FOOT_NEUTRAL)[1]];
  const along = d[0] * RAIL[0] + d[1] * RAIL[1];
  return [RAIL[0] * along, RAIL[1] * along];
};

// Platform plate (start pose) just behind the toes: its lower edge is right
// at the ball of the foot, so the heel hangs off below it. A frame bar runs
// from the back of the plate to the rail.
const TOE0 = toe(FOOT_NEUTRAL);
const PLATE_LOW = point(point(TOE0, 2, 45), 3, 135);
const PLATE_HIGH = point(PLATE_LOW, 24, 315);
const BAR_START = point(PLATE_LOW, 8, 315);
const BAR_END = [184 - BAR_START[1], BAR_START[1]]; // meets the rail x + y = 184
const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

// Rail on the line x + y = 184 (like prensa-45), with its two posts.
const RAIL_LOW = [84, 100];
const RAIL_HIGH = [138, 46];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 322,
    thighR: THIGH,
    shinR: SHIN,
    footR: FOOT_NEUTRAL,
    // far leg a hair apart so both show
    thighL: THIGH + 2,
    shinL: SHIN + 1,
    footL: FOOT_NEUTRAL + 1,
    // hands on the handles beside the seat
    ...arm("R", NECK, [66, 118], "down"),
    ...arm("L", NECK, [63, 118], "down"),
  },

  poses: {
    push: { footR: FOOT_PUSH, footL: FOOT_PUSH + 1 },
    stretch: { footR: FOOT_STRETCH, footL: FOOT_STRETCH + 1 },
  },

  timeline: [
    { to: "push", s: 0.7, say: "Empujá con las puntas" },
    { to: "push", s: 0.3, say: "Empujá con las puntas" },
    { to: "stretch", s: 1.5, ease: "slow", say: "Bajá lento" },
    { to: "stretch", s: 0.3, say: "Bajá lento" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // seat and backrest, with its post
    { kind: "line", from: point(HIP, 5, TORSO - 90), to: point(point(HIP, 5, TORSO - 90), 38, TORSO) },
    { kind: "line", from: [50, 123], to: [70, 120] },
    { kind: "line", from: [60, 122], to: [60, 148] },
    // 45 degree rail and its two posts
    { kind: "line", from: RAIL_LOW, to: RAIL_HIGH },
    { kind: "line", from: RAIL_LOW, to: [RAIL_LOW[0], 148] },
    { kind: "line", from: RAIL_HIGH, to: [RAIL_HIGH[0], 148] },
    // sliding platform (plate + frame bar to the rail)
    {
      kind: "path",
      d: `M ${f(PLATE_LOW)} L ${f(PLATE_HIGH)} M ${f(BAR_START)} L ${f(BAR_END)}`,
      shift: { push: slide(FOOT_PUSH), stretch: slide(FOOT_STRETCH) },
      layer: "mid",
    },
  ],
};
