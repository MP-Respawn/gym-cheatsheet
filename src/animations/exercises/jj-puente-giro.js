/*
 * Puente y giro / Bridge and turn (Jiu Jitsu)
 * Side view, lying on the back with the head to the left, feet planted.
 * The hips bridge up high and the body turns over the far shoulder until
 * it lands on the knees and hands, face down (still head to the left);
 * a moment there, then the same way back to lying. The turn happens toward
 * the camera, so it shows through a twisted middle position. The hips set
 * the place.
 */
import { STAND_SIDE, angleBetween, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const AT = [72, 140]; // hips lying down

// Lying on the back: shoulders at the left, feet planted at the right.
const NECK_LYING = [40, 140];
const ANKLE = [100, 144];
const off = (hip) => [hip[0] - AT[0], hip[1] - AT[1]];

const LYING = {
  torso: angleBetween(AT, NECK_LYING),
  head: 280,
  ...both("arm", 96),
  ...both("forearm", 92),
  ...leg("R", AT, ANKLE, "up"),
  ...leg("L", AT, [ANKLE[0] - 3, ANKLE[1]], "up"),
  ...both("foot", 90),
};

const HIP_BRIDGE = point(NECK_LYING, 32, 50);
const BRIDGE = {
  ...LYING,
  $root: off(HIP_BRIDGE),
  torso: angleBetween(HIP_BRIDGE, NECK_LYING),
  ...leg("R", HIP_BRIDGE, ANKLE, "up"),
  ...leg("L", HIP_BRIDGE, [ANKLE[0] - 3, ANKLE[1]], "up"),
};

// Turning over: hips high and twisting, near hand reaching to the floor,
// far arm crossing over, feet still on the floor.
const HIP_TURN = [72, 114];
const TORSO_TURN = 260;
const TURN = {
  $root: off(HIP_TURN),
  torso: TORSO_TURN,
  head: 240,
  ...arm("R", neckFrom(HIP_TURN, TORSO_TURN), [44, 144], "up"),
  armL: 330,
  forearmL: 300,
  ...leg("R", HIP_TURN, [92, 144], "up"),
  ...leg("L", HIP_TURN, [89, 144], "up"),
  ...both("foot", 90),
};

// Face down on knees and hands, head to the left.
const KNEE = [80, 141];
const HIP_KNEEL = point(KNEE, 30, 0);
const TORSO_KNEEL = 282;
const HANDS = [48, 141];
const KNEEL = {
  $root: off(HIP_KNEEL),
  torso: TORSO_KNEEL,
  head: TORSO_KNEEL - 6,
  ...arm("R", neckFrom(HIP_KNEEL, TORSO_KNEEL), HANDS, "up"),
  ...arm("L", neckFrom(HIP_KNEEL, TORSO_KNEEL), [HANDS[0] + 3, HANDS[1]], "up"),
  ...both("thigh", 180),
  ...both("shin", 90), // shins flat behind, to the right
  ...both("foot", 90),
};

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...LYING },

  poses: { bridge: BRIDGE, turn: TURN, kneel: KNEEL },

  timeline: [
    { to: "bridge", s: 0.5, ease: "fast", say: "Puente alto" },
    { to: "turn", s: 0.45, say: "Girá por encima del hombro" },
    { to: "kneel", s: 0.45, say: "Caé en rodillas" },
    { to: "kneel", s: 0.5 },
    { to: "turn", s: 0.5, say: "Volvé por el mismo camino" },
    { to: "bridge", s: 0.45, say: "Volvé por el mismo camino" },
    { to: "start", s: 0.5, say: "Volvé por el mismo camino" },
    { to: "start", s: 0.4 },
  ],
};
