/*
 * ExerciseAnimation.jsx
 *
 * Shows the stick-figure animation for an exercise. It looks up the
 * exercise's `pattern` in the animation registry and draws that component
 * inside a box. The box's size comes from the CSS class you pass:
 *   "thumb"  80 x 80 thumbnail in lists
 *   "hero"   full-width, 240px tall, on the detail page
 *   "step"   size used inside routines (bigger in Modo gym)
 */
import { ANIMATIONS } from "../animations/index.js";

export default function ExerciseAnimation({ pattern, className = "thumb" }) {
  const Animation = ANIMATIONS[pattern];

  return (
    <div className={`anim-box ${className}`}>
      {/* If a pattern were ever missing, show an empty box instead of crashing */}
      {Animation ? <Animation /> : null}
    </div>
  );
}
