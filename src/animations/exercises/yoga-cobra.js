/*
 * Cobra / Bhujangasana (yoga)
 * Side view, facing right, lying face down with the legs long behind and
 * the hands planted beside the chest, elbows in. The chest and head lift
 * with the back, the elbows stay bent and the hips stay on the floor; hold,
 * then lower slowly. The hips are the fixed point; the hands stay put.
 */
import { STAND_SIDE, arm, neckFrom } from "../engine/helpers.js";

const HIP = [70, 139];
const HANDS = [110, 144];
const TORSO_DOWN = 87;
const TORSO_UP = 54;

const arms = (torso) => ({
  ...arm("R", neckFrom(HIP, torso), HANDS, "up"), // elbows up and back, close to the body
  ...arm("L", neckFrom(HIP, torso), [HANDS[0] - 3, HANDS[1]], "up"),
});

export default {
  view: "side",
  root: "hip",
  at: HIP,
  lengths: { footL: 5, footR: 5 }, // tops of the feet on the floor

  start: {
    ...STAND_SIDE,
    torso: TORSO_DOWN,
    head: 84,
    ...arms(TORSO_DOWN),
    thighR: 271,
    shinR: 271,
    thighL: 270,
    shinL: 270,
    footR: 250,
    footL: 250,
  },

  poses: {
    up: { torso: TORSO_UP, head: 42, ...arms(TORSO_UP) },
  },

  timeline: [
    { to: "up", s: 1.2, ease: "slow", say: "Subí el pecho con la espalda" },
    { to: "up", s: 1.8, say: "Cadera y piernas en el piso" },
    { to: "start", s: 1.2, ease: "slow", say: "Bajá despacio" },
    { to: "start", s: 0.4 },
  ],
};
