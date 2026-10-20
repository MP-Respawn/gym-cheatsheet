/*
 * Remo bajo con barra libre
 * Side view, facing right. More bent over than remo-cruz (torso about 75
 * degrees from vertical, almost flat) with the knees clearly bent; the near
 * ankle is the fixed point. The bar travels from hanging under the shoulders
 * to the BELLY BUTTON, with the elbows tucked: the upper arm slides back
 * along the body instead of opening up. Pull, squeeze, controlled way down.
 * The pyramid (15/12/10) is shown as a reminder label at the bottom.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP = [58, 96];
const TORSO = 75; // almost flat, back straight
const SHOULDER = neckFrom(HIP, TORSO);

// Belly button: about 40% of the way up the torso, a few units under it.
const BELLY = [72, 101];

export default {
  view: "side",
  root: "ankleR",
  at: [76, 144],

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: 80,
    ...leg("R", HIP, [76, 144]),
    ...leg("L", HIP, [72, 144]),
    ...both("foot", 90),
    // arms hanging straight down, bar under the shoulders
    ...both("arm", 180),
    ...both("forearm", 180),
    armL: 182,
    forearmL: 182,
  },

  poses: {
    // elbows go back close to the ribs, bar to the belly button
    top: {
      ...arm("R", SHOULDER, BELLY, "up"),
      ...arm("L", SHOULDER, [BELLY[0] - 2, BELLY[1]], "up"),
    },
  },

  timeline: [
    { to: "top", s: 0.8, say: "Barra al ombligo" },
    { to: "top", s: 0.4, say: "Codos pegados" },
    { to: "start", s: 1.1, ease: "slow", say: "Pirámide 15/12/10" },
    { to: "start", s: 0.5, say: "Pirámide 15/12/10" },
  ],

  props: [
    // barbell seen from the side (a plate) in the hands
    { kind: "disc", on: "forearmR", r: 9 },
  ],
};
