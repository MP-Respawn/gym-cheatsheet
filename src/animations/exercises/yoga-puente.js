/*
 * Puente / Setu Bandhasana (yoga)
 * Side view, lying on the back with the head to the left, knees bent and
 * feet flat near the seat, arms long on the floor. The hips rise until the
 * thighs and trunk make one line from the shoulders to the knees; held
 * with the breath, then the back lowers slowly. The shoulders are the
 * fixed point; the feet stay planted.
 */
import { STAND_SIDE, angleBetween, both, leg, point } from "../engine/helpers.js";

const NECK = [40, 140];
const ANKLE = [100, 144];

const HIP_DOWN = [72, 140];
const HIP_UP = point(NECK, 32, 66);

const ARMS = { ...both("arm", 92), ...both("forearm", 90) }; // long on the floor

const body = (hip) => ({
  torso: angleBetween(hip, NECK),
  head: 280,
  ...ARMS,
  ...leg("R", hip, ANKLE, "up"),
  ...leg("L", hip, [ANKLE[0] - 3, ANKLE[1]], "up"),
  ...both("foot", 90),
});

export default {
  view: "side",
  root: "neck",
  at: NECK,

  start: { ...STAND_SIDE, ...body(HIP_DOWN) },

  poses: {
    bridge: body(HIP_UP),
  },

  timeline: [
    { to: "bridge", s: 1.2, ease: "slow", say: "Subí la cadera apretando glúteos" },
    { to: "bridge", s: 2.4, say: "Sostené respirando" },
    { to: "start", s: 1.4, ease: "slow", say: "Bajá vértebra por vértebra" },
    { to: "start", s: 0.4 },
  ],
};
