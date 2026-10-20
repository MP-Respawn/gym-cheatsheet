/*
 * Sentadilla goblet con mancuerna
 * Side view, facing right. One dumbbell held upright against the chest with
 * both hands, elbows pointing down. A deep squat (hips below the knees)
 * with the chest up: the torso leans only about 18 degrees, much more
 * upright than the barbell squat, and the knees travel forward over the
 * toes. At the bottom the elbows sit down between the knees.
 * Cues shown: chest up with the dumbbell glued to the body, elbows inside
 * the knees. (Inside vs outside is depth, so from the side it shows as
 * the elbows reaching down to knee height.)
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const NECK_TOP = [80, 52];

// Deep bottom: hips under knee height, shins well forward, chest tall.
const HIP_LOW = [67, 122];
const TORSO_LOW = 18;
const NECK_LOW = neckFrom(HIP_LOW, TORSO_LOW);

// Hands just in front of the chest at shoulder height (relative to the
// neck). The elbows fold straight down under the hands.
const hands = (neck, dx) => [neck[0] + dx, neck[1] + 1];

export default {
  view: "side",
  root: "ankleR",
  at: [80, 144],

  start: {
    ...STAND_SIDE,
    ...leg("L", [80, 84], [76, 144]),
    ...arm("R", NECK_TOP, hands(NECK_TOP, 8), "down"),
    ...arm("L", NECK_TOP, hands(NECK_TOP, 6), "down"),
  },

  poses: {
    bottom: {
      ...leg("R", HIP_LOW, [80, 144]),
      ...leg("L", HIP_LOW, [76, 144]),
      ...both("foot", 90),
      torso: TORSO_LOW,
      head: 5, // eyes forward, chest up
      ...arm("R", NECK_LOW, hands(NECK_LOW, 9), "down"),
      ...arm("L", NECK_LOW, hands(NECK_LOW, 7), "down"),
    },
  },

  timeline: [
    { to: "start", s: 0.4, say: "Pecho arriba" },
    { to: "bottom", s: 1.5, ease: "slow", say: "Codos adentro de las rodillas" },
    { to: "bottom", s: 0.4, say: "Codos adentro de las rodillas" },
    { to: "start", s: 1.1, say: "Pecho arriba" },
  ],

  props: [
    // the dumbbell, standing upright between the hands against the chest
    // (handle plus one round head at each end, held below the chin)
    { kind: "line", on: "forearmR", from: [-2, -3], to: [-2, 9] },
    { kind: "disc", on: "forearmR", dx: -2, dy: -4, r: 4, fill: true },
    { kind: "disc", on: "forearmR", dx: -2, dy: 10, r: 4, fill: true },
  ],
};
