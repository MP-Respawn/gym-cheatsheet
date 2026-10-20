/*
 * Eversión e inversión de tobillo con banda
 * Close-up, front view of the lower legs (zoomed square viewBox), sitting
 * on a chair. Only the thighs (seen short, pointing at us), shins and feet
 * are drawn. An elastic band runs from a post on the outside to the right
 * foot; the foot sweeps sideways: in toward the other foot (stretching the
 * band) and out past neutral, twice, with the toes kept up toward the
 * shin. The hips are the fixed point; nothing but the right foot moves.
 * Simplification: one band on the outside for both directions (in real
 * life the band switches sides for the "out" set), and the foot is drawn
 * pointing down/at the camera so its sideways sweep is easy to see.
 * The close-up keeps the viewBox origin at 0,0 (rotations pivot wrongly in
 * the browser when it is not), so the legs sit near the top-left of the
 * usual drawing and the floor is moved up to y = 88 to match.
 */
import { STAND_FRONT } from "../engine/helpers.js";

const POST = [84, 80]; // where the band is tied

export default {
  view: "front",
  root: "hip",
  at: [45, 28],
  viewBox: [0, 0, 90, 90],
  floor: 88,
  stroke: 5,
  // seated: thighs point at the camera (short); a bit longer shins and
  // feet so the close-up fills the box
  lengths: { thighL: 14, thighR: 14, shinL: 36, shinR: 36, footL: 11, footR: 11 },
  // everything above the hips is out of the close-up
  hide: ["torso", "head", "clavL", "clavR", "armL", "armR", "forearmL", "forearmR", "pelvisL", "pelvisR"],

  start: {
    ...STAND_FRONT,
    thighL: 225,
    thighR: 135,
    shinL: 181,
    shinR: 179,
    footL: 212, // resting foot, toes turned a little out
    footR: 148, // working foot, neutral
  },

  poses: {
    in: { footR: 198 }, // toward the other foot, band stretched
    out: { footR: 112 }, // away from it
  },

  timeline: [
    { to: "start", s: 0.6, say: "Punta del pie cerca de la tibia" },
    { to: "in", s: 0.6, say: "Hacia adentro" },
    { to: "out", s: 0.8, say: "Hacia afuera" },
    { to: "in", s: 0.6, say: "Hacia adentro" },
    { to: "out", s: 0.8, say: "Hacia afuera" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // chair seat and legs
    { kind: "rect", x: 16, y: 34, w: 58, h: 4 },
    { kind: "line", from: [19, 38], to: [19, 88] },
    { kind: "line", from: [71, 38], to: [71, 88] },
    // post and the elastic band to the toes of the working foot
    { kind: "line", from: [POST[0], 44], to: [POST[0], 88] },
    { kind: "cable", anchor: POST, to: "toeR", band: true },
  ],
};
