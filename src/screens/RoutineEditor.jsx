/*
 * RoutineEditor.jsx: create or edit one of your routines
 *   #/rutina/nueva          -> blank routine
 *   #/rutina/<id>/editar    -> edit an existing one of yours
 *
 * The editor works on a private copy ("draft"); nothing is saved until you
 * tap "Guardar rutina". Leaving with unsaved changes asks first.
 *
 * A routine is a list of steps. Each step has 1 exercise, or 2 or 3 done
 * together (superset / circuit), plus optional "Series y reps" and "Nota".
 * Steps can be moved up and down, and removed.
 */
import { useState } from "react";
import { getExercise } from "../data/exercises.js";
import { deleteRoutine, getRoutineNow, newRoutineDraft, newStep, saveRoutine } from "../store/routines.js";
import BackButton from "../components/BackButton.jsx";
import ExercisePicker from "../components/ExercisePicker.jsx";

const MAX_PER_STEP = 3;

// Small inline icons (no icon font, no emojis).
const ICONS = {
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
};
function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Label for steps with more than one exercise (same as the routine screen).
function stepKind(count) {
  if (count === 2) return "Superserie";
  if (count > 2) return "Circuito";
  return null;
}

export default function RoutineEditor({ id = null }) {
  const existing = id ? getRoutineNow(id) : null;

  // The working copy, and a snapshot of how it started (to detect changes).
  const [draft, setDraft] = useState(() => (existing ? structuredClone(existing) : newRoutineDraft()));
  const [initial] = useState(() => JSON.stringify(draft));
  const [picker, setPicker] = useState(null); // null | { stepId: null | string }
  const [error, setError] = useState("");

  if (id && !existing) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback="#/rutinas" />
        </div>
        <p className="empty">No encontramos esa rutina.</p>
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== initial;

  /* ---- Changes to the draft ---- */

  function update(fields) {
    setDraft((d) => ({ ...d, ...fields }));
    setError("");
  }

  function updateStep(stepId, fields) {
    setDraft((d) => ({ ...d, steps: d.steps.map((s) => (s.id === stepId ? { ...s, ...fields } : s)) }));
  }

  // Called by the picker with the chosen exercise.
  function pick(exerciseId) {
    if (picker.stepId) {
      setDraft((d) => ({
        ...d,
        steps: d.steps.map((s) =>
          s.id === picker.stepId ? { ...s, exerciseIds: [...s.exerciseIds, exerciseId] } : s,
        ),
      }));
    } else {
      setDraft((d) => ({ ...d, steps: [...d.steps, newStep(exerciseId)] }));
    }
    setPicker(null);
    setError("");
  }

  // Removing the last exercise of a step removes the whole step.
  function removeExercise(stepId, exerciseId) {
    setDraft((d) => ({
      ...d,
      steps: d.steps
        .map((s) => (s.id === stepId ? { ...s, exerciseIds: s.exerciseIds.filter((x) => x !== exerciseId) } : s))
        .filter((s) => s.exerciseIds.length > 0),
    }));
  }

  function moveStep(index, delta) {
    setDraft((d) => {
      const steps = [...d.steps];
      const target = index + delta;
      if (target < 0 || target >= steps.length) return d;
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...d, steps };
    });
  }

  function removeStep(stepId) {
    setDraft((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== stepId) }));
  }

  /* ---- Save and delete ---- */

  async function save() {
    if (draft.steps.length === 0) {
      setError("Agregá al menos un ejercicio.");
      return;
    }
    const saved = await saveRoutine({
      ...draft,
      name: draft.name.trim() || "Mi rutina",
      focus: draft.focus.trim(),
      steps: draft.steps.map((s) => ({ ...s, prescription: s.prescription.trim(), note: s.note.trim() })),
    });
    // New routine: replace the editor in the history with the routine page,
    // so "Volver" from there goes to the list. Editing: go back to the routine.
    if (existing) window.history.back();
    else window.location.replace(`#/rutina/${saved.id}`);
  }

  async function remove() {
    if (!window.confirm("¿Eliminar esta rutina? No se puede deshacer.")) return;
    await deleteRoutine(draft.id);
    window.location.replace("#/rutinas");
  }

  /* ---- Screen ---- */

  const pickerStep = picker?.stepId ? draft.steps.find((s) => s.id === picker.stepId) : null;

  return (
    <div className="screen has-action-bar">
      <div className="top-bar">
        <BackButton fallback="#/rutinas" confirmMessage={dirty ? "Tenés cambios sin guardar. ¿Salir igual?" : null} />
        <span className="top-bar-title">{existing ? "Editar rutina" : "Nueva rutina"}</span>
      </div>

      <div className="content">
        <label className="field">
          <span className="field-label">Nombre</span>
          <input
            className="input"
            value={draft.name}
            placeholder="Ej: Piernas del lunes"
            maxLength={60}
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">Enfoque (opcional)</span>
          <input
            className="input"
            value={draft.focus}
            placeholder="Ej: Cuádriceps + glúteos"
            maxLength={60}
            onChange={(e) => update({ focus: e.target.value })}
          />
        </label>

        <h2 className="block-title">Ejercicios</h2>
        {draft.steps.length === 0 && <p className="hint">Todavía no agregaste ejercicios.</p>}

        <ol className="steps">
          {draft.steps.map((step, index) => {
            const kind = stepKind(step.exerciseIds.length);
            const defaultPrescription = getExercise(step.exerciseIds[0])?.prescription ?? "";
            return (
              <li key={step.id} className="step edit-step">
                {/* Header: number, superset label, move and delete */}
                <div className="step-head">
                  <span className="step-number">{index + 1}</span>
                  {kind && <span className="step-kind">{kind}</span>}
                  <span className="step-tools">
                    <button type="button" className="icon-button" aria-label="Subir" disabled={index === 0} onClick={() => moveStep(index, -1)}>
                      <Icon name="up" />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Bajar"
                      disabled={index === draft.steps.length - 1}
                      onClick={() => moveStep(index, 1)}
                    >
                      <Icon name="down" />
                    </button>
                    <button type="button" className="icon-button" aria-label="Eliminar paso" onClick={() => removeStep(step.id)}>
                      <Icon name="close" />
                    </button>
                  </span>
                </div>

                {/* The exercises of this step, each removable */}
                <ul className="edit-exercises">
                  {step.exerciseIds.map((exId) => (
                    <li key={exId} className="edit-exercise">
                      <span>{getExercise(exId)?.name ?? exId}</span>
                      <button
                        type="button"
                        className="icon-button small"
                        aria-label={`Quitar ${getExercise(exId)?.name ?? ""}`}
                        onClick={() => removeExercise(step.id, exId)}
                      >
                        <Icon name="close" />
                      </button>
                    </li>
                  ))}
                </ul>
                {step.exerciseIds.length < MAX_PER_STEP && (
                  <button type="button" className="text-button" onClick={() => setPicker({ stepId: step.id })}>
                    + Agregar a superserie
                  </button>
                )}

                <label className="field">
                  <span className="field-label">Series y reps</span>
                  <input
                    className="input"
                    value={step.prescription}
                    placeholder={defaultPrescription}
                    onChange={(e) => updateStep(step.id, { prescription: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field-label">Nota</span>
                  <input
                    className="input"
                    value={step.note}
                    placeholder="Ej: bajada lenta"
                    onChange={(e) => updateStep(step.id, { note: e.target.value })}
                  />
                </label>
              </li>
            );
          })}
        </ol>

        <button type="button" className="add-button" onClick={() => setPicker({ stepId: null })}>
          + Agregar ejercicio
        </button>

        {existing && (
          <button type="button" className="danger-button" onClick={remove}>
            Eliminar rutina
          </button>
        )}
      </div>

      {/* Save bar, stuck above the tab bar */}
      <div className="action-bar">
        {error && <p className="action-error">{error}</p>}
        <button type="button" className="primary-button" onClick={save}>
          Guardar rutina
        </button>
      </div>

      {picker && (
        <ExercisePicker
          title={picker.stepId ? "Agregar a la superserie" : "Agregar ejercicio"}
          exclude={pickerStep?.exerciseIds ?? []}
          onPick={pick}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
