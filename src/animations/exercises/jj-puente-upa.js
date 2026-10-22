/*
 * Puente, upa / Bridging (Jiu Jitsu)
 * Side view, lying on the back with the head to the left, feet planted
 * close to the seat. The heels drive the hips up high and the near (lighter)
 * arm reaches up and across as the body turns toward the far shoulder; down
 * again, then the same turning the other way with the far (darker) arm.
 * The shoulders are the fixed point; the feet stay planted.
 */
import { STAND_SIDE, angleBetween, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const ANKLE = [100, 144];
const HIP_DOWN = [72, 140];
const HIP_UP = point(NECK, 32, 50); // hips high

const ARMS_DOWN = { ...both("arm", 96), ...both("forearm", 92) }; // on the floor

const body = (hip) => ({
  torso: angleBetween(hip, NECK),
  head: 280,
  ...leg("R", hip, ANKLE, "up"),
  ...leg("L", hip, [ANKLE[0] - 3, ANKLE[1]], "up"),
  ...both("foot", 90),
});

// One arm reaching up and across toward the far side.
const reach = (side) => ({ [`arm${side}`]: 24, [`forearm${side}`]: 18 });

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: { ...STAND_SIDE, ...body(HIP_DOWN), ...ARMS_DOWN },

  poses: {
    upNear: { ...body(HIP_UP), ...ARMS_DOWN, ...reach("R") },
    upFar: { ...body(HIP_UP), ...ARMS_DOWN, ...reach("L") },
  },

  timeline: [
    { to: "upNear", s: 0.5, ease: "fast", say: "Cadera bien alta" },
    { to: "upNear", s: 0.3, say: "Girá hacia el hombro" },
    { to: "start", s: 0.6, say: "Bajá" },
    { to: "upFar", s: 0.5, ease: "fast", say: "Al otro lado" },
    { to: "upFar", s: 0.3, say: "Girá hacia el hombro" },
    { to: "start", s: 0.6, say: "Bajá" },
  ],
};
