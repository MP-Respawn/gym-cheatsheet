/*
 * WorkoutLog.jsx: log your weights while doing a routine
 *   #/rutina/<id>/entrenar   (works for the trainer's routines and yours)
 *
 * For every exercise of the routine you get one row per set with two boxes:
 * kg and reps. "Última vez" shows what you did the previous time, and the
 * empty boxes show those numbers as hints. Everything is saved as you type,
 * so closing the app mid-workout loses nothing.
 *
 * "Terminar entrenamiento" closes the session and adds it to your history
 * (empty sets are ignored). "Descartar" throws it away.
 */
import { useEffect } from "react";
import { getExercise } from "../data/exercises.js";
import { hasInAppHistory } from "../hooks/useHashRoute.js";
import { useActiveSession, usePersonalData } from "../store/useStore.js";
import {
  discardSession,
  finishSession,
  formatNumber,
  formatSets,
  lastSetsFor,
  pyramidReps,
  saveSession,
  startSession,
} from "../store/workouts.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

function stepKind(count) {
  if (count === 2) return "Superserie";
  if (count > 2) return "Circuito";
  return null;
}

// Leaves the log and goes back to the routine page.
function leave(routineId) {
  if (hasInAppHistory()) window.history.back();
  else window.location.replace(`#/rutina/${routineId}`);
}

export default function WorkoutLog({ routine, gymMode }) {
  const data = usePersonalData();
  const session = useActiveSession(routine.id);

  // Opening the screen starts a session (or resumes the one in progress).
  useEffect(() => {
    startSession(routine);
    // Only on first open: after "Terminar" we must not start a new one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback={`#/rutina/${routine.id}`} />
        </div>
        <p className="empty">Preparando el entrenamiento...</p>
      </div>
    );
  }

  /* ---- Edits: every change saves the whole session ---- */

  function setEntry(entryIndex, sets) {
    const entries = session.entries.map((e, i) => (i === entryIndex ? { ...e, sets } : e));
    saveSession({ ...session, entries });
  }

  function changeSet(entryIndex, setIndex, field, value) {
    const sets = session.entries[entryIndex].sets.map((s, i) => (i === setIndex ? { ...s, [field]: value } : s));
    setEntry(entryIndex, sets);
  }

  async function finish() {
    const finished = await finishSession(session);
    if (!finished) window.alert("No cargaste ninguna serie, así que no se guardó nada.");
    leave(routine.id);
  }

  async function discard() {
    if (!window.confirm("¿Descartar este entrenamiento? Se pierde lo que cargaste.")) return;
    await discardSession(session.id);
    leave(routine.id);
  }

  /*
   * The session keeps one entry per exercise, in routine order. Walk the
   * steps and match each exercise to its entry (first unused one with that
   * id), so supersets can be drawn grouped like in the routine.
   */
  const used = new Set();
  const entryFor = (exerciseId) => {
    const index = session.entries.findIndex((e, i) => !used.has(i) && e.exerciseId === exerciseId);
    if (index >= 0) used.add(index);
    return index;
  };

  return (
    <div className={gymMode ? "screen gym-mode has-action-bar" : "screen has-action-bar"}>
      <div className="top-bar">
        <BackButton fallback={`#/rutina/${routine.id}`} />
        <span className="top-bar-title">Entrenando</span>
      </div>

      <div className="content">
        <p className="routine-block">{routine.block ?? "Mi rutina"}</p>
        <h1 className="detail-title">{routine.name}</h1>
        <p className="hint">Se guarda solo mientras cargás. Los números grises son de la última vez.</p>

        <ol className="steps">
          {routine.steps.map((step, stepIndex) => {
            const kind = stepKind(step.exerciseIds.length);
            return (
              <li key={stepIndex} className="step">
                <div className="step-head">
                  <span className="step-number">{stepIndex + 1}</span>
                  {kind && <span className="step-kind">{kind}</span>}
                </div>

                {step.exerciseIds.map((exerciseId) => {
                  const ex = getExercise(exerciseId);
                  const entryIndex = entryFor(exerciseId);
                  if (!ex || entryIndex < 0) return null;
                  const entry = session.entries[entryIndex];
                  const prescription = step.prescription || ex.prescription;
                  const last = lastSetsFor(exerciseId, data.sessions);
                  const repsHints = pyramidReps(prescription);
                  const allEmpty = entry.sets.every((s) => s.kg === "" && s.reps === "");

                  return (
                    <div key={exerciseId} className="log-exercise">
                      <div className="log-exercise-head">
                        <ExerciseAnimation id={exerciseId} className="step-anim" />
                        <div className="step-text">
                          <span className="step-name">{ex.name}</span>
                          <span className="step-ex-prescription">{prescription}</span>
                          <span className="log-last">
                            {last ? `Última vez: ${formatSets(last)}` : "Primera vez que lo registrás"}
                          </span>
                        </div>
                      </div>

                      {/* One row per set: number, kg, reps, remove */}
                      <div className="set-rows">
                        {entry.sets.map((set, setIndex) => (
                          <div key={setIndex} className="set-row">
                            <span className="set-number">{setIndex + 1}</span>
                            <label className="set-field">
                              <input
                                className="input set-input"
                                inputMode="decimal"
                                value={set.kg}
                                placeholder={last?.[setIndex]?.kg != null ? formatNumber(last[setIndex].kg) : "kg"}
                                aria-label={`Serie ${setIndex + 1}, kilos`}
                                onChange={(e) => changeSet(entryIndex, setIndex, "kg", e.target.value)}
                              />
                              <span className="set-unit">kg</span>
                            </label>
                            <label className="set-field">
                              <input
                                className="input set-input"
                                inputMode="numeric"
                                value={set.reps}
                                placeholder={
                                  last?.[setIndex]?.reps != null ? formatNumber(last[setIndex].reps) : (repsHints[setIndex] ?? "reps")
                                }
                                aria-label={`Serie ${setIndex + 1}, repeticiones`}
                                onChange={(e) => changeSet(entryIndex, setIndex, "reps", e.target.value)}
                              />
                              <span className="set-unit">reps</span>
                            </label>
                            <button
                              type="button"
                              className="icon-button small"
                              aria-label={`Quitar serie ${setIndex + 1}`}
                              onClick={() => setEntry(entryIndex, entry.sets.filter((_, i) => i !== setIndex))}
                            >
                              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="log-actions">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => setEntry(entryIndex, [...entry.sets, { kg: "", reps: "" }])}
                        >
                          + Serie
                        </button>
                        {/* Copy last time's numbers into the empty boxes */}
                        {last && allEmpty && (
                          <button
                            type="button"
                            className="text-button"
                            onClick={() =>
                              setEntry(
                                entryIndex,
                                last.map((s) => ({ kg: formatNumber(s.kg), reps: formatNumber(s.reps) })),
                              )
                            }
                          >
                            Repetir la última vez
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ol>

        <button type="button" className="danger-button" onClick={discard}>
          Descartar entrenamiento
        </button>
      </div>

      <div className="action-bar">
        <button type="button" className="primary-button" onClick={finish}>
          Terminar entrenamiento
        </button>
      </div>
    </div>
  );
}
