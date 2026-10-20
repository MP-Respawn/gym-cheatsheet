/*
 * Press plano con barra
 * Side view, lying on a flat bench under a rack (two uprights by the head),
 * head to the left, feet planted. Both hands on one barbell, seen from the
 * side as a big plate. The bar comes down to the middle of the chest in a
 * controlled ~1.1 s and is pressed back up in ~0.7 s, then a short hold at
 * the top with the shoulder blades squeezed.
 * Differs from the dumbbell version: big plate, rack, shallower bottom (the
 * bar stops on the chest), feet tucked a little closer.
 */
import { FEET_FLAT, STAND_SIDE, arm, leg } from "../engine/helpers.js";

const HIP = [94, 113];
const NECK = [62, 113]; // torso flat along the bench (torso: 270)

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: 270,
    head: 272,
    // feet firm on the floor, a bit closer to the bench
    ...leg("R", HIP, [116, 144], "up"),
    ...leg("L", HIP, [111, 144], "up"),
    ...FEET_FLAT,
    // top: bar over the shoulders, both hands on it
    ...arm("R", NECK, [64, 73], "fwd"),
    ...arm("L", NECK, [62, 73], "fwd"),
  },

  poses: {
    // bar resting on the middle of the chest, elbows just below the bench
    bottom: {
      ...arm("R", NECK, [76, 101], "down"),
      ...arm("L", NECK, [74, 101], "down"),
    },
  },

  timeline: [
    { to: "bottom", s: 1.1, ease: "slow", say: "Bajá al pecho medio" },
    { to: "bottom", s: 0.15 },
    { to: "start", s: 0.7, say: "Empujá" },
    { to: "start", s: 0.6, say: "Omóplatos juntos, pies firmes" },
  ],

  props: [
    // rack uprights by the head, behind everything
    { kind: "line", from: [52, 64], to: [52, 148] },
    { kind: "line", from: [49, 72], to: [55, 72] },
    // flat bench: pad and two legs
    { kind: "rect", x: 36, y: 117, w: 70, h: 6 },
    { kind: "line", from: [44, 123], to: [44, 148] },
    { kind: "line", from: [98, 123], to: [98, 148] },
    // barbell seen from the side: a plate at the hands
    { kind: "disc", on: "forearmR", r: 9 },
  ],
};
