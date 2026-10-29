/*
 * Curl concentrado
 * Side view, facing right, seated on the end of a flat bench with the
 * feet planted wide and the torso leaning forward. The hip on the seat is
 * the fixed point. The near elbow rests against the inside of the near
 * thigh and does not move: only the forearm curls the dumbbell (small
 * disc) from hanging straight down up to the shoulder, squeeze, and a
 * slower way down. The far arm (darker) rests with the hand on the far
 * knee.
 */
import { FEET_FLAT, STAND_SIDE, angleBetween, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [70, 112];
const TORSO = 36; // leaning well forward over the thighs
const NECK = neckFrom(HIP, TORSO);

// The near elbow, braced against the inner thigh just above the knee.
const ELBOW = [93, 108];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 42, // looking at the dumbbell
    // thighs forward, shins down to the floor, far foot a bit behind
    ...leg("R", HIP, [100, 144], "fwd"),
    ...leg("L", HIP, [97, 144], "fwd"),
    ...FEET_FLAT,
    // near arm: upper arm to the braced elbow, forearm hanging straight down
    armR: angleBetween(NECK, ELBOW),
    forearmR: 180,
    // far arm resting on the far thigh, hand by the knee
    ...arm("L", NECK, [95, 108], "back"),
  },

  poses: {
    // forearm curled up to the shoulder; the elbow has not moved
    top: {
      armR: angleBetween(NECK, ELBOW),
      forearmR: 25,
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Codo apoyado en el muslo" },
    { to: "top", s: 0.3, say: "Apretá arriba" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.4, say: "Bajá lento" },
  ],

  props: [
    // flat bench: pad under the hip and two legs
    { kind: "rect", x: 40, y: 116, w: 36, h: 6 },
    { kind: "line", from: [46, 122], to: [46, 148] },
    { kind: "line", from: [70, 122], to: [70, 148] },
    // dumbbell in the near hand
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
