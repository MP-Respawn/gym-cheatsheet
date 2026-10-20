/*
 * RoutineDetail.jsx: one routine (#/rutina/<id>)
 *
 * Lists the steps in order. A step can hold one exercise or several done
 * together (superset / circuit). For each exercise you see its animation,
 * its name (tap to open the detail), the prescription and the trainer's note.
 *
 * "Modo gym" switch: bigger text and animations, and hides descriptions and
 * notes, so only the name, the prescription and the animation remain. Its
 * on/off state comes from App.jsx, which also remembers it between visits.
 */
import { getExercise } from "../data/exercises.js";
import { getRoutine } from "../data/routines.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

// Label shown on steps with more than one exercise.
function stepKind(count) {
  if (count === 2) return "Superserie";
  if (count > 2) return "Circuito";
  return null;
}

export default function RoutineDetail({ id, gymMode, onGymModeChange }) {
  const routine = getRoutine(id);

  if (!routine) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback="#/rutinas" />
        </div>
        <p className="empty">No encontramos esa rutina.</p>
      </div>
    );
  }

  return (
    <div className={gymMode ? "screen gym-mode" : "screen"}>
      {/* Top bar: back on the left, Modo gym switch on the right */}
      <div className="top-bar">
        <BackButton fallback="#/rutinas" />
        <button
          type="button"
          role="switch"
          aria-checked={gymMode}
          className={gymMode ? "gym-toggle on" : "gym-toggle"}
          onClick={() => onGymModeChange(!gymMode)}
        >
          <span className="gym-toggle-track" aria-hidden="true">
            <span className="gym-toggle-thumb" />
          </span>
          Modo gym
        </button>
      </div>

      <div className="content">
        <p className="routine-block">{routine.block}</p>
        <h1 className="detail-title">{routine.name}</h1>
        <p className="routine-focus hide-in-gym">{routine.focus}</p>

        <ol className="steps">
          {routine.steps.map((step, index) => {
            const exercises = step.exerciseIds.map(getExercise).filter(Boolean);
            const kind = stepKind(exercises.length);

            return (
              <li key={index} className="step">
                {/* Step header: number and, if it applies, "Superserie" */}
                <div className="step-head">
                  <span className="step-number">{index + 1}</span>
                  {kind && <span className="step-kind">{kind}</span>}
                </div>

                {/* A routine-specific prescription covers the whole step */}
                {step.prescription && (
                  <p className="step-prescription">{step.prescription}</p>
                )}

                {exercises.map((ex) => (
                  <a key={ex.id} className="step-exercise" href={`#/ejercicio/${ex.id}`}>
                    <ExerciseAnimation pattern={ex.pattern} className="step-anim" />
                    <div className="step-text">
                      <span className="step-name">{ex.name}</span>
                      <span className="step-desc hide-in-gym">{ex.description}</span>
                      {/* Without a step prescription, show each exercise's own */}
                      {!step.prescription && (
                        <span className="step-ex-prescription">{ex.prescription}</span>
                      )}
                    </div>
                  </a>
                ))}

                {step.note && <p className="step-note hide-in-gym">{step.note}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
