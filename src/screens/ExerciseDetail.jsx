/*
 * ExerciseDetail.jsx: one exercise (#/ejercicio/<id>)
 *
 * From top to bottom: back button, big animation, name, group tags,
 * description, technique cues as a checklist, the prescription in a
 * highlighted box, alternatives for when the machine is busy, equipment,
 * and finally a small link to search the exercise on YouTube.
 */
import { getExercise, groupLabel } from "../data/exercises.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

export default function ExerciseDetail({ id }) {
  const exercise = getExercise(id);

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

      <div className="content detail">
        <ExerciseAnimation pattern={exercise.pattern} className="hero" />

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

        <p className="equipment">
          <span className="muted">Equipo:</span> {exercise.equipment.join(", ")}
        </p>

        {/* Secondary on purpose: a plain text link, opens YouTube search in a new tab */}
        <a className="youtube-link" href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          Ver en YouTube
        </a>
      </div>
    </div>
  );
}
