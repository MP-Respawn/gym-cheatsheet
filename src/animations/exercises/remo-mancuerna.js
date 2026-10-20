/*
 * Remo con mancuerna a un brazo
 * Side view, facing right. Far knee and far hand on a flat bench, near foot
 * on the floor beside it, back about parallel to the floor. The hip is the
 * fixed point and the only thing that moves is the near arm, so the far hand,
 * the far knee and the near foot stay planted by construction. The dumbbell
 * goes from hanging straight down to the hip, elbow driving back and up.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [60, 90];
const TORSO = 82; // back about parallel to the floor
const SHOULDER = neckFrom(HIP, TORSO);

// Where the dumbbell ends: next to the hip, just under the torso.
const DB_TOP = [72, 97];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 88,
    // far leg kneeling on the bench, shin along the pad, foot off the end
    thighL: 185,
    shinL: 270,
    footL: 220,
    // near leg standing on the floor next to the bench
    ...leg("R", HIP, [70, 144]),
    footR: 90,
    // far hand on the bench, under the shoulder
    ...arm("L", SHOULDER, [95, 120], "back"),
    // near arm hanging straight down with the dumbbell
    armR: 180,
    forearmR: 180,
  },

  poses: {
    // elbow back toward the hip, forearm stays vertical under it
    top: {
      ...arm("R", SHOULDER, DB_TOP, "up"),
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Codo hacia la cadera" },
    { to: "top", s: 0.3, say: "Codo hacia la cadera" },
    { to: "start", s: 1.1, ease: "slow", say: "Espalda paralela al piso" },
    { to: "start", s: 0.4, say: "Espalda paralela al piso" },
  ],

  props: [
    // flat bench and its legs
    { kind: "rect", x: 24, y: 123, w: 80, h: 6 },
    { kind: "line", from: [30, 129], to: [30, 148] },
    { kind: "line", from: [98, 129], to: [98, 148] },
    // dumbbell in the near hand
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
