/*
 * Remo ergómetro
 * Side view, facing right, on a rowing machine: flywheel in front, the
 * feet strapped to the slanted footplate and the seat sliding along the
 * rail. The ankles never move; the hip is the root and slides with the
 * seat. One stroke in order: the legs drive the seat back with the arms
 * long, then the torso swings back and the handle comes to the lower
 * ribs with the elbows past the body; recovery in reverse, arms first,
 * then the torso tips forward and the knees bend last to the catch.
 * Cues shown: legs first; then torso and arms; recover arms, torso, legs.
 * Simplification: the catch is drawn a bit less compressed than real
 * (knees around 65 degrees) so the straight arms reach a handle that
 * still sits clear of the flywheel.
 */
import { STAND_SIDE, arm, leg, neckFrom, point } from "../engine/helpers.js";

const ANKLE = [100, 120]; // near foot on the footplate, never moves
const ANKLE_FAR = [98, 121]; // far foot a hair behind so both legs show
const FOOT = 30; // soles on the slanted plate, toes up

// Hip on the seat at the catch (the root) and at the end of the drive.
const HIP_CATCH = [67, 120];
const HIP_BACK = [46, 120];
const SLIDE = [HIP_BACK[0] - HIP_CATCH[0], 0];

// Torso angles through the stroke.
const TORSO_CATCH = 30;
const TORSO_DRIVE = 0;
const TORSO_FINISH = 345;
const TORSO_RECOVER = 20;

// The handle rides the chain, which leaves the flywheel cage at CHAIN.
const FLYWHEEL = [140, 118];
const CHAIN = [130, 105];
const HANDLE_CATCH = [122, 104];
const HANDLE_DRIVE = [84, 104];
const HANDLE_FINISH = [45, 103]; // at the lower ribs
const HANDLE_RECOVER = [95, 104];

// Legs for a hip position: knees up, heels on the plate.
const legs = (hip) => ({
  ...leg("R", hip, ANKLE, "up"),
  ...leg("L", hip, ANKLE_FAR, "up"),
  footR: FOOT,
  footL: FOOT,
});

// Arms from the shoulder (hip + torso) to the handle.
const arms = (hip, torso, handle, bend = "down") => ({
  ...arm("R", neckFrom(hip, torso), handle, bend),
  ...arm("L", neckFrom(hip, torso), [handle[0] - 2, handle[1]], bend),
});

// Footplate: a slanted line just under the sole, resting on the rail.
const PLATE_LOW = point(point(ANKLE, 5, FOOT + 180), 1.5, FOOT + 90);
const PLATE_HIGH = point(point(ANKLE, 15, FOOT), 1.5, FOOT + 90);

export default {
  view: "side",
  root: "hip",
  at: HIP_CATCH,

  // the catch: knees bent, torso forward, arms long to the handle
  start: {
    ...STAND_SIDE,
    torso: TORSO_CATCH,
    head: 18,
    ...legs(HIP_CATCH),
    ...arms(HIP_CATCH, TORSO_CATCH, HANDLE_CATCH),
  },

  poses: {
    // legs extended, seat back, torso upright, arms still long
    drive_legs: {
      $root: SLIDE,
      torso: TORSO_DRIVE,
      head: 0,
      ...legs(HIP_BACK),
      ...arms(HIP_BACK, TORSO_DRIVE, HANDLE_DRIVE),
    },
    // torso leaning back, handle at the lower ribs, elbows past the body
    finish: {
      $root: SLIDE,
      torso: TORSO_FINISH,
      head: 352,
      ...legs(HIP_BACK),
      ...arms(HIP_BACK, TORSO_FINISH, HANDLE_FINISH, "back"),
    },
    // arms long again and torso tipped forward, legs still extended
    recover: {
      $root: SLIDE,
      torso: TORSO_RECOVER,
      head: 10,
      ...legs(HIP_BACK),
      ...arms(HIP_BACK, TORSO_RECOVER, HANDLE_RECOVER),
    },
  },

  timeline: [
    { to: "drive_legs", s: 0.5, say: "Piernas primero" },
    { to: "finish", s: 0.35, say: "Después torso y brazos" },
    { to: "recover", s: 0.45, ease: "slow", say: "Volvé: brazos, torso, piernas" },
    { to: "start", s: 0.6, ease: "slow", say: "Volvé: brazos, torso, piernas" },
    { to: "start", s: 0.2 },
  ],

  props: [
    // rail on two legs, and the footplate resting on its front end
    { kind: "rect", x: 20, y: 126, w: 106, h: 4, fill: true },
    { kind: "line", from: [32, 130], to: [32, 148] },
    { kind: "line", from: [116, 130], to: [116, 148] },
    { kind: "line", from: PLATE_LOW, to: PLATE_HIGH },
    // flywheel: solid wheel inside its cage, on a short post
    { kind: "line", from: [FLYWHEEL[0], FLYWHEEL[1] + 16], to: [FLYWHEEL[0], 148] },
    { kind: "disc", c: FLYWHEEL, r: 16 },
    { kind: "disc", c: FLYWHEEL, r: 12, fill: true },
    // seat: slides with the hip
    {
      kind: "rect",
      x: HIP_CATCH[0] - 9,
      y: HIP_CATCH[1] + 1,
      w: 18,
      h: 5,
      fill: true,
      shift: { drive_legs: SLIDE, finish: SLIDE, recover: SLIDE },
    },
    // chain from the cage to the handle, and the handle in the near hand
    { kind: "cable", anchor: CHAIN, to: "handR" },
    { kind: "line", on: "forearmR", from: [0, -4], to: [0, 4] },
  ],
};
