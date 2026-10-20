/*
 * Remo en polea baja sentado
 * Side view, facing right, seated on a low bench with the feet on the
 * footplate and the knees soft. The hip is the fixed point. At the reach the
 * torso leans forward a little and the arms are long; on the pull the torso
 * comes upright (and stays there, no swinging) while the elbows go back past
 * the body. The cable from the low pulley stretches and shortens with the
 * hands; the weight stack rises with the pull.
 */
import { STAND_SIDE, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [48, 124];
const TORSO_REACH = 12; // small lean forward at the stretch
const TORSO_PULL = 0; // upright at the pull

const HANDLE_OUT = [92, 108];
const HANDLE_IN = [60, 110]; // at the belly

const ANCHOR = [116, 126]; // low pulley, at foot height

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO_REACH,
    head: 14,
    ...leg("R", HIP, [102, 128], "up"),
    ...leg("L", HIP, [99, 129], "up"),
    footR: 10, // soles flat on the footplate
    footL: 12,
    ...arm("R", neckFrom(HIP, TORSO_REACH), HANDLE_OUT, "down"),
    ...arm("L", neckFrom(HIP, TORSO_REACH), [HANDLE_OUT[0] - 2, HANDLE_OUT[1]], "down"),
  },

  poses: {
    // torso upright, elbows back past the body, handle at the belly
    pulled: {
      torso: TORSO_PULL,
      ...arm("R", neckFrom(HIP, TORSO_PULL), HANDLE_IN, "back"),
      ...arm("L", neckFrom(HIP, TORSO_PULL), [HANDLE_IN[0] - 2, HANDLE_IN[1]], "back"),
    },
  },

  timeline: [
    { to: "pulled", s: 0.9, say: "Tirá con los codos atrás" },
    { to: "pulled", s: 0.4, say: "Torso quieto" },
    { to: "start", s: 1.3, ease: "slow", say: "Estirá adelante" },
    { to: "start", s: 0.3, say: "Estirá adelante" },
  ],

  props: [
    // low bench
    { kind: "rect", x: 26, y: 127, w: 32, h: 6 },
    { kind: "line", from: [30, 133], to: [30, 148] },
    { kind: "line", from: [54, 133], to: [54, 148] },
    // footplate and the low pulley in front of it
    { kind: "line", from: [109, 112], to: [107, 144] },
    { kind: "line", from: [107, 144], to: [140, 144] },
    { kind: "disc", c: ANCHOR, r: 3, fill: true },
    // tower with the weight stack
    { kind: "line", from: [140, 20], to: [140, 148] },
    { kind: "rect", x: 132, y: 112, w: 16, h: 30, fill: true, shift: { pulled: [0, -14] } },
    // cable from the low pulley to the handle, and the handle grip
    { kind: "cable", anchor: ANCHOR, to: "handR" },
    { kind: "line", on: "forearmR", from: [0, -4], to: [0, 4] },
  ],
};
