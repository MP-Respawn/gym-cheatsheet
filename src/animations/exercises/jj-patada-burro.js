/*
 * Patada de burro / Donkey kick (Jiu Jitsu)
 * Side view, facing right, on four supports with the knees on the floor,
 * back flat. The near (lighter) leg kicks back and up with the knee bent
 * at 90 degrees, heel toward the ceiling, without arching the low back;
 * back down, again, then the far (darker) leg. The hips set the place;
 * hands and the supporting knee stay planted.
 */
import { STAND_SIDE } from "../engine/helpers.js";
import { BEAST, FAR, asStart, quad, shift } from "../engine/poses.js";

const AT = shift(BEAST.hip, 0, 5); // knees on the floor

const TABLE = quad({
  base: AT,
  hip: AT,
  torso: 80,
  head: 76,
  handR: BEAST.hands,
  handL: shift(BEAST.hands, FAR),
  ankleR: BEAST.ankles,
  ankleL: shift(BEAST.ankles, FAR),
  footR: BEAST.foot,
  footL: BEAST.foot,
});

// The kicking leg: thigh back and up, shin straight up, sole to the ceiling.
const kick = (side) => ({ [`thigh${side}`]: 296, [`shin${side}`]: 10, [`foot${side}`]: 290 });

export default {
  view: "side",
  root: "hip",
  at: AT,

  start: { ...STAND_SIDE, ...asStart(TABLE) },

  poses: {
    nearKick: { ...TABLE, ...kick("R") },
    farKick: { ...TABLE, ...kick("L") },
  },

  timeline: [
    { to: "nearKick", s: 0.5, ease: "fast", say: "Talón al techo" },
    { to: "start", s: 0.5, say: "Sin arquear la cintura" },
    { to: "nearKick", s: 0.5, ease: "fast", say: "Talón al techo" },
    { to: "start", s: 0.5, say: "Sin arquear la cintura" },
    { to: "farKick", s: 0.5, ease: "fast", say: "Ahora la otra pierna" },
    { to: "start", s: 0.5, say: "Sin arquear la cintura" },
    { to: "farKick", s: 0.5, ease: "fast", say: "Ahora la otra pierna" },
    { to: "start", s: 0.5, say: "Sin arquear la cintura" },
  ],
};
