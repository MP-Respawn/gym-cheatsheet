/*
 * Abdominal tradicional (vuelta: abdomen clásico, paso 1)
 * Side view, lying on the back with the head to the left, knees bent and
 * feet flat on the floor, hands behind the head (elbows open). Two quick
 * crunches: the shoulders curl up with the abs (~0.5 s), a tiny squeeze,
 * then a controlled way down (~0.7 s) that stops just short of resting
 * between reps, as the trainer asks. The hips are the fixed point; the
 * arms and head simply ride along with the torso.
 */
import { STAND_SIDE, arm, both, leg } from "../engine/helpers.js";

const HIP = [86, 140];
const ANKLE = [116, 144]; // feet planted, close to the hips
const NECK = [54, 137]; // where the shoulders rest in the start pose

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 276, // lying back, shoulders barely off the floor
    head: 280,
    // knees up, far leg a little behind so both show
    ...leg("R", HIP, ANKLE, "up"),
    ...leg("L", HIP, [112, 144], "up"),
    ...both("foot", 90),
    // fingers behind the head, elbows pointing toward the knees
    ...arm("R", NECK, [42, 131], "up"),
    ...arm("L", NECK, [40, 132], "up"),
  },

  poses: {
    // shoulder blades off the floor; arms and head follow the torso
    up: { torso: 306, head: 316 },
    // almost down, without resting between reps
    low: { torso: 282, head: 288 },
  },

  timeline: [
    { to: "up", s: 0.5, ease: "fast", say: "Subí con el abdomen" },
    { to: "up", s: 0.15 },
    { to: "low", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "up", s: 0.5, ease: "fast", say: "Subí con el abdomen" },
    { to: "up", s: 0.15 },
    { to: "start", s: 0.7, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.4 },
  ],
};
