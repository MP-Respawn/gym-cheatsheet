/*
 * Mariposa / Baddha Konasana (yoga)
 * Front view, sitting on the floor with the soles of the feet together in
 * front and the knees open to the sides, hands holding the feet, back
 * tall. The knees float down and up a few times like wings, then rest
 * low for the hold. The hips are the fixed point.
 */
import { STAND_FRONT, arm, mirror, point } from "../engine/helpers.js";

const HIP = [80, 134];
const NECK = point(HIP, 32, 0);

// Knees open at angle K (90 = flat to the side): thighs out, shins back
// in so the feet meet in front of the hips.
const wings = (k) => ({
  ...mirror("thigh", k),
  ...mirror("shin", 256 + (k - 78) * 0.2),
  ...mirror("foot", 180),
});

const HANDS = {
  ...arm("R", point(NECK, 13, 90), [HIP[0] + 5, HIP[1] + 4], "fwd"),
  ...arm("L", point(NECK, 13, 270), [HIP[0] - 5, HIP[1] + 4], "back"),
};

export default {
  view: "front",
  root: "hip",
  at: HIP,
  lengths: { footL: 4, footR: 4 }, // soles together, pointing at the camera

  start: { ...STAND_FRONT, ...wings(78), ...HANDS },

  poses: {
    low: { ...wings(90), ...HANDS },
  },

  timeline: [
    { to: "low", s: 0.6, say: "Rodillas como alas" },
    { to: "start", s: 0.6, say: "Rodillas como alas" },
    { to: "low", s: 0.6, say: "Rodillas como alas" },
    { to: "start", s: 0.6, say: "Rodillas como alas" },
    { to: "low", s: 0.8, ease: "slow", say: "Sostené con la espalda larga" },
    { to: "low", s: 2, say: "Sostené con la espalda larga" },
    { to: "start", s: 0.8, ease: "slow" },
  ],
};
