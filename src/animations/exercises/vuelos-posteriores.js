/*
 * Vuelos posteriores
 * Side view, facing right, standing bent over with the back nearly flat
 * (about 12 degrees above horizontal), knees softly bent, head looking at
 * the floor a little ahead. The near ankle is the fixed point. A dumbbell
 * (small disc) in each hand hangs under the shoulders; the arms open out
 * to the sides up to shoulder height, which from the side reads as the
 * upper arms rising until they are square to the torso, elbows soft.
 * Short squeeze of the shoulder blades, slower way down.
 * Simplification: done standing, without the bench of the prescription.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [72, 92];
const TORSO = 78; // back almost flat
const NECK = neckFrom(HIP, TORSO);

// Upper arms square to the torso, pointing up; forearms a little more open.
const OPEN_ARM = TORSO - 90 + 360;

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 84,
    ...leg("R", HIP, [80, 144]),
    ...leg("L", HIP, [76, 144]),
    ...FEET_FLAT,
    // dumbbells hanging straight down from the shoulders
    ...arm("R", NECK, [NECK[0] + 2, NECK[1] + 38], "fwd"),
    ...arm("L", NECK, [NECK[0] + 1, NECK[1] + 37], "fwd"),
  },

  poses: {
    // arms open to shoulder height, elbows a bit bent
    open: {
      armR: OPEN_ARM,
      forearmR: OPEN_ARM + 15,
      armL: OPEN_ARM + 6,
      forearmL: OPEN_ARM + 20,
    },
  },

  timeline: [
    { to: "open", s: 0.9, say: "Abrí hasta la altura de los hombros" },
    { to: "open", s: 0.3, say: "Juntá los omóplatos" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.4, say: "Bajá controlado" },
  ],

  props: [
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
