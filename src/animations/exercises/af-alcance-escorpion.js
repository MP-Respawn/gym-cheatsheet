/*
 * Alcance de escorpión / Scorpion Reach (Animal Flow)
 * Side view, facing right. From the beast, one leg lifts behind with the
 * knee bent and the heel arcing up and over the body like a scorpion's
 * tail while the hips rise and turn (the turn toward the camera cannot be
 * drawn, so the leg arcs up over the back). Back to the beast, then the
 * other leg: near (lighter) leg first, far (darker) second. Hands and the
 * supporting toes stay planted; the hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;
const SCORPION_HIP = [68, 100];

const pose = (hip, torso) =>
  quad({
    base: AT,
    hip,
    torso,
    head: torso - 8,
    handR: BEAST.hands,
    handL: shift(BEAST.hands, FAR),
    ankleR: BEAST.ankles,
    ankleL: shift(BEAST.ankles, FAR),
    footR: BEAST.foot,
    footL: BEAST.foot,
  });

// The tail: thigh up and back, shin bent up and over, sole toward the sky.
const tail = (side) => ({ [`thigh${side}`]: 312, [`shin${side}`]: 38, [`foot${side}`]: 60 });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(pose(AT, BEAST.torso)) },

  poses: {
    nearTail: { ...pose(SCORPION_HIP, 90), ...tail("R") },
    farTail: { ...pose(SCORPION_HIP, 90), ...tail("L") },
  },

  timeline: [
    { to: "nearTail", s: 1.1, ease: "slow", say: "Pierna arriba en arco" },
    { to: "nearTail", s: 0.5, say: "Talón al techo" },
    { to: "start", s: 0.9, say: "Volvé a la bestia" },
    { to: "farTail", s: 1.1, ease: "slow", say: "Ahora la otra pierna" },
    { to: "farTail", s: 0.5, say: "Talón al techo" },
    { to: "start", s: 0.9, say: "Volvé a la bestia" },
  ],
};
