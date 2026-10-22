/*
 * Fuga a un pie / One-foot shrimp (Jiu Jitsu)
 * Seen from above, lying on a mat (no floor line) with the head to the
 * left: on the back, only the right knee bent with the foot planted and the
 * left leg long. That one foot pushes and the hips shoot out to the side
 * while the long leg stays long and the hands push away; then back under.
 * Several reps to the same side. The shoulders are the fixed point.
 */
import { STAND_FRONT } from "../engine/helpers.js";
import { MAT, turnPose } from "../engine/poses.js";

// Drawn upright below, then turned -90 so the body lies head left, feet right.
const TURN = -90;
const NECK = [36, 80];

const FLAT = {
  ...STAND_FRONT,
  torso: 0,
  head: 0,
  thighR: 166,
  shinR: 198,
  thighL: 182,
  shinL: 180,
  footR: 180,
  footL: 180,
  armR: 150,
  forearmR: 20,
  armL: 210,
  forearmL: 340,
};

// Hips out to the left, pushed by the right foot only; the left leg stays long.
const OUT = {
  torso: 30,
  head: 12,
  clavR: 110,
  clavL: 290,
  pelvisR: 120,
  pelvisL: 300,
  thighR: 150,
  shinR: 160,
  thighL: 172,
  shinL: 172,
  armR: 170,
  forearmR: 60,
  armL: 230,
  forearmL: 60,
};

export default {
  view: "front",
  root: "neck",
  at: NECK,
  floor: false,
  lengths: { footL: 5, footR: 5 },
  props: [MAT],

  start: turnPose(FLAT, TURN),

  poses: { out: turnPose(OUT, TURN) },

  timeline: [
    { to: "out", s: 0.6, ease: "fast", say: "Solo un pie empuja" },
    { to: "out", s: 0.3, say: "La otra pierna, larga" },
    { to: "start", s: 0.7, say: "Volvé y repetí" },
    { to: "out", s: 0.6, ease: "fast", say: "Solo un pie empuja" },
    { to: "out", s: 0.3, say: "La otra pierna, larga" },
    { to: "start", s: 0.7, say: "Volvé y repetí" },
  ],
};
