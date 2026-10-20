/*
 * Aperturas con mancuernas
 * Unusual camera: seen from the FEET end of a flat bench, so it uses the
 * front view of a person lying on their back. The torso points away from
 * the camera, so it is drawn very short (foreshortened) with the head just
 * above it; the legs are hidden (they would point straight at the camera).
 * The bench shows as its end: a small block under the shoulders on a post.
 * Dumbbells (small discs) start together above the chest, open wide to the
 * sides in an arc with the elbows slightly bent and fixed, stop at the
 * stretch, then close squeezing the chest.
 */
import { STAND_FRONT, arm } from "../engine/helpers.js";

const SHOULDER_L = [67, 86];
const SHOULDER_R = [93, 86];

export default {
  view: "front",
  root: "hip",
  at: [80, 96],
  // torso and head point away from the camera, so they look short
  lengths: { torso: 10, head: 10 },
  hide: ["pelvisL", "pelvisR", "thighL", "thighR", "shinL", "shinR", "footL", "footR"],

  start: {
    ...STAND_FRONT,
    // closed: dumbbells together above the chest, elbows soft and out
    ...arm("L", SHOULDER_L, [76, 47], "back"),
    ...arm("R", SHOULDER_R, [84, 47], "fwd"),
  },

  poses: {
    // open: arms wide, hands a little below the bench, same elbow bend
    open: {
      ...arm("L", SHOULDER_L, [28, 94], "down"),
      ...arm("R", SHOULDER_R, [132, 94], "down"),
    },
  },

  timeline: [
    { to: "open", s: 1.3, ease: "slow", say: "Abrí en arco" },
    { to: "open", s: 0.3, say: "Abrí en arco" },
    { to: "start", s: 1.0, say: "Cerrá apretando el pecho" },
    { to: "start", s: 0.4, say: "Cerrá apretando el pecho" },
  ],

  props: [
    // the bench seen from its end: pad under the shoulders and its post
    { kind: "rect", x: 62, y: 90, w: 36, h: 8 },
    { kind: "line", from: [80, 98], to: [80, 148] },
    { kind: "line", from: [68, 148], to: [92, 148] },
    // one dumbbell in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
