/*
 * Press plano con mancuernas
 * Side view, lying on a flat bench, head to the left, feet planted on the
 * floor. Two dumbbells (small discs): they come down beside the chest with
 * the elbows dropping below the bench toward the hips (deeper than a
 * barbell allows), then press back up over the shoulders. Slow, controlled
 * way down, steady push up.
 * Simplification: the trainer pairs it with the glute bridge; only the
 * press is shown here.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg } from "../engine/helpers.js";

const HIP = [94, 113];
const NECK = [62, 113]; // torso flat along the bench (torso: 270)

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 270,
    head: 272,
    // knees bent, feet flat on the floor past the end of the bench
    ...leg("R", HIP, [120, 144], "up"),
    ...leg("L", HIP, [115, 144], "up"),
    ...FEET_FLAT,
    // top: dumbbells straight over the shoulders
    ...arm("R", NECK, [63, 74], "fwd"),
    ...arm("L", NECK, [60, 74], "fwd"),
  },

  poses: {
    // dumbbells beside the chest, forearms about vertical, elbows low
    bottom: {
      ...arm("R", NECK, [76, 106], "down"),
      ...arm("L", NECK, [73, 106], "down"),
    },
  },

  timeline: [
    { to: "bottom", s: 1.4, ease: "slow", say: "Bajada controlada" },
    { to: "bottom", s: 0.2 },
    { to: "start", s: 0.8, say: "Empujá" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // flat bench: pad and two legs
    { kind: "rect", x: 36, y: 117, w: 70, h: 6 },
    { kind: "line", from: [44, 123], to: [44, 148] },
    { kind: "line", from: [98, 123], to: [98, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmR", r: 5 },
    { kind: "disc", on: "forearmL", r: 5 },
  ],
};
