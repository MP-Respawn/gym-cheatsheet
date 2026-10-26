/*
 * RoutineEditor.jsx: create or edit one of your routines
 *   #/rutina/nueva          -> blank routine
 *   #/rutina/<id>/editar    -> edit an existing one of yours (if it is divided
 *                              into days, the whole routine opens on that day)
 *
 * The editor works on a private copy ("draft"); nothing is saved until you
 * tap "Guardar rutina". Leaving with unsaved changes asks first.
 *
 * A routine is a list of steps. Each step has 1 exercise, or 2 or 3 done
 * together (superset / circuit), plus optional "Series y reps" and "Nota".
 * Steps can be moved up and down, and removed.
 *
 * "Dividir en días" splits the routine into days (Día 1, Día 2...), each
 * with its own name, focus and steps; tabs switch between them. Each day is
 * saved as its own routine (see saveProgram in store/routines.js), so it can
 * be opened and trained on its own.
 *
 * The draft: { programId, name, days: [{ id, name, focus, steps }] }.
 * An undivided routine is simply a draft with one day.
 */
import { useState } from "react";
import { getExercise } from "../data/exercises.js";
import { deleteProgram, getRoutineNow, newDay, newStep, programDaysOf, saveProgram } from "../store/routines.js";
import BackButton from "../components/BackButton.jsx";
import ExercisePicker from "../components/ExercisePicker.jsx";

const MAX_PER_STEP = 3;

// Small inline icons (no icon font, no emojis).
const ICONS = {
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  close: "M6 6l12 12M18 6L6 18",
};
function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Label for steps with more than one exercise (same as the routine screen).
function stepKind(count) {
  if (count === 2) return "Superserie";
  if (count > 2) return "Circuito";
  return null;
}

// "Día 2" when the day has no name of its own.
const dayLabel = (day, index) => day.name.trim() || `Día ${index + 1}`;

// Builds the draft from what is saved (or a blank one), plus the day to open.
function loadDraft(id) {
  const routine = id ? getRoutineNow(id) : null;
  if (!routine) return { draft: { programId: null, name: "", days: [newDay()] }, dayIndex: 0 };
  const days = programDaysOf(routine);
  if (!routine.programId) {
    const only = { id: routine.id, name: "", focus: routine.focus ?? "", steps: routine.steps };
    return { draft: { programId: null, name: routine.name, days: [only] }, dayIndex: 0 };
  }
  return {
    draft: {
      programId: routine.programId,
      name: routine.block ?? "",
      days: days.map((d) => ({ id: d.id, name: d.name, focus: d.focus ?? "", steps: d.steps })),
    },
    dayIndex: Math.max(0, days.findIndex((d) => d.id === id)),
  };
}

export default function RoutineEditor({ id = null }) {
  const existing = id ? getRoutineNow(id) : null;

  // The working copy, a snapshot of how it started (to detect changes), and
  // which day is on screen.
  const [loaded] = useState(() => loadDraft(id));
  const [draft, setDraft] = useState(() => structuredClone(loaded.draft));
  const [initial] = useState(() => JSON.stringify(loaded.draft));
  const [current, setCurrent] = useState(loaded.dayIndex);
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
  const divided = draft.days.length > 1;
  const day = draft.days[current];

  /* ---- Changes to the draft ---- */

  function update(fields) {
    setDraft((d) => ({ ...d, ...fields }));
    setError("");
  }

  // Changes the day on screen: `change` gets the day and returns the new one.
  function updateDay(change) {
    setDraft((d) => ({ ...d, days: d.days.map((x, i) => (i === current ? change(x) : x)) }));
    setError("");
  }

  function updateStep(stepId, fields) {
    updateDay((x) => ({ ...x, steps: x.steps.map((s) => (s.id === stepId ? { ...s, ...fields } : s)) }));
  }

  // Called by the picker with the chosen exercise.
  function pick(exerciseId) {
    if (picker.stepId) {
      updateDay((x) => ({
        ...x,
        steps: x.steps.map((s) => (s.id === picker.stepId ? { ...s, exerciseIds: [...s.exerciseIds, exerciseId] } : s)),
      }));
    } else {
      updateDay((x) => ({ ...x, steps: [...x.steps, newStep(exerciseId)] }));
    }
    setPicker(null);
  }

  // Removing the last exercise of a step removes the whole step.
  function removeExercise(stepId, exerciseId) {
    updateDay((x) => ({
      ...x,
      steps: x.steps
        .map((s) => (s.id === stepId ? { ...s, exerciseIds: s.exerciseIds.filter((e) => e !== exerciseId) } : s))
        .filter((s) => s.exerciseIds.length > 0),
    }));
  }

  function moveStep(index, delta) {
    updateDay((x) => {
      const steps = [...x.steps];
      const target = index + delta;
      if (target < 0 || target >= steps.length) return x;
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...x, steps };
    });
  }

  function removeStep(stepId) {
    updateDay((x) => ({ ...x, steps: x.steps.filter((s) => s.id !== stepId) }));
  }

  /* ---- Days ---- */

  // Adds a day at the end and shows it. The first time, this is "Dividir en días".
  function addDay() {
    setDraft((d) => ({ ...d, days: [...d.days, newDay()] }));
    setCurrent(draft.days.length);
    setError("");
  }

  function moveDay(delta) {
    const target = current + delta;
    if (target < 0 || target >= draft.days.length) return;
    setDraft((d) => {
      const days = [...d.days];
      [days[current], days[target]] = [days[target], days[current]];
      return { ...d, days };
    });
    setCurrent(target);
  }

  // With one day left, the routine is no longer divided.
  function removeDay() {
    if (day.steps.length > 0 && !window.confirm(`¿Eliminar ${dayLabel(day, current)} y sus ejercicios?`)) return;
    setDraft((d) => ({ ...d, days: d.days.filter((_, i) => i !== current) }));
    setCurrent(Math.max(0, current - 1));
    setError("");
  }

  /* ---- Save and delete ---- */

  async function save() {
    const empty = draft.days.findIndex((d) => d.steps.length === 0);
    if (empty >= 0) {
      setCurrent(empty);
      setError(divided ? `${dayLabel(draft.days[empty], empty)} no tiene ejercicios.` : "Agregá al menos un ejercicio.");
      return;
    }
    const saved = await saveProgram({
      programId: draft.programId,
      name: draft.name.trim() || "Mi rutina",
      days: draft.days.map((d) => ({
        ...d,
        name: d.name.trim(),
        focus: d.focus.trim(),
        steps: d.steps.map((s) => ({ ...s, prescription: s.prescription.trim(), note: s.note.trim() })),
      })),
    });
    // Go to the day that was on screen. Editing the same page we came from:
    // go back to it. Otherwise replace the editor in the history, so "Volver"
    // from there goes to the list.
    const target = saved[current]?.id ?? saved[0].id;
    if (existing && target === id) window.history.back();
    else window.location.replace(`#/rutina/${target}`);
  }

  async function remove() {
    const count = programDaysOf(existing).length;
    const question =
      count > 1
        ? `¿Eliminar esta rutina y sus ${count} días? No se puede deshacer.`
        : "¿Eliminar esta rutina? No se puede deshacer.";
    if (!window.confirm(question)) return;
    await deleteProgram(existing);
    window.location.replace("#/rutinas");
  }

  /* ---- Screen ---- */

  const pickerStep = picker?.stepId ? day.steps.find((s) => s.id === picker.stepId) : null;

  return (
    <div className="screen has-action-bar">
      <div className="top-bar">
        <BackButton fallback="#/rutinas" confirmMessage={dirty ? "Tenés cambios sin guardar. ¿Salir igual?" : null} />
        <span className="top-bar-title">{existing ? "Editar rutina" : "Nueva rutina"}</span>
      </div>

      <div className="content">
        <label className="field">
          <span className="field-label">{divided ? "Nombre de la rutina" : "Nombre"}</span>
          <input
            className="input"
            value={draft.name}
            placeholder={divided ? "Ej: Plan de 3 días" : "Ej: Piernas del lunes"}
            maxLength={60}
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>

        {/* Divided: one tab per day, plus "+ Día" */}
        {divided && (
          <div className="day-tabs" role="tablist" aria-label="Días de la rutina">
            {draft.days.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={i === current}
                className={i === current ? "chip active" : "chip"}
                onClick={() => {
                  setCurrent(i);
                  setError("");
                }}
              >
                {dayLabel(d, i)}
              </button>
            ))}
            <button type="button" className="chip chip-add" onClick={addDay}>
              + Día
            </button>
          </div>
        )}

        {divided && (
          <label className="field">
            <span className="field-label">Nombre del día</span>
            <input
              className="input"
              value={day.name}
              placeholder={`Día ${current + 1}`}
              maxLength={40}
              onChange={(e) => updateDay((x) => ({ ...x, name: e.target.value }))}
            />
          </label>
        )}
        <label className="field">
          <span className="field-label">Enfoque (opcional)</span>
          <input
            className="input"
            value={day.focus}
            placeholder="Ej: Cuádriceps + glúteos"
            maxLength={60}
            onChange={(e) => updateDay((x) => ({ ...x, focus: e.target.value }))}
          />
        </label>

        <h2 className="block-title">{divided ? `Ejercicios de ${dayLabel(day, current)}` : "Ejercicios"}</h2>
        {day.steps.length === 0 && <p className="hint">Todavía no agregaste ejercicios.</p>}

        <ol className="steps">
          {day.steps.map((step, index) => {
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
                      disabled={index === day.steps.length - 1}
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

        {/* Days: split the routine, or move / remove the day on screen */}
        {divided ? (
          <div className="day-tools">
            <button type="button" className="icon-button" aria-label="Mover el día a la izquierda" disabled={current === 0} onClick={() => moveDay(-1)}>
              <Icon name="left" />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Mover el día a la derecha"
              disabled={current === draft.days.length - 1}
              onClick={() => moveDay(1)}
            >
              <Icon name="right" />
            </button>
            <button type="button" className="text-button day-remove" onClick={removeDay}>
              Eliminar {dayLabel(day, current)}
            </button>
          </div>
        ) : (
          <button type="button" className="secondary-button split-button" onClick={addDay}>
            Dividir en días
          </button>
        )}

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
