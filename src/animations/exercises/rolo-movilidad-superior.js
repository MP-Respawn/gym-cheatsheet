/*
 * Rolo + movilidad articular de tren superior
 * Side view, lying face up with the head to the left, a foam roller under
 * the upper back, knees bent, feet flat and hips slightly lifted, hands
 * behind the head. The body rolls slowly along the roller, from the top of
 * the shoulders down to mid back and never onto the low back, as the
 * trainer asks. Then both arms reach long overhead to open the chest, a
 * short hold, and back. The roller stays put (a real one would roll a bit).
 * The hips are the root and slide with $root; the legs reach to fixed
 * ankle points so the feet stay planted.
 */
import { STAND_SIDE, FEET_FLAT, angleBetween, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [81, 126];
const ROLLER = [56, 140]; // center, radius 7
const CONTACT = [56, 129.5]; // where the back line rests on top of it
const ANKLE_R = [118, 144];
const ANKLE_L = [114, 144];

// Body angles for the hips slid by dx: the back stays on the roller, the
// feet stay planted. Arms are left out so they ride along with the torso.
function roll(dx) {
  const hip = [HIP[0] + dx, HIP[1]];
  const torso = angleBetween(hip, CONTACT);
  return {
    torso,
    head: torso + 5,
    ...leg("R", hip, ANKLE_R, "up"),
    ...leg("L", hip, ANKLE_L, "up"),
    ...FEET_FLAT,
  };
}

const START = roll(0);
const NECK = neckFrom(HIP, START.torso);

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...START,
    // fingers behind the head, elbows up
    ...arm("R", NECK, [38, 126], "up"),
    ...arm("L", NECK, [36, 127], "up"),
  },

  poses: {
    shoulders: { $root: [5, 0], ...roll(5) }, // roller at the top of the shoulder blades
    midBack: { $root: [-5, 0], ...roll(-5) }, // roller at mid back, above the low back
    // arms long overhead, chest open
    open: { armR: 258, forearmR: 258, armL: 256, forearmL: 256 },
  },

  timeline: [
    { to: "shoulders", s: 0.9, ease: "slow", say: "Rolo en la espalda alta" },
    { to: "midBack", s: 1.3, ease: "slow", say: "Rolo en la espalda alta" },
    { to: "start", s: 0.8, ease: "slow", say: "Rolo en la espalda alta" },
    { to: "open", s: 0.8, say: "Brazos atrás, abrí el pecho" },
    { to: "open", s: 1.2, say: "Brazos atrás, abrí el pecho" },
    { to: "start", s: 0.8 },
  ],

  props: [
    // foam roller under the upper back
    { kind: "disc", c: ROLLER, r: 7 },
  ],
};
