/*
 * Plegado en V torcido (vuelta: abdomen isométrico, pasos 2 y 3)
 * Side view, balanced on the seat in the V (torso back with the arms
 * overhead along it, legs straight and up). The trunk twists to one side
 * and holds: the near (lighter) arm comes down beside the hip while the far
 * (darker) arm reaches back behind the body, showing the torsion. Back to
 * the V; the other side is done the same way. The hold stands for the
 * 10 s hold. The hips are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [84, 141];

const V = {
  torso: 320,
  head: 332,
  ...both("thigh", 50),
  ...both("shin", 50),
  ...both("foot", 40),
  armR: 318,
  forearmR: 318,
  armL: 323,
  forearmL: 323,
};

// Twisted: the trunk drops a little, the near hand goes down beside the hip
// and the far hand reaches back, away from it.
const TORSO_TWIST = 326;
const NECK_TWIST = neckFrom(HIP, TORSO_TWIST);
const TWIST = {
  ...V,
  torso: TORSO_TWIST,
  head: 340,
  ...arm("R", NECK_TWIST, [HIP[0] + 14, HIP[1] - 6], "fwd"),
  ...arm("L", NECK_TWIST, [NECK_TWIST[0] - 38, NECK_TWIST[1] - 4], "up"),
};

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: { ...STAND_SIDE, ...V },

  poses: { twist: TWIST },

  timeline: [
    { to: "twist", s: 0.7, say: "Girá hacia un lado" },
    { to: "twist", s: 1.6, say: "Sostené" },
    { to: "start", s: 0.6, say: "Volvé a la V" },
    { to: "start", s: 0.8, say: "Después cambiá de lado" },
  ],
};
