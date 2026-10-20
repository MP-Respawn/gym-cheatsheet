/*
 * index.js: the animation registry.
 *
 * Every exercise has its own animation file in ./exercises/, named exactly
 * like the exercise id (sentadilla-barra.js, peso-muerto.js...). Vite's
 * import.meta.glob loads all of them automatically, so adding an animation
 * is just adding a file: no list to update here.
 */
import "./figures.css";
import { compile } from "./engine/kinematics.js";

// { "sentadilla-barra": spec, "peso-muerto": spec, ... }
const modules = import.meta.glob("./exercises/*.js", { eager: true, import: "default" });
export const SPECS = Object.fromEntries(
  Object.entries(modules).map(([path, spec]) => [path.match(/([^/]+)\.js$/)[1], spec]),
);

// Compiling turns a spec into drawing data + CSS keyframes. It runs once per
// exercise, the first time it is shown, and is cached after that.
const cache = new Map();
export function getFigure(id) {
  if (!SPECS[id]) return null;
  if (!cache.has(id)) {
    try {
      cache.set(id, compile(SPECS[id], id));
    } catch (error) {
      // A broken spec shows an empty box instead of breaking the page.
      console.error(`Animación "${id}":`, error.message);
      cache.set(id, null);
    }
  }
  return cache.get(id);
}
