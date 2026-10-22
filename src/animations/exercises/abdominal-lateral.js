/*
 * Abdominales laterales u oblicuos (vuelta: abdomen clásico, paso 5)
 * Front view, lying on one side on the floor, legs straight and stacked to
 * the right, top hand behind the head and the bottom arm across the chest,
 * holding the top shoulder. The trunk bends sideways and lifts off the
 * floor toward the ceiling (a side crunch), then lowers under control. The
 * hips are the fixed point and the pelvis does not turn.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";

const HIP = [90, 130]; // high enough that the lower shoulder and hip rest on the floor

// Torso tilt (hip -> neck): lying flat to the left, and lifted.
const T_DOWN = 274;
const T_UP = 302;

// Top hand behind the head, elbow open; the bottom arm crosses the chest and
// the hand holds the top shoulder, for a torso tilt T.
function upper(T) {
  const neck = point(HIP, 32, T);
  const head = point(neck, 15, T);
  const topShoulder = point(neck, 13, T + 90);
  return {
    ...arm("R", topShoulder, point(head, 6, T + 90), "up"),
    ...arm("L", point(neck, 13, T - 90), point(topShoulder, 2, T + 180), "fwd"),
  };
}

// The pelvis stays square while the trunk bends.
const PELVIS = { pelvisR: T_DOWN + 90, pelvisL: T_DOWN - 90 };
const HIP_R = point(HIP, 6, T_DOWN + 90); // top hip
const HIP_L = point(HIP, 6, T_DOWN - 90); // bottom hip

export default {
  view: "front",
  root: "hip",
  at: HIP,
  lengths: { footL: 5, footR: 5 },

  start: {
    ...STAND_FRONT,
    torso: T_DOWN,
    head: T_DOWN,
    clavL: T_DOWN - 90,
    clavR: T_DOWN + 90,
    ...PELVIS,
    ...upper(T_DOWN),
    // legs straight and stacked along the floor (targets just out of reach,
    // so both legs stay fully straight)
    ...leg("R", HIP_R, [152, 129], "up"),
    ...leg("L", HIP_L, [152, 141], "up"),
    footR: 90,
    footL: 90,
  },

  poses: {
    up: { torso: T_UP, head: T_UP, ...PELVIS, ...upper(T_UP) },
  },

  timeline: [
    { to: "up", s: 0.6, ease: "fast", say: "Subí de costado" },
    { to: "up", s: 0.2 },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá controlado" },
    { to: "start", s: 0.3 },
  ],
};
