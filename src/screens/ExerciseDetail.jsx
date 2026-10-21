/*
 * ExerciseDetail.jsx: one exercise (#/ejercicio/<id>)
 *
 * From top to bottom: back button, big animation, name, group tags,
 * description, technique cues as a checklist, the prescription in a
 * highlighted box, alternatives for when the machine is busy, your own
 * history (weights you logged), equipment, and finally a small link to
 * search the exercise on YouTube.
 */
import { getExercise, groupLabel } from "../data/exercises.js";
import { useExerciseHistory } from "../store/useStore.js";
import { formatSet, formatSets } from "../store/workouts.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

// "12 oct" style dates for the history list.
const shortDate = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

// The heaviest set ever logged (more reps breaks a tie), or null.
function bestSet(history) {
  let best = null;
  for (const entry of history) {
    for (const set of entry.sets) {
      if (set.kg == null) continue;
      if (!best || set.kg > best.kg || (set.kg === best.kg && (set.reps ?? 0) > (best.reps ?? 0))) best = set;
    }
  }
  return best;
}

export default function ExerciseDetail({ id }) {
  const exercise = getExercise(id);
  const history = useExerciseHistory(id);
  const best = bestSet(history);

  // Unknown id in the URL (typo, old bookmark): say so instead of crashing.
  if (!exercise) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton />
        </div>
        <p className="empty">No encontramos ese ejercicio.</p>
      </div>
    );
  }

  // Turn the alternative ids into full exercises (skipping any that are missing).
  const alternatives = exercise.alternatives.map(getExercise).filter(Boolean);
  const youtubeUrl =
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(exercise.youtubeQuery);

  return (
    <div className="screen">
      <div className="top-bar">
        <BackButton />
      </div>

      {/*
       * Two groups: "detail-main" (animation, name, description, technique)
       * and "detail-aside" (sets, alternatives, history, equipment). On a
       * phone they simply stack; on desktop styles.css puts them side by side.
       */}
      <div className="content detail">
        <div className="detail-main">
          {/* Big animation, with the phase names lighting up underneath */}
          <ExerciseAnimation id={exercise.id} className="hero" phases />

          <h1 className="detail-title">{exercise.name}</h1>

          {/* Main group (highlighted), secondary groups, and who suggested it */}
          <div className="tags">
            <span className="tag tag-main">{groupLabel(exercise.group)}</span>
            {(exercise.secondary ?? []).map((g) => (
              <span key={g} className="tag">
                {groupLabel(g)}
              </span>
            ))}
            <span className="tag tag-source">
              {exercise.source === "trainer" ? "Del entrenador" : "Alternativa sugerida"}
            </span>
          </div>

          <p className="description">{exercise.description}</p>

          <h2 className="block-title">Técnica</h2>
          <ul className="cues">
            {exercise.cues.map((cue) => (
              <li key={cue}>{cue}</li>
            ))}
          </ul>
        </div>

        <div className="detail-aside">
          <div className="prescription">
            <span className="prescription-label">Series y repeticiones</span>
            <span className="prescription-text">{exercise.prescription}</span>
          </div>

          {alternatives.length > 0 && (
            <>
              <h2 className="block-title">Alternativas si está ocupado</h2>
              <div className="alt-chips">
                {alternatives.map((alt) => (
                  <a key={alt.id} className="alt-chip" href={`#/ejercicio/${alt.id}`}>
                    {alt.name}
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Your logged sets for this exercise, newest first (last 5 sessions) */}
          <h2 className="block-title">Tu historial</h2>
          {history.length === 0 ? (
            <p className="hint">Todavía no lo registraste. Tocá "Entrenar" en una rutina para cargar tus pesos.</p>
          ) : (
            <>
              {best && <p className="history-best">Mejor serie: {formatSet(best)}</p>}
              <ul className="history">
                {history.slice(0, 5).map((entry) => (
                  <li key={entry.sessionId} className="history-row">
                    <span className="history-date">{shortDate.format(new Date(entry.date))}</span>
                    <span className="history-sets">{formatSets(entry.sets)}</span>
                    <span className="history-routine">{entry.routineName}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="equipment">
            <span className="muted">Equipo:</span> {exercise.equipment.join(", ")}
          </p>

          {/* Secondary on purpose: a plain text link, opens YouTube search in a new tab */}
          <a className="youtube-link" href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Ver en YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
