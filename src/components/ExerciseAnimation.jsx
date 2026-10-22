/*
 * ExerciseAnimation.jsx
 *
 * Shows the stick-figure animation of one exercise (looked up by its id)
 * inside a box. The size comes from the CSS class you pass:
 *   "thumb"      80 x 80 thumbnail in lists
 *   "hero"       full-width, 240px tall, on the detail page
 *   "step-anim"  inside routines (bigger in Modo gym)
 *
 * With `phases`, it also shows the names of the phases under the figure
 * ("Bajada lenta", "Subida explosiva"...), lighting up each one while it
 * happens.
 *
 * An exercise can reuse another one's animation through its `anim` field
 * (exercises.js): `from` picks the file, `hold` and `bare` change how it
 * compiles, and `hold` also adds a slow breathing pulse (a CSS class on
 * the wrapper).
 *
 * Thumbnails that scroll off screen pause their animation (IntersectionObserver),
 * so a long list does not keep dozens of figures moving out of sight.
 */
import { useEffect, useRef } from "react";
import { getExercise } from "../data/exercises.js";
import { getFigure } from "../animations/index.js";
import Figure from "../animations/engine/Figure.jsx";

export default function ExerciseAnimation({ id, className = "thumb", phases = false }) {
  const ref = useRef(null);
  const anim = getExercise(id)?.anim ?? {};
  const compiled = getFigure(anim.from ?? id, { hold: anim.hold, bare: anim.bare });
  const wrapClass = anim.hold ? "anim-wrap hold" : "anim-wrap";

  // Pause when the box is not visible. The class is toggled directly on the
  // element, so scrolling never re-renders React components.
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle("paused", !entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={wrapClass}>
      <div className={`anim-box ${className}`}>{compiled && <Figure compiled={compiled} />}</div>

      {/* Phase names, each one highlighted in sync with the figure */}
      {phases && compiled && compiled.labels.length > 0 && (
        <div className="phases">
          {compiled.labels.map((label) => (
            <span
              key={label.text}
              className="phase"
              style={{ animation: `${label.anim} ${compiled.duration}s step-end infinite` }}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
