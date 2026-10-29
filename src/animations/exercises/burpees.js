/*
 * Burpees
 * Side view, facing right. Standing, squat down and plant the hands on the
 * floor ahead of the feet, kick the feet back into a high plank, one
 * push-up (chest down, pivoting on the toes), jump the feet back in next
 * to the hands, and jump straight up with the arms swung forward and up;
 * land standing.
 * Cues shown: hands to the floor, feet back to a plank, push-up, feet to
 * the hands, and jump.
 *
 * The hip is the root, moved per pose with $root; the planted feet and the
 * planted hands are reached with leg() and arm() from fixed floor spots, so
 * they sit exactly there at every keyframe. Pass-through poses keep the
 * in-betweens honest: "sit" and "sit2" on the way down (otherwise the feet
 * sank through the floor), "kick" (feet in the air behind, otherwise the
 * knees dragged along the floor between the squat and the plank) and
 * "half" in the push-up (otherwise the hands dipped). The standing knees
 * and the plank elbows start a touch unlocked for the same reason. The
 * plank line is the push-up file's math (72 degrees at the top, 84 at the
 * bottom) with the hands moved to this file's spot.
 */
import { STAND_SIDE, angleBetween, ankleFor, arm, both, leg, neckFrom, point } from "../engine/helpers.js";

const HIP = [78, 86]; // standing hip (the root), knees a touch soft
const NEAR_ANKLE = [78, 144];
const FAR_ANKLE = [74, 144];

const HAND = [96, 144]; // near hand flat on the floor, ahead of the feet
const HAND_FAR = [94, 144]; // far hand a little behind, so both arms show
const TOE = [14, 144]; // toes in the plank

const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Squatting over the planted feet, torso leaning forward, both arms
// reaching for `hands` (a point for the near hand; the far hand sits 2 back).
function squat(hip, torso, hands, head) {
  const neck = neckFrom(hip, torso);
  return {
    $root: off(hip),
    torso,
    head,
    ...leg("R", hip, NEAR_ANKLE),
    ...leg("L", hip, FAR_ANKLE),
    ...both("foot", 90),
    ...arm("R", neck, hands, "back"),
    ...arm("L", neck, [hands[0] - 2, hands[1]], "back"),
  };
}

// The plank for a body tilt (90 = flat): legs and torso share one line, the
// foot stays roughly square to it, both arms aim at the hands on the floor.
function plank(body) {
  const foot = body + 85;
  const ankle = ankleFor(TOE, foot);
  const hip = point(ankle, 60, body); // shin 30 + thigh 30
  const neck = point(hip, 32, body);
  return {
    $root: off(hip),
    torso: body,
    head: 81, // looking at the floor a bit ahead of the hands
    ...both("thigh", body + 180),
    ...both("shin", body + 180),
    ...both("foot", foot),
    ...arm("R", neck, HAND, "back"),
    ...arm("L", neck, HAND_FAR, "back"),
  };
}

// Feet in the air behind, between the squat and the plank: hips up a bit,
// knees under the hips, shins kicked up and back, hands still planted.
const KICK_HIP = [64, 96];
const KICK_TORSO = angleBetween(KICK_HIP, [96, 103]); // shoulders over the hands
const KICK_NECK = neckFrom(KICK_HIP, KICK_TORSO);

// In the air after the jump: everything long, toes pointed, arms forward-up.
const HIP_AIR = [78, 64];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP, NEAR_ANKLE),
    ...leg("L", HIP, FAR_ANKLE),
  },

  poses: {
    // on the way down, hands dropping toward the floor
    sit: squat([76, 94], 28, [92, 114], 25),
    sit2: squat([72, 108], 52, [94, 130], 42),
    // deep squat, hands flat on the floor ahead of the feet
    crouch: squat([68, 120], 62, HAND, 50),
    // feet kicked back through the air, toes pointed
    kick: {
      $root: off(KICK_HIP),
      torso: KICK_TORSO,
      head: 81,
      ...both("thigh", 190),
      ...both("shin", 285),
      ...both("foot", 300),
      ...arm("R", KICK_NECK, HAND, "back"),
      ...arm("L", KICK_NECK, HAND_FAR, "back"),
    },
    plank: plank(72), // top: arms long, elbows just unlocked
    half: plank(78), // half way down (keeps the hands from dipping mid-rep)
    pushup: plank(84), // chest almost on the floor
    jump: {
      $root: off(HIP_AIR),
      torso: 0,
      head: 0,
      ...both("thigh", 180),
      ...both("shin", 180),
      ...both("foot", 110),
      ...both("arm", 55),
      ...both("forearm", 45),
    },
  },

  timeline: [
    { to: "sit", s: 0.13, say: "Manos al piso" },
    { to: "sit2", s: 0.13, say: "Manos al piso" },
    { to: "crouch", s: 0.14, say: "Manos al piso" },
    { to: "kick", s: 0.18, ease: "fast", say: "Pies atrás a plancha" },
    { to: "plank", s: 0.17, ease: "fast", say: "Pies atrás a plancha" },
    { to: "half", s: 0.18, ease: "linear", say: "Flexión" },
    { to: "pushup", s: 0.17, ease: "linear", say: "Flexión" },
    { to: "half", s: 0.15, ease: "linear", say: "Flexión" },
    { to: "plank", s: 0.15, ease: "linear", say: "Flexión" },
    { to: "kick", s: 0.2, ease: "fast", say: "Pies a las manos" },
    { to: "crouch", s: 0.2, ease: "fast", say: "Pies a las manos" },
    { to: "jump", s: 0.35, ease: "fast", say: "Y saltá" },
    { to: "start", s: 0.4, ease: "in", say: "Y saltá" },
    { to: "start", s: 0.3 },
  ],
};
