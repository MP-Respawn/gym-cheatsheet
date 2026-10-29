/*
 * Remo invertido
 * Side view, hanging face up under a fixed bar at waist height, heels on the
 * floor with the toes up. The near hand on the bar is the fixed point. The
 * body stays one straight line from the heels to the shoulders and pivots
 * on the heels: arms straight at the bottom, then the chest is pulled up to
 * the bar with the elbows going back under the body. The head tilts back to
 * look at the bar. Pull, short squeeze, slow way down.
 * Simplification: the body is rigid, so at the top the near forearm passes
 * just beside the face (the bar sits a hand above the head).
 */
import { STAND_SIDE, arm, both, point } from "../engine/helpers.js";

const BAR_Y = 78;
const HAND = [118, BAR_Y];
const HAND_FAR = [115, BAR_Y]; // far hand a little behind, so both arms show
const HEEL = [20, 144]; // the near ankle rests on the floor, toes up
const BODY = 92; // shin 30 + thigh 30 + torso 32, one straight line
const FOOT = 350; // toes pointing up

/*
 * The whole body for a tilt (0 = vertical, 90 = flat on the floor): legs
 * and torso share one line that starts at the fixed heel, the head tilts
 * back by `look` to watch the bar, and both arms are aimed at their spots
 * on the bar.
 */
function body(tilt, look) {
  const neck = point(HEEL, BODY, tilt);
  return {
    torso: tilt,
    head: tilt - look,
    ...both("thigh", tilt + 180),
    ...both("shin", tilt + 180),
    ...both("foot", FOOT),
    ...arm("R", neck, HAND, "down"),
    ...arm("L", neck, HAND_FAR, "down"),
  };
}

export default {
  view: "side",
  root: "handR",
  at: HAND,

  // bottom: arms straight, body low and nearly flat, head just past the arms
  start: {
    ...STAND_SIDE,
    ...body(73, 10),
  },

  poses: {
    // halfway: keeps the heel on the floor mid-move (the bending arms do
    // not blend in a straight line); each half is eased "in" then "fast"
    // so the pull and the descent still flow through it
    mid: body(66.5, 30),
    // chest at the bar: body steeper, elbows back under the body, chin up
    top: body(60, 30),
  },

  timeline: [
    { to: "mid", s: 0.4, ease: "in", say: "Pecho a la barra" },
    { to: "top", s: 0.4, ease: "fast", say: "Pecho a la barra" },
    { to: "top", s: 0.25, say: "Juntá los omóplatos" },
    { to: "mid", s: 0.6, ease: "in", say: "Bajá controlado, cuerpo en línea" },
    { to: "start", s: 0.6, ease: "fast", say: "Bajá controlado, cuerpo en línea" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // rack: two uprights and the bar between them
    { kind: "line", from: [44, 48], to: [44, 148] },
    { kind: "line", from: [140, 48], to: [140, 148] },
    { kind: "line", from: [40, BAR_Y], to: [146, BAR_Y] },
    // the bar seen end-on, in the near hand
    { kind: "disc", c: HAND, r: 3, fill: true, layer: "front" },
  ],
};
