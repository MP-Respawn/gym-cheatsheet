/*
 * Cuerdas de batalla
 * Side view, facing right, in an athletic stance: hips back and a little
 * low, knees soft, torso leaning forward about 15 degrees. One rope in each
 * hand, anchored off to the right. The arms alternate: one whips up to
 * chest height while the other drives down, then they swap. The hips bob
 * down a touch on each swap; the torso keeps its angle.
 * Cues shown: waves from the shoulders, alternate without a pause, torso
 * does not rock.
 * Simplification: each rope is a straight cable from the anchor to the
 * hand (the engine cannot draw a travelling wave), so the "wave" is read
 * from the arms and the ropes tilting up and down.
 */
import { STAND_SIDE, arm, both, leg, neckFrom } from "../engine/helpers.js";

const HIP = [62, 94]; // the root
const TORSO = 15;
const NEAR_ANKLE = [74, 144];
const FAR_ANKLE = [70, 144];

// The hands' two positions, relative to the neck: high (fist at chest
// height, elbow down) and low (arm long, pointing down-forward).
const high = (neck) => [neck[0] + 22, neck[1] + 4];
const low = (neck) => [neck[0] + 17, neck[1] + 37];

// The whole body for a hip position, with `up` = the side whose hand is high.
function stance(hip, up) {
  const neck = neckFrom(hip, TORSO);
  const down = up === "R" ? "L" : "R";
  return {
    torso: TORSO,
    head: 5,
    ...leg("R", hip, NEAR_ANKLE),
    ...leg("L", hip, FAR_ANKLE),
    ...both("foot", 90),
    ...arm(up, neck, high(neck), "down"),
    ...arm(down, neck, low(neck), "down"),
  };
}

const BOB = [0, 2];

export default {
  view: "side",
  root: "hip",
  at: HIP,

  start: {
    ...STAND_SIDE,
    ...stance(HIP, "R"),
  },

  poses: {
    // the far hand high, the near hand low, hips a touch lower
    swap: {
      $root: BOB,
      ...stance([HIP[0] + BOB[0], HIP[1] + BOB[1]], "L"),
    },
  },

  timeline: [
    { to: "swap", s: 0.3, ease: "linear", say: "Olas desde los hombros" },
    { to: "start", s: 0.3, ease: "linear", say: "Alterná sin pausa" },
    { to: "swap", s: 0.3, ease: "linear", say: "Alterná sin pausa" },
    { to: "start", s: 0.3, ease: "linear", say: "El torso no se balancea" },
  ],

  props: [
    // the two ropes, anchored off to the right at floor level
    { kind: "cable", anchor: [152, 120], to: "handR" },
    { kind: "cable", anchor: [152, 124], to: "handL", layer: "back" },
  ],
};
