/*
 * Alcance de cangrejo / Crab Reach (Animal Flow)
 * Side view, face up with the head to the left. From the crab, the feet
 * drive the hips up high while the near (lighter) arm lifts and reaches
 * long over the head toward the far side; the far hand stays planted.
 * Back down to the crab. The hips set the place; feet and the planted
 * hand stay put.
 */
import { STAND_SIDE, point } from "../engine/helpers.js";
import { CRAB, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = CRAB.hip;
const HANDS_L = shift(CRAB.hands, FAR);

const REACH_HIP = [80, 116];
const REACH_TORSO = 280;
const REACH_NECK = point(REACH_HIP, 32, REACH_TORSO);

const pose = ({ hip, torso, head, handR }) =>
  quad({
    base: AT,
    hip,
    torso,
    head,
    handR,
    handL: HANDS_L,
    ankleR: CRAB.ankles,
    ankleL: shift(CRAB.ankles, FAR),
    footR: CRAB.foot,
    footL: CRAB.foot,
    knees: "up",
    elbows: "back",
  });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(pose({ hip: AT, torso: CRAB.torso, head: 327, handR: CRAB.hands })) },

  poses: {
    reach: pose({
      hip: REACH_HIP,
      torso: REACH_TORSO,
      head: 262, // looking back toward the planted hand
      handR: point(REACH_NECK, 40, 318), // over the head
    }),
  },

  timeline: [
    { to: "reach", s: 1.1, ease: "slow", say: "Cadera arriba, brazo por encima" },
    { to: "reach", s: 0.8, say: "Mirá la mano de apoyo" },
    { to: "start", s: 1, ease: "slow", say: "Bajá al cangrejo" },
    { to: "start", s: 0.5 },
  ],
};
