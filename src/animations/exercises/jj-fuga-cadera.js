/*
 * Fuga de cadera, camarón / Shrimping (Jiu Jitsu)
 * Seen from above, lying on a mat (no floor line) with the head to the
 * left: on the back, the near knee bent with the foot planted. The foot
 * pushes and the hips shoot out to the side and back while the shoulders
 * stay put and the hands push away, so the body bends into a C; then the
 * hips come back under. Once to each side. The shoulders are the fixed
 * point.
 */
import { STAND_FRONT } from "../engine/helpers.js";
import { MAT, turnPose } from "../engine/poses.js";

// Drawn upright below, then turned -90 so the body lies head left, feet right.
const TURN = -90;
const NECK = [36, 80];

// Flat on the back: right knee bent (foot planted), left leg long, hands at the chest.
const FLAT = {
  ...STAND_FRONT,
  torso: 0,
  head: 0,
  thighR: 168,
  shinR: 196,
  thighL: 182,
  shinL: 180,
  footR: 180,
  footL: 180,
  armR: 150,
  forearmR: 20,
  armL: 210,
  forearmL: 340,
};

// Hips out to one side (s = 1 left, -1 right), legs pushing long, hands framing
// in front of the chest and pushing toward the other side.
const shrimp = (s) => ({
  torso: 32 * s,
  head: 12 * s,
  clavR: 90 + 20 * s,
  clavL: 270 + 20 * s,
  pelvisR: 90 + 32 * s,
  pelvisL: 270 + 32 * s,
  thighR: 180 - 28 * s,
  shinR: 180 - 22 * s,
  thighL: 180 - 24 * s,
  shinL: 180 - 20 * s,
  armR: 150 + 20 * s,
  forearmR: 60 * s,
  armL: 210 + 20 * s,
  forearmL: 60 * s,
});

export default {
  view: "front",
  root: "neck",
  at: NECK,
  floor: false,
  lengths: { footL: 5, footR: 5 },
  props: [MAT],

  start: turnPose(FLAT, TURN),

  poses: {
    left: turnPose(shrimp(1), TURN),
    right: turnPose(shrimp(-1), TURN),
  },

  timeline: [
    { to: "left", s: 0.6, ease: "fast", say: "Empujá con el pie, cadera afuera" },
    { to: "left", s: 0.4, say: "Quedá de costado" },
    { to: "start", s: 0.7, say: "Cadera abajo de nuevo" },
    { to: "right", s: 0.6, ease: "fast", say: "Al otro lado" },
    { to: "right", s: 0.4, say: "Quedá de costado" },
    { to: "start", s: 0.7, say: "Cadera abajo de nuevo" },
  ],
};
