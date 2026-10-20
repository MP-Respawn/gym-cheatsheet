/*
 * ExerciseCard.jsx
 *
 * One row in an exercise list: animation thumbnail on the left, then the
 * name, the muscle group and a one-line description.
 *
 * Two modes:
 *   - default: the card is a link that opens the exercise detail
 *   - with `onSelect`: the card is a button (used by the exercise picker in
 *     the routine editor); `disabled` greys it out (already in the step)
 */
import { groupLabel } from "../data/exercises.js";
import ExerciseAnimation from "./ExerciseAnimation.jsx";

export default function ExerciseCard({ exercise, onSelect, disabled = false }) {
  const content = (
    <>
      <ExerciseAnimation id={exercise.id} className="thumb" />
      <div className="card-text">
        <span className="card-title">{exercise.name}</span>
        <span className="card-meta">
          {groupLabel(exercise.group)}
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
