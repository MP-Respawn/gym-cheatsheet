/*
 * Subida al cajón
 * Side view, facing right, a box in front of the figure and a dumbbell
 * hanging in each hand. The near foot is placed whole on the box, the body
 * drives up through that leg until standing tall on the box with the far
 * leg hanging beside it, then comes down slowly: far foot to the floor
 * first, then the near foot.
 * Cues shown: the whole foot on the box, push with the top leg, slow way
 * down.
 * Simplification: the far foot does not step onto the box; it hangs beside
 * it so the working leg reads clearly. The knee stays a little bent at the
 * top to keep the head inside the drawing.
 *
 * The root is the hip, moved per pose with $root; both legs reach for the
 * floor or the box top with leg().
 */
import { STAND_SIDE, both, leg } from "../engine/helpers.js";

const HIP = [62, 84]; // standing hip (the root)

// The box: top at y = 122, so a foot resting on it sits at y = 118.
const BOX = { x: 92, y: 122, w: 50, h: 26 };
const BOX_TOP = BOX.y - 4;

const FAR_ANKLE_FLOOR = [58, 144];
const NEAR_ANKLE_FLOOR = [62, 144];
const NEAR_ANKLE_BOX = [104, BOX_TOP];
const FAR_ANKLE_HANG = [98, 110]; // far foot in the air beside the box

// Hip positions for each pose (absolute), converted to $root offsets.
const HIP_FOOT = [70, 86]; // leaning a little toward the box
const HIP_TOP = [104, 62]; // over the near foot, knee slightly bent
const off = (p) => [p[0] - HIP[0], p[1] - HIP[1]];

// Arms hang straight down with the dumbbells, whatever the torso does.
const ARMS_DOWN = { ...both("arm", 180), ...both("forearm", 180) };

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...leg("R", HIP, NEAR_ANKLE_FLOOR),
    ...leg("L", HIP, FAR_ANKLE_FLOOR),
    armL: 176, // far arm a little behind so both dumbbells show
    forearmL: 176,
  },

  poses: {
    // near foot flat on the box, far foot still on the floor
    foot: {
      $root: off(HIP_FOOT),
      ...leg("R", HIP_FOOT, NEAR_ANKLE_BOX, "fwd"),
      ...leg("L", HIP_FOOT, FAR_ANKLE_FLOOR),
      ...both("foot", 90),
      torso: 8, // leaning toward the box
      ...ARMS_DOWN,
    },
    // standing on the box on the near leg, far leg hanging beside it
    top: {
      $root: off(HIP_TOP),
      ...leg("R", HIP_TOP, NEAR_ANKLE_BOX, "fwd"),
      ...leg("L", HIP_TOP, FAR_ANKLE_HANG, "fwd"),
      footR: 90,
      footL: 120, // toes relaxed, pointing a little down, clear of the box
      torso: 0,
      ...ARMS_DOWN,
    },
  },

  timeline: [
    { to: "foot", s: 0.6, say: "Todo el pie arriba del cajón" },
    { to: "top", s: 0.9, say: "Empujá con la pierna de arriba" },
    { to: "top", s: 0.3 },
    { to: "foot", s: 1.0, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.5, ease: "slow", say: "Bajá lento" },
    { to: "start", s: 0.3 },
  ],

  props: [
    // the box, behind the figure
    { kind: "rect", x: BOX.x, y: BOX.y, w: BOX.w, h: BOX.h, fill: true, layer: "back" },
    // a dumbbell (seen end-on) in each hand
    { kind: "disc", on: "forearmL", r: 5 },
    { kind: "disc", on: "forearmR", r: 5 },
  ],
};
