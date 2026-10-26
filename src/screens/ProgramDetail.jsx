/*
 * ProgramDetail.jsx: a routine with several days (#/programa/<id>)
 *
 * The routine's own page: its name, its focus and one lane per day. Each
 * lane shows the day's name and focus, how many exercises it has, the
 * thumbnails of its first 4 exercises ("+N" when there are more) and a small
 * "Entrenar" button. Tapping the lane opens that day (RoutineDetail), with
 * its full list of exercises.
 *
 * Works for the trainer's routines (Bloque A, Bloque B) and yours. A routine
 * with a single day has no lanes to show, so this page sends you straight
 * to that day.
 */
import { useEffect } from "react";
import { disciplineLabel, getExercise } from "../data/exercises.js";
import { stepExerciseIds } from "../data/routines.js";
import { useActiveSession, useProgram } from "../store/useStore.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

const THUMBS = 4;

// The exercises of a day, each once, in order (a vuelta step counts all of
// its exercises).
function dayExercises(day) {
  return [...new Set(day.steps.flatMap(stepExerciseIds))].filter((id) => getExercise(id));
}

// "1 ejercicio", "8 ejercicios"
const exercisesLabel = (n) => `${n} ${n === 1 ? "ejercicio" : "ejercicios"}`;

/* One day: the whole lane opens the day; the small button starts training. */
function DayLane({ day, index }) {
  const active = useActiveSession(day.id);
  const ids = dayExercises(day);
  const shown = ids.slice(0, THUMBS);
  const more = ids.length - shown.length;
  const stripped = day.name.replace(/^d[ií]a\s*\d+\s*:?\s*/i, "").trim();
  const title = stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : "";
  // The focus, unless it just repeats the name ("Cuádriceps" / "Cuádriceps")
  const focus = day.focus && day.focus.toLowerCase() !== title.toLowerCase() ? day.focus : "";

  return (
    <article className="day-lane">
      <a className="day-lane-main" href={`#/rutina/${day.id}`}>
        <div className="day-lane-head">
          <span className="day-badge">Día {index + 1}</span>
          <span className="day-lane-text">
            {/* The badge already says "Día 2": show "tren superior", not
                "Día 2: tren superior" (and nothing for a plain "Día 2") */}
            {title && <span className="day-lane-name">{title}</span>}
            <span className="day-lane-meta">
              {focus ? `${focus} · ` : ""}
              {exercisesLabel(ids.length)}
            </span>
          </span>
        </div>
        <div className="day-lane-thumbs">
          {shown.map((exId, i) => (
            <span key={exId} className="lane-thumb-cell">
              <ExerciseAnimation id={exId} className="lane-thumb" />
              {/* "+3": how many more exercises the day has */}
              {more > 0 && i === shown.length - 1 && <span className="lane-more">+{more}</span>}
            </span>
          ))}
        </div>
      </a>
      <a className="day-lane-train" href={`#/rutina/${day.id}/entrenar`}>
        {active ? "Continuar" : "Entrenar"}
      </a>
    </article>
  );
}

export default function ProgramDetail({ id }) {
  const program = useProgram(id);
  const single = program?.days.length === 1;

  // Only one day: nothing to choose, go straight to it (replacing this page
  // in the history, so "Volver" from the day goes back to where you were).
  useEffect(() => {
    if (single) window.location.replace(`#/rutina/${program.days[0].id}`);
  }, [single, program]);

  if (!program) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback="#/rutinas" />
        </div>
        <p className="empty">No encontramos esa rutina.</p>
      </div>
    );
  }
  if (single) return null;

  const total = new Set(program.days.flatMap((d) => dayExercises(d))).size;

  return (
    <div className="screen">
      <div className="top-bar">
        <BackButton fallback="#/rutinas" />
      </div>

      <div className="content">
        <p className="routine-block">{program.isMine ? "Mi rutina" : disciplineLabel(program.discipline)}</p>
        <h1 className="detail-title">{program.name}</h1>
        {program.focus && <p className="routine-focus">{program.focus}</p>}
        <p className="program-meta">
          {program.days.length} días · {exercisesLabel(total)}
        </p>

        {program.isMine && (
          <div className="routine-actions">
            <a className="secondary-button" href={`#/rutina/${program.days[0].id}/editar`}>
              Editar
            </a>
          </div>
        )}

        <div className="day-lanes">
          {program.days.map((day, i) => (
            <DayLane key={day.id} day={day} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
