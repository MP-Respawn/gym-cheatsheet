/*
 * Prensa 45
 * Side view, reclined on the seat with the back flat on the backrest, feet
 * flat on a platform that slides up and down a 45 degree rail. Starts with
 * the legs extended but not locked, lowers slowly until the knees come
 * toward the chest, then presses back up without locking the knees.
 * Cues shown: lower back stays on the backrest, knees never lock at the top.
 * Simplification: the backrest is drawn a bit more reclined than 45 degrees
 * so the feet can stay flat on a platform square to the rail.
 *
 * Root is the hip on the seat. The platform is a sliding prop whose shift
 * matches how far the ankles travel between the two poses.
 */
import { STAND_SIDE, arm, point } from "../engine/helpers.js";

const HIP = [58, 116];
const TORSO = 300; // reclined, back flat on the backrest
const NECK = point(HIP, 32, TORSO);

// Leg angles (thigh, shin). The foot stays at 315: flat on the platform,
// which is square to the 45 degree rail.
const FOOT = 315;
const TOP = { thigh: 28, shin: 45 }; // extended, knees soft (not locked)
const LOW = { thigh: 345, shin: 80 }; // knees toward the chest

const ankleAt = (legAngles) => point(point(HIP, 30, legAngles.thigh), 30, legAngles.shin);
const ANKLE_TOP = ankleAt(TOP);
const ANKLE_LOW = ankleAt(LOW);
const SLIDE = [ANKLE_LOW[0] - ANKLE_TOP[0], ANKLE_LOW[1] - ANKLE_TOP[1]];

// Platform plate just behind the soles (start pose), plus the carriage arm
// that links it to the rail. Drawn as one path so it slides as one piece.
const PLATE_MID = point(point(ANKLE_TOP, 3, 45), 4, FOOT);
const PLATE_A = point(PLATE_MID, 12, FOOT);
const PLATE_B = point(PLATE_MID, 10, FOOT + 180);
const CARRIAGE = point(PLATE_MID, 20, 135);
const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

// The rail runs at 45 degrees through the carriage point.
const RAIL_LOW = point(CARRIAGE, 34, 225);
const RAIL_HIGH = point(CARRIAGE, 26, 45);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 322, // chin a bit tucked, looking at the knees
    thighR: TOP.thigh,
    shinR: TOP.shin,
    footR: FOOT,
    // far leg a hair apart so both show
    thighL: TOP.thigh + 2,
    shinL: TOP.shin + 1,
    footL: FOOT,
    // hands on the handles beside the seat
    ...arm("R", NECK, [66, 118], "down"),
    ...arm("L", NECK, [63, 118], "down"),
  },

  poses: {
    low: {
      thighR: LOW.thigh,
      shinR: LOW.shin,
      footR: FOOT,
      thighL: LOW.thigh + 2,
      shinL: LOW.shin + 1,
      footL: FOOT,
    },
  },

  timeline: [
    { to: "low", s: 1.2, ease: "slow", say: "Bajá con la espalda apoyada" },
    { to: "low", s: 0.2, say: "Bajá con la espalda apoyada" },
    { to: "start", s: 0.8, say: "Empujá sin trabar" },
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
    // sliding platform (plate + carriage), follows the feet
    {
      kind: "path",
      d: `M ${f(PLATE_A)} L ${f(PLATE_B)} M ${f(PLATE_MID)} L ${f(CARRIAGE)}`,
      shift: { low: SLIDE },
      layer: "mid",
    },
  ],
};
