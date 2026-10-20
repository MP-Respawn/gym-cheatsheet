/*
 * Peso muerto
 * Side view, facing right. Barbell from standing down to just above the
 * floor and back up, finishing on the toes with a 1 second hold, as the
 * trainer asks. The near toe is the fixed point, so the heels can lift.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP_LOW = [60, 95]; // hips high and back: it is a hinge, not a squat
const TORSO_LOW = 86; // almost horizontal, back straight
const BAR_LOW = [92, 135]; // plate just off the floor, in front of the shins

export default {
  view: "side",
  root: "toeR",
  at: [92, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", [80, 84], [77, 144]),
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, [80, 144]),
      ...leg("L", HIP_LOW, [77, 144]),
      ...both("foot", 90),
      torso: TORSO_LOW,
      ...arm("R", neckFrom(HIP_LOW, TORSO_LOW), BAR_LOW, "back"),
      ...arm("L", neckFrom(HIP_LOW, TORSO_LOW), [BAR_LOW[0] - 2, BAR_LOW[1]], "back"),
    },
    // up on the toes: the feet tilt, the straight body rises
    toes: {
      ...both("foot", 122),
    },
  },

  timeline: [
    { to: "bottom", s: 1.8, ease: "slow", say: "Bajá con control, cola atrás" },
    { to: "bottom", s: 0.3 },
    { to: "start", s: 1.2, say: "Subí controlado" },
    { to: "toes", s: 0.4, say: "Puntas de pie" },
    { to: "toes", s: 1, say: "Frená 1 segundo" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // barbell plate in the hands
    { kind: "disc", on: "forearmR", r: 9 },
  ],
};
