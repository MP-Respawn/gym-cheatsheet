/*
 * Plegado en V torcido (vuelta: abdomen isométrico, pasos 2 y 3)
 * Side view, balanced on the seat in the V (torso back, legs straight and
 * up). The trunk twists to one side and holds: the hands come down
 * together beside the hip, the near (lighter) arm leading. Back to the V,
 * then the twist to the other side with the far (darker) arm leading.
 * Each hold stands for the 10 s hold. The hips are the fixed point.
 */
import { STAND_SIDE, arm, both, neckFrom } from "../engine/helpers.js";

const HIP = [84, 141];

const V = {
  torso: 320,
  head: 332,
  ...both("thigh", 50),
  ...both("shin", 50),
  ...both("foot", 40),
  armR: 58,
  forearmR: 58,
  armL: 61,
  forearmL: 61,
};

// Twisted: the trunk drops a little and the hands go down beside the hip.
const TORSO_TWIST = 326;
const NECK_TWIST = neckFrom(HIP, TORSO_TWIST);
const twist = (lead, follow) => ({
  ...V,
  torso: TORSO_TWIST,
  head: 340,
  ...arm(lead, NECK_TWIST, [HIP[0] + 14, HIP[1] - 6], "fwd"),
  ...arm(follow, NECK_TWIST, [HIP[0] + 8, HIP[1] - 12], "fwd"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: { ...STAND_SIDE, ...V },

  poses: {
    nearSide: twist("R", "L"),
    farSide: twist("L", "R"),
  },

  timeline: [
    { to: "nearSide", s: 0.7, say: "Girá hacia un lado" },
    { to: "nearSide", s: 1.6, say: "Sostené" },
    { to: "start", s: 0.6, say: "Volvé a la V" },
    { to: "farSide", s: 0.7, say: "Girá hacia el otro lado" },
    { to: "farSide", s: 1.6, say: "Sostené" },
    { to: "start", s: 0.6, say: "Volvé a la V" },
    { to: "start", s: 0.3 },
  ],
};
