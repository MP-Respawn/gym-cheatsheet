/*
 * Batidoras / Egg beaters (Jiu Jitsu)
 * Side view, lying on the back with the head to the left, shoulders on the
 * floor and the legs up with the knees a little bent. Each leg circles
 * (seen from the side as up, out, down, back), the two legs half a circle
 * apart like a mixer's beaters; four circles' worth, then they reverse.
 * The hips are the fixed point.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const AT = [76, 140];

// One point of a leg's circle, `phase` in quarter turns.
const legAt = (phase) =>
  [
    { thigh: 352, shin: 10 }, // up
    { thigh: 28, shin: 70 }, // out toward the feet side
    { thigh: 50, shin: 40 }, // low
    { thigh: 14, shin: 330 }, // back in
  ][((phase % 4) + 4) % 4];

// Both legs, the far one half a circle behind the near one.
const beat = (phase) => {
  const near = legAt(phase);
  const far = legAt(phase + 2);
  return { thighR: near.thigh, shinR: near.shin, thighL: far.thigh, shinL: far.shin };
};

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: {
    ...STAND_SIDE,
    torso: 274,
    head: 280,
    ...both("arm", 96), // arms on the floor
    ...both("forearm", 92),
    ...beat(0),
    ...both("foot", 60),
  },

  poses: {
    b1: beat(1),
    b2: beat(2),
    b3: beat(3),
  },

  timeline: [
    { to: "b1", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b2", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b3", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "start", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b1", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b2", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b3", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "start", s: 0.3, ease: "linear", say: "Círculos con cada pierna" },
    { to: "b3", s: 0.3, ease: "linear", say: "Cambiá de dirección" },
    { to: "b2", s: 0.3, ease: "linear", say: "Cambiá de dirección" },
    { to: "b1", s: 0.3, ease: "linear", say: "Cambiá de dirección" },
    { to: "start", s: 0.3, ease: "linear", say: "Cambiá de dirección" },
  ],
};
