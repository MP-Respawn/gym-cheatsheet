/*
 * ExerciseDetail.jsx: one exercise (#/ejercicio/<id>)
 *
 * From top to bottom: back button, big animation, name (and its original
 * name, smaller), discipline and group tags, description, technique cues as
 * a checklist, the prescription in a highlighted box, alternatives for when
 * the machine is busy, stretches to do afterwards ("Estirá después"), your
 * own history (weights you logged), equipment, and finally a small link to
 * search the exercise on YouTube. Some exercises also link to a routine
 * (Flexibilidad de cierre -> the yoga closing routine).
 */
import { disciplineLabel, getExercise, groupLabel } from "../data/exercises.js";
import { getRoutine, vueltaPlace } from "../data/routines.js";
import { useExerciseHistory } from "../store/useStore.js";
import { formatSet, formatSets } from "../store/workouts.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

// "12 oct" style dates for the history list.
const shortDate = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

// The tag that says where an exercise comes from.
const SOURCE_LABELS = {
  trainer: "Del entrenador",
  added: "Alternativa sugerida",
  research: "De referencia",
};

// The best set ever logged, or null: the heaviest one (more reps breaks a
// tie); for core work without kg, the most reps or the longest hold.
function bestSet(history) {
  const sets = history.flatMap((entry) => entry.sets);
  const score = (s) =>
    s.kg != null ? [3, s.kg, s.reps ?? 0] : s.secs != null ? [2, s.secs, 0] : s.reps != null ? [1, s.reps, 0] : null;
  let best = null;
  let bestScore = null;
  for (const set of sets) {
    const sc = score(set);
    if (!sc) continue;
    const better = !bestScore || sc[0] > bestScore[0] || (sc[0] === bestScore[0] && (sc[1] > bestScore[1] || (sc[1] === bestScore[1] && sc[2] > bestScore[2])));
    if (better) {
      best = set;
      bestScore = sc;
    }
  }
  return best;
}

export default function ExerciseDetail({ id }) {
  const exercise = getExercise(id);
  const history = useExerciseHistory(id);
  const best = bestSet(history);
  const place = vueltaPlace(exercise);

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

  // Turn the alternative and stretch ids into full exercises (skipping any that are missing).
  const alternatives = exercise.alternatives.map(getExercise).filter(Boolean);
  const stretches = (exercise.stretches ?? []).map(getExercise).filter(Boolean);
  const linkedRoutine = exercise.routineLink && getRoutine(exercise.routineLink);
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
          {exercise.originalName && <p className="detail-original">{exercise.originalName}</p>}

          {/* Discipline, main group (highlighted), secondary groups, and who suggested it */}
          <div className="tags">
            <span className="tag tag-discipline">{disciplineLabel(exercise.discipline)}</span>
            <span className="tag tag-main">{groupLabel(exercise.group)}</span>
            {(exercise.secondary ?? []).map((g) => (
              <span key={g} className="tag">
                {groupLabel(g)}
              </span>
            ))}
            <span className="tag tag-source">{SOURCE_LABELS[exercise.source] ?? exercise.source}</span>
          </div>

          {/* Core exercises that belong to a vuelta link to the whole sequence */}
          {place && (
            <a className="vuelta-link" href={`#/rutina/${place.routine.id}`}>
              {place.vuelta.partOf} · {place.positions.length > 1 ? "pasos" : "paso"}{" "}
              {place.positions.join(" y ")} de {place.total}
            </a>
          )}

          <p className="description">{exercise.description}</p>

          {linkedRoutine && (
            <a className="vuelta-link" href={`#/rutina/${linkedRoutine.id}`}>
              Ver rutina: {linkedRoutine.name}
            </a>
          )}

          <h2 className="block-title">Técnica</h2>
          <ul className="cues">
            {exercise.cues.map((cue) => (
              <li key={cue}>{cue}</li>
            ))}
          </ul>
        </div>

        <div className="detail-aside">
          <div className="prescription">
            <span className="prescription-label">
              {exercise.discipline === "gym" ? "Series y repeticiones" : "Cuánto"}
            </span>
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

          {/* Stretches that go well after this exercise */}
          {stretches.length > 0 && (
            <>
              <h2 className="block-title">Estirá después</h2>
              <div className="alt-chips">
                {stretches.map((s) => (
                  <a key={s.id} className="alt-chip" href={`#/ejercicio/${s.id}`}>
                    {s.name}
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
