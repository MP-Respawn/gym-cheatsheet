/*
 * Caminata de cangrejo / Crab Travel (Animal Flow)
 * Side view, face up with the head to the left, in the crab (hips
 * hovering). Two steps toward the feet with opposite hand and foot moving
 * together, the hips staying up, then two steps back to where it started,
 * so the loop closes in place. The hips set the place.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { CRAB, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = CRAB.hip;
const STEP = 12;
const LIFT_HAND = 7;
const LIFT_FOOT = 7;

function crawl({ hip, nearHand, farHand, nearFoot, farFoot }) {
  const hand = ([dx, up], far) => shift(CRAB.hands, dx + (far ? FAR : 0), up ? -LIFT_HAND : 0);
  const foot = ([dx, up], far) => shift(CRAB.ankles, dx + (far ? FAR : 0), up ? -LIFT_FOOT : 0);
  return quad({
    base: AT,
    hip: shift(AT, hip),
    torso: CRAB.torso,
    head: CRAB.torso + 20,
    handR: hand(nearHand, false),
    handL: hand(farHand, true),
    ankleR: foot(nearFoot, false),
    ankleL: foot(farFoot, true),
    footR: CRAB.foot,
    footL: CRAB.foot,
    knees: "up",
    elbows: "back",
  });
}

const H = STEP / 2;
const DOWN = (dx) => [dx, false];
const UP = (dx) => [dx, true];

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(crawl({ hip: 0, nearHand: DOWN(0), farHand: DOWN(0), nearFoot: DOWN(0), farFoot: DOWN(0) })) },

  poses: {
    fwdA: crawl({ hip: H / 2, nearHand: UP(H), farHand: DOWN(0), nearFoot: DOWN(0), farFoot: UP(H) }),
    fwdA2: crawl({ hip: H, nearHand: DOWN(STEP), farHand: DOWN(0), nearFoot: DOWN(0), farFoot: DOWN(STEP) }),
    fwdB: crawl({ hip: H + H / 2, nearHand: DOWN(STEP), farHand: UP(STEP - H), nearFoot: UP(H), farFoot: DOWN(STEP) }),
    fwdB2: crawl({ hip: STEP, nearHand: DOWN(STEP), farHand: DOWN(STEP), nearFoot: DOWN(STEP), farFoot: DOWN(STEP) }),
    backA: crawl({ hip: STEP - H / 2, nearHand: UP(H), farHand: DOWN(STEP), nearFoot: DOWN(STEP), farFoot: UP(H) }),
    backA2: crawl({ hip: H, nearHand: DOWN(0), farHand: DOWN(STEP), nearFoot: DOWN(STEP), farFoot: DOWN(0) }),
    backB: crawl({ hip: H / 2, nearHand: DOWN(0), farHand: UP(H), nearFoot: UP(H), farFoot: DOWN(0) }),
  },

  timeline: [
    { to: "fwdA", s: 0.35, say: "Cadera arriba, mano y pie contrarios" },
    { to: "fwdA2", s: 0.35, say: "Cadera arriba, mano y pie contrarios" },
    { to: "fwdB", s: 0.35, say: "Cadera arriba, mano y pie contrarios" },
    { to: "fwdB2", s: 0.35, say: "Cadera arriba, mano y pie contrarios" },
    { to: "backA", s: 0.4, say: "Ahora para el otro lado" },
    { to: "backA2", s: 0.4, say: "Ahora para el otro lado" },
    { to: "backB", s: 0.4, say: "Ahora para el otro lado" },
    { to: "start", s: 0.4, say: "Ahora para el otro lado" },
    { to: "start", s: 0.4 },
  ],
};
