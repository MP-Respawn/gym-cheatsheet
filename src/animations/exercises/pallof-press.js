/*
 * Pallof press
 * Front view, standing tall with the feet shoulder width and the knees
 * soft, next to a cable machine on the right: the cable comes from the
 * pulley at chest height to both hands. The hip is the fixed point. The
 * hands start together at the sternum with the elbows out at the ribs;
 * they press out in front, hold, and come back slowly. The torso stays
 * exactly vertical the whole time: the cable pulls it to the right and the
 * work is not letting it turn.
 * Simplification: the press really goes toward the viewer, which a flat
 * drawing cannot shorten; here the elbows tuck in under the hands and the
 * hands rise to the top of the chest, so the arms read as "in front".
 */
import { STAND_FRONT, arm, leg } from "../engine/helpers.js";

const HIP = [80, 88];
const SHOULDER_L = [67, 56];
const SHOULDER_R = [93, 56];

const FRAME_X = 156;
const PULLEY = [FRAME_X, 60];

// hands at the sternum (start) and pressed out in front
const HANDS_IN = 70;
const HANDS_OUT = 59;

export default {
  view: "front",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_FRONT,
    // feet shoulder width, knees soft and pointing out
    ...leg("L", [74, 88], [66, 144], "back"),
    ...leg("R", [86, 88], [94, 144], "fwd"),
    footL: 270,
    footR: 90,
    // hands together at the sternum, elbows out at the ribs
    ...arm("L", SHOULDER_L, [79, HANDS_IN], "back"),
    ...arm("R", SHOULDER_R, [81, HANDS_IN], "fwd"),
  },

  poses: {
    // arms pressed out: elbows in under the hands, torso unchanged
    press: {
      ...arm("L", SHOULDER_L, [79, HANDS_OUT], "down"),
      ...arm("R", SHOULDER_R, [81, HANDS_OUT], "down"),
    },
  },

  timeline: [
    { to: "press", s: 0.8, say: "Estirá los brazos al frente, despacio" },
    { to: "press", s: 0.5, say: "Sostené, el torso no gira" },
    { to: "start", s: 1, ease: "slow", say: "Volvé controlado" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // cable machine post with the pulley at chest height
    { kind: "line", from: [FRAME_X, 20], to: [FRAME_X, 148] },
    { kind: "disc", c: PULLEY, r: 3 },
    // cable from the pulley to the hands
    { kind: "cable", anchor: PULLEY, to: ["handL", "handR"] },
  ],
};
