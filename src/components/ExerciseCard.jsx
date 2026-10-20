/*
 * ExerciseCard.jsx
 *
 * One row in the exercise list: animation thumbnail on the left, then the
 * name, the muscle group and a one-line description. The whole card is a
 * link, so tapping anywhere on it opens the exercise detail.
 */
import { groupLabel } from "../data/exercises.js";
import ExerciseAnimation from "./ExerciseAnimation.jsx";

export default function ExerciseCard({ exercise }) {
  return (
    <a className="card" href={`#/ejercicio/${exercise.id}`}>
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
    </a>
  );
}
