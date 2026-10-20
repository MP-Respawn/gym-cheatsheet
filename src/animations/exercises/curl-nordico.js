/*
 * Curl nórdico
 * Side view, facing right, kneeling on the mat with the ankles pinned under
 * a pad. The near knee is the fixed point. Knees to head stay in one
 * straight line ("sin quebrar la cadera") while the body falls forward as
 * slowly as possible; the fall speeds up near the bottom, the hands catch
 * on the floor, push, and the hamstrings pull the body back up.
 */
import { STAND_SIDE, arm, both, neckFrom, point } from "../engine/helpers.js";

const KNEE = [66, 144];

// The whole body (thigh + torso + head) as one straight board leaning
// `lean` degrees forward from vertical. Both legs are the same (the far one
// hides behind), shins flat on the floor under the pad.
function body(lean) {
  return {
    ...both("thigh", lean + 180),
    ...both("shin", 270),
    ...both("foot", 270),
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
    // hands loose in front of the hips, ready to catch
    armR: 168,
    forearmR: 140,
    armL: 165,
    forearmL: 138,
  },

  poses: {
    // almost down: the arms reach for the floor
    low: {
      ...body(60),
      ...arm("R", neckFrom(point(KNEE, 30, 60), 60), [147, 132], "back"),
      ...arm("L", neckFrom(point(KNEE, 30, 60), 60), [144, 132], "back"),
    },
    // caught: hands on the floor, elbows bent back like a push-up
    catch: {
      ...body(68),
      ...arm("R", neckFrom(point(KNEE, 30, 68), 68), [148, 144], "back"),
      ...arm("L", neckFrom(point(KNEE, 30, 68), 68), [145, 144], "back"),
    },
  },

  timeline: [
    { to: "low", s: 2.4, ease: "in", say: "Bajada lo más lenta posible" },
    { to: "catch", s: 0.3, say: "Bajada lo más lenta posible" },
    { to: "start", s: 0.9, say: "Empujá y volvé" },
    { to: "start", s: 0.5 },
  ],

  props: [
    // pad over the ankles, held by a post behind the feet
    { kind: "rect", x: 30, y: 133, w: 12, h: 7 },
    { kind: "line", from: [18, 136], to: [30, 136] },
    { kind: "line", from: [18, 128], to: [18, 148] },
  ],
};
