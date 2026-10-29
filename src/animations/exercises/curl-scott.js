/*
 * Curl Scott (banco predicador)
 * Side view, facing right, seated behind a preacher bench: a slanted pad
 * in front of the chest, armpits on its top edge, both upper arms lying
 * along the pad. The hip on the seat is the fixed point and the upper
 * arms never leave the pad: only the forearms curl the barbell (seen from
 * the side as a plate) from nearly extended along the slope up to the
 * face, squeeze, and a slower way down without locking the elbow.
 */
import { FEET_FLAT, STAND_SIDE, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [60, 110];
const TORSO = 4; // sitting tall against the pad
const NECK = neckFrom(HIP, TORSO);

// Preacher pad: top edge from the armpit sloping down-forward, 7 thick,
// sitting just under the line of the upper arms so they rest on it.
const PAD_ANGLE = 130;
const PAD_TOP = point(point(NECK, 4, PAD_ANGLE), 1.5, PAD_ANGLE + 90);
const PAD_END = point(PAD_TOP, 40, PAD_ANGLE);
const PAD_TOP_LOW = point(PAD_TOP, 7, PAD_ANGLE + 90);
const PAD_END_LOW = point(PAD_END, 7, PAD_ANGLE + 90);
const r = (n) => Math.round(n * 10) / 10;
const PAD_PATH = `M${r(PAD_TOP[0])} ${r(PAD_TOP[1])} L${r(PAD_END[0])} ${r(PAD_END[1])} L${r(PAD_END_LOW[0])} ${r(PAD_END_LOW[1])} L${r(PAD_TOP_LOW[0])} ${r(PAD_TOP_LOW[1])} Z`;

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    // thighs forward under the pad, feet planted, far foot a bit behind
    ...leg("R", HIP, [86, 144], "fwd"),
    ...leg("L", HIP, [83, 144], "fwd"),
    ...FEET_FLAT,
    // upper arms along the pad, forearms almost extended down the slope
    armR: PAD_ANGLE,
    forearmR: 125,
    armL: PAD_ANGLE + 2,
    forearmL: 127,
  },

  poses: {
    // forearms curled up to the face; the upper arms stay on the pad
    top: {
      armR: PAD_ANGLE,
      forearmR: 14,
      armL: PAD_ANGLE + 2,
      forearmL: 17,
    },
  },

  timeline: [
    { to: "top", s: 0.9, say: "Axilas apoyadas en el banco" },
    { to: "top", s: 0.2, say: "Apretá arriba" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá sin bloquear el codo" },
    { to: "start", s: 0.4, say: "Bajá sin bloquear el codo" },
  ],

  props: [
    // seat and its post
    { kind: "rect", x: 46, y: 114, w: 28, h: 6 },
    { kind: "line", from: [60, 120], to: [60, 148] },
    // preacher pad (slanted) and its post down to the floor
    { kind: "path", d: PAD_PATH },
    { kind: "line", from: [96, 108], to: [96, 148] },
    // barbell seen from the side: a plate at the hands
    { kind: "disc", on: "forearmR", r: 8 },
  ],
};
