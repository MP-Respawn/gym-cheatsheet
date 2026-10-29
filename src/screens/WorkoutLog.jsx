/*
 * WorkoutLog.jsx: log your weights while doing a routine
 *   #/rutina/<id>/entrenar   (assigned routines and catalog sequences)
 *
 * For every exercise of the routine you get one row per set with two boxes:
 * kg and reps (core exercises get a single box instead: reps, or seconds
 * for holds). A vuelta step lists every exercise of the vuelta in order.
 * "Última vez" shows what you did the previous time, and the empty boxes
 * show those numbers as hints. Everything is saved on the phone as you type,
 * so closing the app mid-workout loses nothing.
 *
 * "Terminar entrenamiento" closes the session, adds it to your history
 * (empty sets are ignored) and uploads it to your account, where your
 * trainer sees it (later, if there is no signal). "Descartar" throws it away.
 */
import { useEffect } from "react";
import { VUELTAS, getExercise, getVuelta } from "../data/exercises.js";
import { stepExerciseIds } from "../data/routines.js";
import { hasInAppHistory } from "../hooks/useHashRoute.js";
import { useActiveSession, useAssignedState, usePersonalData } from "../store/useStore.js";
import {
  discardSession,
  emptySet,
  finishSession,
  formatNumber,
  formatSets,
  lastSetsFor,
  pyramidReps,
  saveSession,
  setFields,
  startSession,
} from "../store/workouts.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

function stepKind(step, count) {
  if (step.vuelta) return getVuelta(step.vuelta)?.label ?? "Vuelta";
  if (count === 2) return "Superserie";
  if (count > 2) return "Circuito";
  return null;
}

// How each kind of box looks: unit shown inside, keyboard, and screen-reader name.
const FIELD = {
  kg: { unit: "kg", inputMode: "decimal", label: "kilos" },
  reps: { unit: "reps", inputMode: "numeric", label: "repeticiones" },
  secs: { unit: "seg", inputMode: "numeric", label: "segundos" },
  mins: { unit: "min", inputMode: "numeric", label: "minutos" },
};

// Leaves the log and goes back to the routine page.
function leave(routineId) {
  if (hasInAppHistory()) window.history.back();
  else window.location.replace(`#/rutina/${routineId}`);
}

export default function WorkoutLog({ routine, gymMode }) {
  const data = usePersonalData();
  const session = useActiveSession(routine.id);
  const { isClient } = useAssignedState();
  // One of the trainer's core vueltas: its steps carry "which arm / side" notes.
  const isVuelta = VUELTAS.some((v) => v.routineId === routine.id);

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
        <p className="routine-block">{routine.block}</p>
        <h1 className="detail-title">{routine.name}</h1>
        <p className="hint">
          Se guarda en el teléfono mientras cargás y se sube a tu cuenta al terminar. Los números grises son de la
          última vez.
        </p>
        {!isClient && (
          <p className="hint warning">
            Todavía no sos cliente de ningún entrenador: este entrenamiento queda solo en este teléfono.
          </p>
        )}

        <ol className="steps">
          {routine.steps.map((step, stepIndex) => {
            const exerciseIds = stepExerciseIds(step);
            const kind = stepKind(step, exerciseIds.length);
            return (
              <li key={stepIndex} className="step">
                <div className="step-head">
                  <span className="step-number">{stepIndex + 1}</span>
                  {kind && <span className="step-kind">{kind}</span>}
                </div>
                {/* In a vuelta the note says which arm or side ("Con el otro brazo") */}
                {isVuelta && step.note && <p className="step-prescription">{step.note}</p>}

                {exerciseIds.map((exerciseId, position) => {
                  const ex = getExercise(exerciseId);
                  const entryIndex = entryFor(exerciseId);
                  if (!ex || entryIndex < 0) return null;
                  const entry = session.entries[entryIndex];
                  const prescription = step.prescription || ex.prescription;
                  const last = lastSetsFor(exerciseId, data.sessions);
                  const repsHints = pyramidReps(prescription);
                  const fields = setFields(exerciseId);
                  const allEmpty = entry.sets.every((s) => fields.every((f) => (s[f] ?? "") === ""));

                  // Hint shown in an empty box: last time's number, the pyramid, or the unit.
                  const hint = (setIndex, field) => {
                    const before = last?.[setIndex]?.[field];
                    if (before != null) return formatNumber(before);
                    if (field === "reps" && repsHints[setIndex]) return repsHints[setIndex];
                    return FIELD[field].unit;
                  };

                  return (
                    <div key={`${exerciseId}-${position}`} className="log-exercise">
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

                      {/* One row per set: number, its boxes (kg + reps, reps, or seg), remove */}
                      <div className="set-rows">
                        {entry.sets.map((set, setIndex) => (
                          <div key={setIndex} className="set-row">
                            <span className="set-number">{setIndex + 1}</span>
                            {fields.map((field) => (
                              <label key={field} className="set-field">
                                <input
                                  className="input set-input"
                                  inputMode={FIELD[field].inputMode}
                                  value={set[field] ?? ""}
                                  placeholder={hint(setIndex, field)}
                                  aria-label={`Serie ${setIndex + 1}, ${FIELD[field].label}`}
                                  onChange={(e) => changeSet(entryIndex, setIndex, field, e.target.value)}
                                />
                                <span className="set-unit">{FIELD[field].unit}</span>
                              </label>
                            ))}
                            <button
                              type="button"
                              className="icon-button small"
                              aria-label={`Quitar serie ${setIndex + 1}`}
                              onClick={() => setEntry(entryIndex, entry.sets.filter((_, i) => i !== setIndex))}
                            >
                              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="log-actions">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => setEntry(entryIndex, [...entry.sets, emptySet(exerciseId)])}
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
                                last.map((s) => Object.fromEntries(fields.map((f) => [f, formatNumber(s[f])]))),
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
