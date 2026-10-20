/*
 * Sentadilla en Smith
 * Side view, facing right, inside a Smith machine. The bar rides on the
 * upper back and moves straight up and down along the vertical guide rail,
 * so the shoulders (neck) keep the same x in every pose. The feet are set a
 * little ahead of the bar, which lets the torso stay more upright than in
 * the free barbell squat. Steady tempo down to thighs parallel and back up.
 * Cues shown: feet ahead of the bar, down to parallel with a straight back.
 */
import { STAND_SIDE, angleBetween, arm, both, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [88, 144]; // near ankle (root), ahead of the bar line
const BAR_X = 80; // the neck stays on this vertical line

// Standing: hips a bit behind the feet, torso almost vertical under the bar.
const HIP_TOP = [79, 85];
const TORSO_TOP = angleBetween(HIP_TOP, [BAR_X, HIP_TOP[1] - 32]);
const NECK_TOP = neckFrom(HIP_TOP, TORSO_TOP);

// Torso angle that puts the neck back on BAR_X for a given hip.
const torsoUnderBar = (hip) => (Math.asin((BAR_X - hip[0]) / 32) * 180) / Math.PI;

// Halfway and bottom (thighs parallel). The halfway pose keeps the bar on
// its vertical line in between too; without it the shoulders would drift
// back mid-move.
const HIP_HALF = [71, 101];
const HIP_LOW = [66, 115];

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    torso: TORSO_TOP,
    ...leg("R", HIP_TOP, ANKLE),
    ...leg("L", HIP_TOP, [ANKLE[0] - 4, 144]),
    ...both("foot", 90),
    // hands on the bar, just behind the neck (they ride along with the torso)
    ...arm("R", NECK_TOP, [BAR_X - 4, NECK_TOP[1] - 2], "back"),
    ...arm("L", NECK_TOP, [BAR_X - 7, NECK_TOP[1] - 2], "back"),
  },

  poses: {
    half: {
      ...leg("R", HIP_HALF, ANKLE),
      ...leg("L", HIP_HALF, [ANKLE[0] - 4, 144]),
      ...both("foot", 90),
      torso: torsoUnderBar(HIP_HALF),
    },
    bottom: {
      ...leg("R", HIP_LOW, ANKLE),
      ...leg("L", HIP_LOW, [ANKLE[0] - 4, 144]),
      ...both("foot", 90),
      torso: torsoUnderBar(HIP_LOW),
    },
  },

  timeline: [
    { to: "start", s: 0.5, say: "Pies adelante de la barra" },
    // each way passes through "half"; linear keeps an even speed across it
    { to: "half", s: 0.8, ease: "linear", say: "Bajá hasta paralelo" },
    { to: "bottom", s: 0.8, ease: "linear", say: "Bajá hasta paralelo" },
    { to: "bottom", s: 0.2, say: "Bajá hasta paralelo" },
    { to: "half", s: 0.55, ease: "linear", say: "Subí con la espalda recta" },
    { to: "start", s: 0.55, ease: "linear", say: "Subí con la espalda recta" },
  ],

  props: [
    // vertical guide rail the bar slides on, and the machine's two uprights
    { kind: "line", from: [BAR_X - 5, 10], to: [BAR_X - 5, 148] },
    { kind: "line", from: [36, 10], to: [36, 148] },
    { kind: "line", from: [132, 10], to: [132, 148] },
    { kind: "line", from: [36, 10], to: [132, 10] },
    // the bar (a plate seen from the side), resting on the upper back
    { kind: "disc", on: "torso", dx: -5, dy: 1, r: 8 },
  ],
};
