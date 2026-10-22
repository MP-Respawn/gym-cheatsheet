/*
 * Perro boca abajo / Adho Mukha Svanasana (yoga)
 * Side view, facing right: an upside-down V with the hands planted in
 * front and the feet behind, hips high, head hanging between the arms.
 * Held while "pedaling" the heels: one knee softens and its heel lifts
 * (the toes stay put), then the other, then both heels sink again. The
 * hips are the fixed point.
 */
import { STAND_SIDE, ankleFor, arm, leg, neckFrom } from "../engine/helpers.js";

const HIP = [74, 90];
const TORSO = 138; // from the hips down toward the hands
const NECK = neckFrom(HIP, TORSO);
const HANDS = [124, 144];

// Heels down: the ankles sit on the floor, feet pointing at the hands.
const TOE_R = [58, 144];
const TOE_L = [54, 144];
const HEEL_DOWN_R = ankleFor(TOE_R, 90);
const HEEL_DOWN_L = ankleFor(TOE_L, 90);

// One leg pedaling: knee soft, heel up, toes on the floor.
const pedal = (side, toe) => ({
  ...leg(side, HIP, ankleFor(toe, 125), "fwd"),
  [`foot${side}`]: 125,
});

const FLAT = {
  ...leg("R", HIP, HEEL_DOWN_R, "fwd"),
  ...leg("L", HIP, HEEL_DOWN_L, "fwd"),
  footR: 90,
  footL: 90,
};

const ARMS = {
  ...arm("R", NECK, HANDS, "up"),
  ...arm("L", NECK, [HANDS[0] - 3, HANDS[1]], "up"),
};

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    torso: TORSO,
    head: TORSO + 6,
    ...ARMS,
    ...FLAT,
  },

  poses: {
    pedalNear: { ...FLAT, ...pedal("R", TOE_R) },
    pedalFar: { ...FLAT, ...pedal("L", TOE_L) },
  },

  timeline: [
    { to: "start", s: 1.2, say: "Cadera arriba y atrás" },
    { to: "pedalNear", s: 0.8, say: "Pedaleá los talones" },
    { to: "start", s: 0.6, say: "Pedaleá los talones" },
    { to: "pedalFar", s: 0.8, say: "Pedaleá los talones" },
    { to: "start", s: 0.6, say: "Pedaleá los talones" },
    { to: "start", s: 1.2, say: "Cadera arriba y atrás" },
  ],
};
