/*
 * Patada frontal / Front Kickthrough (Animal Flow)
 * Side view. From the beast (face down, head right), the body turns over
 * through the same low middle position as the underswitch into an almost
 * crab (face up, head still right), and the near (lighter) leg kicks up
 * and forward, long and straight; then back the same way to the beast.
 * The far foot and the hands stay planted when they carry weight. The
 * hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = BEAST.hip;

const BEAST_POSE = quad({
  base: AT,
  hip: AT,
  torso: BEAST.torso,
  head: BEAST.torso - 4,
  handR: BEAST.hands,
  handL: shift(BEAST.hands, FAR),
  ankleR: BEAST.ankles,
  ankleL: shift(BEAST.ankles, FAR),
  footR: BEAST.foot,
  footL: BEAST.foot,
});

// Halfway: far hand up, near leg threading forward under the trunk.
const THREAD = quad({
  base: AT,
  hip: [64, 122],
  torso: 70,
  head: 80,
  handR: BEAST.hands,
  handL: [112, 118],
  ankleR: [96, 134],
  ankleL: shift(BEAST.ankles, FAR),
  footR: 90,
  footL: BEAST.foot,
  knees: "up", // hips low: knees bend up, off the floor
  elbowsL: "down",
});

// Turned face up, head right, the near leg kicking up and away.
const KICK = {
  ...quad({
    base: AT,
    hip: [62, 124],
    torso: 50,
    head: 35,
    handR: [96, 144],
    handL: [93, 144],
    ankleR: [24, 144],
    ankleL: [21, 144],
    footR: 270,
    footL: 270,
    knees: "up",
    elbows: "fwd",
  }),
  thighR: 302, // near leg straight, up and away
  shinR: 302,
  footR: 330,
};

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(BEAST_POSE) },

  poses: { thread: THREAD, kick: KICK },

  timeline: [
    { to: "thread", s: 0.6, say: "Girá sobre la mano de apoyo" },
    { to: "kick", s: 0.5, ease: "fast", say: "Pateá adelante, pierna estirada" },
    { to: "kick", s: 0.5, say: "Pateá adelante, pierna estirada" },
    { to: "thread", s: 0.6, say: "Volvé a la bestia" },
    { to: "start", s: 0.6, say: "Volvé a la bestia" },
    { to: "start", s: 0.5 },
  ],
};
