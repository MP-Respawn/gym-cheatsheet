/*
 * Peso muerto nórdico en máquina
 * Side view, facing right, kneeling on the raised pad of the machine with
 * the ankles locked under the roller. The near knee is the fixed point.
 * Unlike the floor version (curl-nordico), the arms stay crossed on the
 * chest and the body only goes down to about 45 degrees, very slowly,
 * holding the fall with the hamstrings, then pulls back up. No hands.
 */
import { STAND_SIDE, both } from "../engine/helpers.js";

const KNEE = [62, 118]; // on top of the machine pad

// Knees to head in one straight line leaning `lean` degrees forward.
function body(lean) {
  return {
    ...both("thigh", lean + 180),
    ...both("shin", 270), // shins flat on the pad
    ...both("foot", 200), // toes pointing down off the back of the pad
    torso: lean,
    head: lean,
  };
}

export default {
  view: "side",
  root: "kneeR",
  at: KNEE,

  start: {
    ...STAND_SIDE,
    ...body(0),
    // arms crossed on the chest (they follow the torso when it leans)
    armR: 165,
    forearmR: 15,
    armL: 160,
    forearmL: 8,
  },

  poses: {
    low: body(45),
  },

  timeline: [
    { to: "low", s: 2.8, ease: "slow", say: "Aguantá la caída" },
    { to: "low", s: 0.3, say: "Aguantá la caída" },
    { to: "start", s: 1.4, say: "Volvé con los isquios" },
    { to: "start", s: 0.4 },
  ],

  props: [
    // knee pad on a frame, roller locking the ankles, upright at the back
    { kind: "rect", x: 34, y: 122, w: 42, h: 7 },
    { kind: "line", from: [68, 129], to: [68, 148] },
    { kind: "line", from: [40, 129], to: [40, 148] },
    { kind: "line", from: [18, 96], to: [18, 148] },
    { kind: "line", from: [18, 110], to: [32, 110] },
    { kind: "disc", c: [32, 110], r: 5 },
  ],
};
