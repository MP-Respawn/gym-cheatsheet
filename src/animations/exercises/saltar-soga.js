/*
 * Saltar la soga
 * Front view, standing, a short handle in each hand. The elbows stay tucked
 * at the sides and the forearms point out at hip height; the wrists turn a
 * little between poses. Small hops: the hips rise about 8 units and the
 * feet tuck up slightly, then land on the balls of the feet.
 * Cues shown: low hops, turn from the wrists, land on the toes.
 * Simplification: the rope is a fixed arc from hand to hand that passes
 * under the feet; it does not swing. The figure hopping over it reads as a
 * jump rope at a glance.
 */
import { STAND_FRONT, mirror } from "../engine/helpers.js";

export default {
  view: "front",
  root: "hip",
  at: [80, 84],

  start: {
    ...STAND_FRONT,
    // elbows at the sides, forearms out at hip height
    ...mirror("arm", 175),
    ...mirror("forearm", 104),
  },

  poses: {
    // in the air: hips up 8, knees soft and feet tucked, wrists turned
    hop: {
      $root: [0, -8],
      ...mirror("thigh", 180),
      ...mirror("shin", 186),
      ...mirror("forearm", 116),
    },
  },

  timeline: [
    { to: "hop", s: 0.25, ease: "fast", say: "Saltos bajitos" },
    { to: "start", s: 0.3, ease: "in", say: "Girá desde las muñecas" },
    { to: "hop", s: 0.25, ease: "fast", say: "Saltos bajitos" },
    { to: "start", s: 0.3, ease: "in", say: "Caé en la punta de los pies" },
    { to: "start", s: 0.2 },
  ],

  props: [
    // the rope: an arc from hand to hand, lowest point just under the feet
    { kind: "path", d: "M113.5 79.7 Q80 210 46.5 79.7", cls: "gear cable", layer: "back" },
    // a short handle in each hand
    { kind: "line", on: "forearmR", from: [0, -4], to: [0, 4] },
    { kind: "line", on: "forearmL", from: [0, -4], to: [0, 4] },
  ],
};
