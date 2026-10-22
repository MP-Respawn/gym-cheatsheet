/*
 * Caminata de mono / Ape Travel, lateral (Animal Flow)
 * Front view, in the ape: deep squat with the knees out and the hands on
 * the floor between the feet (the trunk leans toward the camera, so it is
 * drawn shorter). The hands reach out to one side, the hips hop over and
 * land in the ape again beside them; then a hop back the other way, so the
 * loop closes in place. The hips set the place.
 */
import { STAND_FRONT, arm, leg, point } from "../engine/helpers.js";
import { asStart } from "../engine/poses.js";

const AT = [80, 126];
const TORSO = 22; // foreshortened trunk
const CLAV = 11;
const HOP = 24;

// The ape at hip position `hip`, trunk tilt `t`, hands at `hands` and feet at `feet`.
function ape(hip, t, hands, feet) {
  const neck = point(hip, TORSO, t);
  return {
    $root: [hip[0] - AT[0], hip[1] - AT[1]],
    torso: t,
    head: t,
    clavR: t + 90,
    clavL: t - 90,
    pelvisR: 90,
    pelvisL: 270,
    ...arm("R", point(neck, CLAV, t + 90), hands[0], "fwd"),
    ...arm("L", point(neck, CLAV, t - 90), hands[1], "back"),
    ...leg("R", point(hip, 6, 90), feet[0], "fwd"),
    ...leg("L", point(hip, 6, 270), feet[1], "back"),
    footR: 90,
    footL: 270,
  };
}

// Hands and feet of the ape centered at x.
const handsAt = (x) => [[x + 6, 144], [x - 6, 144]];
const feetAt = (x, y = 144) => [[x + 16, y], [x - 16, y]];

export default {
  view: "front",
  root: "hip",
  at: AT,
  lengths: { torso: TORSO, clavL: CLAV, clavR: CLAV, footL: 6, footR: 6 },

  start: { ...STAND_FRONT, ...asStart(ape(AT, 0, handsAt(80), feetAt(80))) },

  poses: {
    // to the left: hands reach out, hips hop over, land in the ape
    reachLeft: ape([80, 130], 330, handsAt(80 - 18), feetAt(80)),
    hopLeft: ape([80 - HOP / 2, 118], 340, handsAt(80 - 18), feetAt(80 - HOP / 2, 134)),
    landLeft: ape([80 - HOP, 126], 0, handsAt(80 - HOP), feetAt(80 - HOP)),
    // and back to the right
    reachRight: ape([80 - HOP, 130], 30, handsAt(80 - HOP + 18), feetAt(80 - HOP)),
    hopRight: ape([80 - HOP / 2, 118], 20, handsAt(80 - HOP + 18), feetAt(80 - HOP / 2, 134)),
  },

  timeline: [
    { to: "reachLeft", s: 0.5, say: "Primero las manos" },
    { to: "hopLeft", s: 0.3, ease: "fast", say: "Saltá con la cadera" },
    { to: "landLeft", s: 0.35, ease: "slow", say: "Caé suave en mono" },
    { to: "landLeft", s: 0.3 },
    { to: "reachRight", s: 0.5, say: "Primero las manos" },
    { to: "hopRight", s: 0.3, ease: "fast", say: "Saltá con la cadera" },
    { to: "start", s: 0.35, ease: "slow", say: "Caé suave en mono" },
    { to: "start", s: 0.3 },
  ],
};
