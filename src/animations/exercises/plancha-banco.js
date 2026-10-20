/*
 * Plancha con apoyo en banco
 * Side view, head to the right. Incline forearm plank: forearms on a flat
 * bench, toes on the floor. Starts in a good line, lets the hips sag a
 * little (the usual mistake), corrects back to one straight line from head
 * to heels and holds it. Differs from the floor plank: inclined body,
 * bench, and no knee rest. The near elbow on the bench is the fixed point.
 */
import { STAND_SIDE, angleBetween, both, point, reach } from "../engine/helpers.js";

const ELBOW = [118, 107]; // forearm resting on the bench pad
const SHOULDER = [118, 86]; // upper arm vertical over the elbow

// Good plank: one straight line from the shoulder to the ankle, on the toes.
const BODY = 239.5; // direction from the shoulder down to the ankle
const HIP = point(SHOULDER, 32, BODY);
const ANKLE = point(SHOULDER, 92, BODY);
const TOE = [ANKLE[0] - 4, 144];
const FOOT = angleBetween(ANKLE, TOE);

// Sagging: the shoulder rocks back a hair over the elbow and the hips drop
// below the line (about 7 units), legs still straight.
const SHOULDER_SAG = point(ELBOW, 21, 356);
const [shoulderToHip, legSag] = reach(SHOULDER_SAG, ANKLE, 32, 60, "down");
const HIP_SAG = point(SHOULDER_SAG, 32, shoulderToHip);

export default {
  view: "side",
  root: "elbowR",
  at: ELBOW,

  start: {
    ...STAND_SIDE,
    ...both("arm", 180), // upper arms vertical
    ...both("forearm", 90), // forearms flat on the bench
    torso: angleBetween(HIP, SHOULDER),
    head: angleBetween(HIP, SHOULDER) - 6, // neck long, in line
    // straight legs, far one a little offset
    ...both("thigh", BODY),
    ...both("shin", BODY),
    thighL: BODY - 1,
    ...both("foot", FOOT), // on the toes
  },

  poses: {
    sag: {
      // arms would follow the torso unless pinned here
      ...both("arm", angleBetween(SHOULDER_SAG, ELBOW)),
      ...both("forearm", 90),
      torso: angleBetween(HIP_SAG, SHOULDER_SAG),
      head: angleBetween(HIP_SAG, SHOULDER_SAG) - 10,
      ...both("thigh", legSag),
      ...both("shin", legSag),
      thighL: legSag - 1,
      ...both("foot", FOOT),
    },
  },

  timeline: [
    { to: "sag", s: 0.8, say: "Sin hundir la cadera" },
    { to: "start", s: 0.6, say: "Cuerpo en línea" },
    { to: "start", s: 2.4, say: "Apretá abdomen y glúteos" },
  ],

  props: [
    // flat bench: pad and two legs
    { kind: "rect", x: 100, y: 110, w: 50, h: 6 },
    { kind: "line", from: [106, 116], to: [106, 148] },
    { kind: "line", from: [144, 116], to: [144, 148] },
  ],
};
