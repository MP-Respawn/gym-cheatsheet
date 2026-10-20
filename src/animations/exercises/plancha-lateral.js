/*
 * Plancha lateral isométrica
 * Front view (we see the chest), lying on the right side with the head to
 * the right. The bottom forearm is flat on the floor with the elbow under
 * the shoulder; the top hand rests on the hip. Starts with the hip resting
 * on the floor, squeezes the glutes and lifts the hips until the body is
 * one straight line, holds ~2.4 s (stands for the 10 s hold) and lowers.
 * The bottom elbow is the fixed point; the feet stay stacked in place.
 * Simplification: the forearm is drawn along the floor toward the head
 * (in reality it points at the camera).
 */
import { STAND_FRONT, angleBetween, arm, leg, point } from "../engine/helpers.js";

const ELBOW = [112, 141];

// Feet stacked: bottom (R) ankle on the floor, top (L) ankle above it.
const ANKLE_R = [22, 141.5];
const ANKLE_L = [17, 129];

// Where the chest, hips and top shoulder land for a torso tilt T (hip ->
// neck, pointing up and to the right) and a bottom shoulder position.
function body(T, shoulderR) {
  const neck = point(shoulderR, 13, T - 90); // clavicle runs neck -> shoulder at T + 90
  const hip = point(neck, 32, T + 180);
  return {
    neck,
    hip,
    hipR: point(hip, 6, T + 90), // bottom hip
    hipL: point(hip, 6, T - 90), // top hip
    shoulderL: point(neck, 13, T - 90), // top shoulder
  };
}

// Resting: hip on the floor, the bottom shoulder sinks a hair toward it.
const T_REST = 44;
const SHOULDER_REST = point(ELBOW, 21, 352);
const REST = body(T_REST, SHOULDER_REST);

// Lifted: one straight line from the head to the feet, arm vertical.
const T_UP = 70;
const SHOULDER_UP = point(ELBOW, 21, 0);
const UP = body(T_UP, SHOULDER_UP);

export default {
  view: "front",
  root: "elbowR",
  at: ELBOW,
  // short feet: they point at the camera
  lengths: { footL: 5, footR: 5 },

  start: {
    ...STAND_FRONT,
    torso: T_REST,
    head: T_REST + 6,
    clavL: T_REST - 90,
    clavR: T_REST + 90,
    pelvisL: T_REST - 90,
    pelvisR: T_REST + 90,
    // bottom arm: elbow under the shoulder, forearm flat on the floor
    armR: angleBetween(SHOULDER_REST, ELBOW),
    forearmR: 90,
    // top hand on the hip (it then rides along with the torso)
    ...arm("L", REST.shoulderL, point(REST.hipL, 4, T_REST - 90), "up"),
    ...leg("R", REST.hipR, ANKLE_R, "up"),
    ...leg("L", REST.hipL, ANKLE_L, "up"),
    footR: 250,
    footL: 250,
  },

  poses: {
    up: {
      torso: T_UP,
      head: T_UP + 4,
      armR: 180, // arm vertical over the elbow
      forearmR: 90,
      ...leg("R", UP.hipR, ANKLE_R, "up"),
      ...leg("L", UP.hipL, ANKLE_L, "up"),
      footR: 250,
      footL: 250,
    },
  },

  timeline: [
    { to: "up", s: 0.8, say: "Apretá glúteos y subí" },
    { to: "up", s: 2.4, say: "Sostené 10 segundos" },
    { to: "start", s: 0.8, ease: "slow", say: "Bajá despacio" },
    { to: "start", s: 0.5 },
  ],
};
