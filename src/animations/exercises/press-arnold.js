/*
 * Press Arnold
 * Front view, standing, a dumbbell (small disc) in each hand. Starts with
 * the dumbbells in front of the face, palms toward you: forearms vertical,
 * elbows together in front of the chest, hands by the chin. The elbows
 * swing out to the sides while the wrists rotate (~0.5 s), the dumbbells
 * press overhead (~0.7 s), come back down to the open position (~0.7 s)
 * and close in front again (~0.5 s).
 * Simplification: the wrist rotation itself cannot be seen in a stick
 * figure; the elbows opening from the front to the sides stand in for it.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 52];
const SHOULDER_R = [93, 52];

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // closed: elbows in front of the chest, nearly touching; hands by the chin
    ...arm("L", SHOULDER_L, [74, 50], "down"),
    ...arm("R", SHOULDER_R, [86, 50], "down"),
  },

  poses: {
    // open: elbows out to the sides, dumbbells beside the head
    open: {
      ...arm("L", SHOULDER_L, [58, 42], "down"),
      ...arm("R", SHOULDER_R, [102, 42], "down"),
    },
    // overhead, elbows slightly soft
    top: {
      ...arm("L", SHOULDER_L, [63, 14], "back"),
      ...arm("R", SHOULDER_R, [97, 14], "fwd"),
    },
  },

  timeline: [
    { to: "open", s: 0.5, say: "Abrí y rotá" },
    { to: "top", s: 0.7, say: "Arriba" },
    { to: "open", s: 0.7, ease: "slow" },
    { to: "start", s: 0.5, say: "Palmas hacia vos" },
    { to: "start", s: 0.4, say: "Palmas hacia vos" },
  ],

  props: [
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
