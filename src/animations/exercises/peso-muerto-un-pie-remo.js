/*
 * Peso muerto a un pie isométrico + remo bajo con mancuerna
 * Side view, facing right, standing on the near leg (the fixed point is the
 * near ankle). Hinges into a "T": torso forward, far leg straight back.
 * The T is held still while the near arm rows the dumbbell twice, elbow
 * going back toward the hip ("solo se mueve el brazo"), then stands up.
 * The far arm just hangs.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const ANKLE = [84, 144];

// The T: hips a little back and down, soft stance knee, torso almost flat.
const HIP_T = [80, 88];
const TORSO_T = 84;
const SHOULDER_T = neckFrom(HIP_T, TORSO_T);

// Row: the hand comes up next to the ribs, the elbow ends above the back.
const HAND_ROW = [101, 96];

const T = {
  ...leg("R", HIP_T, ANKLE),
  footR: 90, // stance foot flat
  torso: TORSO_T,
  head: TORSO_T - 8, // eyes a bit ahead of the hands
  thighL: TORSO_T + 180, // free leg in line with the torso
  shinL: TORSO_T + 180,
  footL: 180, // toes to the floor
  // arms hang straight down (they would follow the torso if not listed)
  armR: 180,
  forearmR: 180,
  armL: 178,
  forearmL: 178,
};

export default {
  view: "side",
  root: "ankleR",
  at: ANKLE,

  start: {
    ...STAND_SIDE,
    // free leg already off the floor, a bit behind
    ...leg("L", [84, 84], [76, 136], "fwd"),
    footL: 120,
    armL: 178,
    forearmL: 178,
  },

  poses: {
    t: T,
    row: {
      ...T,
      ...arm("R", SHOULDER_T, HAND_ROW, "up"),
    },
  },

  timeline: [
    { to: "t", s: 1, ease: "slow", say: "Bajá a la T" },
    { to: "row", s: 0.5, say: "Remá sin moverte" },
    { to: "t", s: 0.6, say: "Remá sin moverte" },
    { to: "row", s: 0.5, say: "Remá sin moverte" },
    { to: "t", s: 0.6, say: "Remá sin moverte" },
    { to: "start", s: 1, say: "Volvé arriba" },
  ],

  props: [
    // dumbbell in the near hand
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
