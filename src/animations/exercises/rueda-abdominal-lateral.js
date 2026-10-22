/*
 * Rueda abdominal a los laterales (vuelta: abdomen estirado, paso 5)
 * Front view, kneeling and leaning toward the camera with both hands on an
 * ab wheel in front of the knees (the trunk and thighs point partly at the
 * camera, so they are drawn shorter). The wheel rolls out diagonally to
 * one side as the trunk leans long over it, comes back with the abs, then
 * goes to the other side. The hips are the fixed point; the knees stay
 * planted.
 */
import { STAND_FRONT, arm, mirror, point } from "../engine/helpers.js";

const HIP = [80, 120];
// Foreshortened lengths: trunk and thighs lean toward the camera.
const TORSO = 20;
const CLAV = 11;
const WHEEL_R = 7;
const WHEEL_Y = 148 - WHEEL_R;
const WHEEL_IN = [80, WHEEL_Y];
const WHEEL_LEFT = [46, WHEEL_Y];
const WHEEL_RIGHT = [114, WHEEL_Y];

// Both hands on the wheel's axle for a torso lean T (0 = upright).
function reachTo(T, wheel) {
  const neck = point(HIP, TORSO, T);
  return {
    torso: T,
    head: T,
    clavL: T - 90,
    clavR: T + 90,
    ...arm("R", point(neck, CLAV, T + 90), [wheel[0] + 3, wheel[1] - 2], "fwd"),
    ...arm("L", point(neck, CLAV, T - 90), [wheel[0] - 3, wheel[1] - 2], "back"),
  };
}

// Knees on the floor; the shins point at the camera, so they look short.
const LEGS = { ...mirror("pelvis", 90), ...mirror("thigh", 180), ...mirror("shin", 180) };

export default {
  view: "front",
  root: "hip",
  at: HIP,
  lengths: { torso: TORSO, clavL: CLAV, clavR: CLAV, thighL: 21, thighR: 21, shinL: 3, shinR: 3 },
  hide: ["footL", "footR"],

  start: {
    ...STAND_FRONT,
    ...LEGS,
    ...reachTo(0, WHEEL_IN),
  },

  poses: {
    left: { ...LEGS, ...reachTo(290, WHEEL_LEFT) },
    right: { ...LEGS, ...reachTo(70, WHEEL_RIGHT) },
  },

  timeline: [
    { to: "left", s: 1, ease: "slow", say: "Diagonal a un lado" },
    { to: "start", s: 0.8, say: "Volvé con el abdomen" },
    { to: "right", s: 1, ease: "slow", say: "Diagonal al otro lado" },
    { to: "start", s: 0.8, say: "Volvé con el abdomen" },
    { to: "start", s: 0.3 },
  ],

  props: [
    {
      kind: "disc",
      c: WHEEL_IN,
      r: WHEEL_R,
      shift: { left: [WHEEL_LEFT[0] - WHEEL_IN[0], 0], right: [WHEEL_RIGHT[0] - WHEEL_IN[0], 0] },
      layer: "front",
    },
  ],
};
