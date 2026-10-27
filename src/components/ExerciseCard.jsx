/*
 * ExerciseCard.jsx
 *
 * One row in an exercise list: animation thumbnail on the left, then the
 * name (with the original name, like "Adho Mukha Svanasana", smaller below
 * it), the muscle group (plus its vuelta, for core) and a one-line
 * description. `number` (optional) shows its step in a vuelta ("3", "2 y 3").
 *
 * Two modes:
 *   - default: the card is a link that opens the exercise detail
 *   - with `onSelect`: the card is a button (used by the exercise picker in
 *     the routine editor); `disabled` greys it out (already in the step)
 */
import { getVuelta, groupLabel } from "../data/exercises.js";
import ExerciseAnimation from "./ExerciseAnimation.jsx";

export default function ExerciseCard({ exercise, onSelect, disabled = false, number = null }) {
  const vuelta = getVuelta(exercise.vuelta);
  const content = (
    <>
      <ExerciseAnimation id={exercise.id} className="thumb" />
      <div className="card-text">
        <span className="card-title">{exercise.name}</span>
        {exercise.originalName && <span className="card-original">{exercise.originalName}</span>}
        <span className="card-meta">
          {number && <span className="tag-step">Paso {number}</span>}
          {groupLabel(exercise.group)}
          {/* core vueltas read "Vuelta pelota" */}
          {vuelta && <span className="tag-mini tag-vuelta">{`Vuelta ${vuelta.chip.toLowerCase()}`}</span>}
          {/* Small marker so you can tell the coach's exercises from the extras */}
          {exercise.source === "added" && <span className="tag-mini">sugerido</span>}
        </span>
        <span className="card-desc">{exercise.description}</span>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className="card card-button" disabled={disabled} onClick={() => onSelect(exercise.id)}>
        {content}
      </button>
    );
  }

  return (
    <a className="card" href={`#/ejercicio/${exercise.id}`}>
      {content}
    </a>
  );
}
