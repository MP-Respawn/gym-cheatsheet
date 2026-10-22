/*
 * index.js: the animation registry.
 *
 * Every exercise has its own animation file in ./exercises/, named exactly
 * like the exercise id (sentadilla-barra.js, peso-muerto.js...), unless it
 * reuses another exercise's file through its `anim` field. Vite's
 * import.meta.glob loads all of them automatically, so adding an animation
 * is just adding a file: no list to update here.
 */
import "./figures.css";
import { compile, holdSpec } from "./engine/kinematics.js";

// { "sentadilla-barra": spec, "peso-muerto": spec, ... }
const modules = import.meta.glob("./exercises/*.js", { eager: true, import: "default" });
export const SPECS = Object.fromEntries(
  Object.entries(modules).map(([path, spec]) => [path.match(/([^/]+)\.js$/)[1], spec]),
);

// Compiling turns a spec into drawing data + CSS keyframes. It runs once per
// exercise, the first time it is shown, and is cached after that.
//
// Options (for exercises that reuse another one's file, see `anim` in
// exercises.js): `hold` freezes the figure in its held pose, `bare` leaves
// out the equipment. Each variant compiles under its own name, so its
// keyframes never clash with the plain version shown on another card.
const cache = new Map();
export function getFigure(id, { hold = false, bare = false } = {}) {
  if (!SPECS[id]) return null;
  const key = [id, hold && "hold", bare && "bare"].filter(Boolean).join("--");
  if (!cache.has(key)) {
    try {
      let spec = SPECS[id];
      if (bare) spec = { ...spec, props: [] };
      if (hold) spec = holdSpec(spec);
      cache.set(key, compile(spec, key));
    } catch (error) {
      // A broken spec shows an empty box instead of breaking the page.
      console.error(`Animación "${key}":`, error.message);
      cache.set(key, null);
    }
  }
  return cache.get(key);
}
