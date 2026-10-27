/*
 * ProgramEditor.jsx: the coach's routine builder
 *   #/nueva-rutina              -> a new routine
 *   #/nueva-rutina?cliente=<id> -> a new routine, given to that client on save
 *   #/nueva-rutina?desde=<id>   -> a new routine that starts as a copy of
 *                                  another (for a client who needs other
 *                                  exercises: duplicate, change, assign)
 *   #/editar-rutina/<id>        -> edit a routine. Everyone who has it sees
 *                                  the change at once; their own series,
 *                                  reps and kilos stay.
 *
 * The builder works on a private copy ("draft"); nothing is saved until
 * "Guardar". Leaving with unsaved changes asks first. Saving sends the whole
 * routine at once (save_program in the database: all or nothing).
 *
 * A routine has days (a new one starts by asking its name and how many),
 * each day a list of steps. A step is 1 exercise, or 2 or 3 done together
 * (superset / circuit), or a whole vuelta from the catalog. Each step has
 * the trainer's numbers (series, reps, kg, pausa), free-text indications
 * and a note. Steps and days can be moved and removed.
 *
 * The draft: { id, name, focus, discipline,
 *              days: [{ id, name, focus, steps: [{ id, exerciseIds, vuelta,
 *                       note, sets, reps, loadKg, restSec, text }] }] }
 * Numbers stay as typed text in the draft and become numbers on save.
 */
import { useState } from "react";
import { VUELTAS, getExercise, getVuelta } from "../data/exercises.js";
import { newId } from "../store/storage.js";
import {
  assignProgram,
  deleteProgram,
  errorText,
  fetchAssignments,
  fetchClient,
  fetchProgram,
  saveProgram,
  useQuery,
} from "../store/trainer.js";
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
function stepKind(step) {
  if (step.vuelta) return "Vuelta";
  if (step.exerciseIds.length === 2) return "Superserie";
  if (step.exerciseIds.length > 2) return "Circuito";
  return null;
}

// "Día 2" when the day has no name of its own.
const dayLabel = (day, index) => day.name.trim() || `Día ${index + 1}`;

const blankStep = (fields) => ({
  id: newId(),
  exerciseIds: [],
  vuelta: null,
  note: "",
  sets: "",
  reps: "",
  loadKg: "",
  restSec: "",
  text: "",
  ...fields,
});
const blankDay = () => ({ id: newId(), name: "", focus: "", steps: [] });

// A number from the database as text for an input (42.5 -> "42,5"), "" for none.
const asText = (n) => (n == null ? "" : String(n).replace(".", ","));
// Back: "42,5" -> 42.5, "" -> null. Whole numbers for sets and seconds.
function asNumber(text, whole = false) {
  const n = Number(String(text).replace(",", ".").trim());
  if (String(text).trim() === "" || Number.isNaN(n) || n < 0) return null;
  return whole ? Math.round(n) : n;
}

// The draft for a routine read from the database.
function draftFrom(row) {
  const byPosition = (a, b) => a.position - b.position;
  return {
    id: row.id,
    name: row.name,
    focus: row.focus ?? "",
    discipline: row.discipline ?? "gym",
    days: [...row.program_days].sort(byPosition).map((d) => ({
      id: d.id,
      name: d.name ?? "",
      focus: d.focus ?? "",
      steps: [...d.program_steps].sort(byPosition).map((s) =>
        blankStep({
          id: s.id,
          exerciseIds: s.exercise_ids ?? [],
          vuelta: s.vuelta,
          note: s.note ?? "",
          sets: asText(s.sets),
          reps: s.reps ?? "",
          loadKg: asText(s.load_kg),
          restSec: asText(s.rest_sec),
          text: s.prescription_text ?? "",
        }),
      ),
    })),
  };
}

// The same routine with new ids everywhere (a new routine, not the same one).
function copyDraft(draft) {
  return {
    ...draft,
    id: newId(),
    name: `${draft.name} (copia)`,
    days: draft.days.map((d) => ({ ...d, id: newId(), steps: d.steps.map((s) => ({ ...s, id: newId() })) })),
  };
}

export default function ProgramEditor({ id = null, clientId = null, copyOf = null }) {
  // The routine to load: the one being edited, or the one being duplicated.
  const source = id ?? copyOf;
  const { data: row, error: loadError } = useQuery(source ? `program:${source}` : null, source ? fetchProgram(source) : null);
  // Who has it (editing only), to warn that they all get the change.
  const { data: assignments } = useQuery(id ? `assignments:${id}` : null, id ? fetchAssignments(id) : null);
  // A routine made from a client's page: their name, for the title.
  const { data: client } = useQuery(clientId ? `client:${clientId}` : null, clientId ? fetchClient(clientId) : null);
  const backTo = clientId ? `#/cliente/${clientId}` : "#/rutinas";

  if (source && !row) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback={backTo} />
        </div>
        <p className="empty">{loadError ?? "Cargando la rutina..."}</p>
      </div>
    );
  }
  // Mounted only once the routine is loaded, so the draft starts from it.
  const start = row ? (id ? draftFrom(row) : copyDraft(draftFrom(row))) : null;
  return (
    <Builder
      key={source ?? "new"}
      start={start}
      isNew={!id}
      backTo={backTo}
      clientId={clientId}
      clientName={client?.full_name}
      holders={(assignments ?? []).filter((a) => !a.archived_at).length}
    />
  );
}

function Builder({ start, isNew, backTo, clientId, clientName, holders }) {
  const [draft, setDraft] = useState(
    () => start ?? { id: newId(), name: "", focus: "", discipline: "gym", days: [blankDay()] },
  );
  const [initial] = useState(() => JSON.stringify(draft));
  const [current, setCurrent] = useState(0);
  const [picker, setPicker] = useState(null); // null | { stepId: null | string }
  const [choosingVuelta, setChoosingVuelta] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // New blank routine: first ask the name and how many days.
  const [setup, setSetup] = useState(!start);
  const [dayCount, setDayCount] = useState(3);

  const dirty = JSON.stringify(draft) !== initial;
  const several = draft.days.length > 1;
  const day = draft.days[current];

  function startDays() {
    setDraft((d) => ({ ...d, days: Array.from({ length: dayCount }, blankDay) }));
    setCurrent(0);
    setSetup(false);
  }

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
      updateDay((x) => ({ ...x, steps: [...x.steps, blankStep({ exerciseIds: [exerciseId] })] }));
    }
    setPicker(null);
  }

  function addVuelta(key) {
    updateDay((x) => ({ ...x, steps: [...x.steps, blankStep({ vuelta: key })] }));
    setChoosingVuelta(false);
  }

  // Removing the last exercise of a step removes the whole step.
  function removeExercise(stepId, exerciseId) {
    updateDay((x) => ({
      ...x,
      steps: x.steps
        .map((s) => (s.id === stepId ? { ...s, exerciseIds: s.exerciseIds.filter((e) => e !== exerciseId) } : s))
        .filter((s) => s.vuelta || s.exerciseIds.length > 0),
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

  function addDay() {
    setDraft((d) => ({ ...d, days: [...d.days, blankDay()] }));
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

  // The last day cannot be removed (the button only shows with several).
  function removeDay() {
    if (!several) return;
    if (day.steps.length > 0 && !window.confirm(`¿Eliminar ${dayLabel(day, current)} y sus ejercicios?`)) return;
    setDraft((d) => ({ ...d, days: d.days.filter((_, i) => i !== current) }));
    setCurrent(Math.max(0, current - 1));
    setError("");
  }

  /* ---- Save and delete ---- */

  async function save() {
    if (!draft.name.trim()) {
      setError("Ponele un nombre a la rutina.");
      return;
    }
    const empty = draft.days.findIndex((d) => d.steps.length === 0);
    if (empty >= 0) {
      setCurrent(empty);
      setError(several ? `${dayLabel(draft.days[empty], empty)} no tiene ejercicios.` : "Agregá al menos un ejercicio.");
      return;
    }
    setBusy(true);
    try {
      const id = await saveProgram({
        ...draft,
        name: draft.name.trim(),
        focus: draft.focus.trim(),
        days: draft.days.map((d) => ({
          ...d,
          name: d.name.trim(),
          focus: d.focus.trim(),
          steps: d.steps.map((s) => ({
            ...s,
            note: s.note.trim(),
            text: s.text.trim(),
            reps: s.reps.trim() || null,
            sets: asNumber(s.sets, true),
            loadKg: asNumber(s.loadKg),
            restSec: asNumber(s.restSec, true),
          })),
        })),
      });
      // Made from a client's page: it is theirs right away.
      if (isNew && clientId) await assignProgram(id, [clientId], {});
      window.location.replace(backTo);
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  async function remove() {
    const who = holders === 1 ? "1 cliente la tiene y deja" : `${holders} clientes la tienen y dejan`;
    const question = holders > 0 ? `¿Eliminar esta rutina? ${who} de verla.` : "¿Eliminar esta rutina?";
    if (!window.confirm(`${question} Los entrenamientos ya registrados se conservan.`)) return;
    try {
      await deleteProgram(draft.id);
      window.location.replace("#/rutinas");
    } catch (e) {
      setError(errorText(e));
    }
  }

  /* ---- Screen ---- */

  const pickerStep = picker?.stepId ? day.steps.find((s) => s.id === picker.stepId) : null;
  let title = "Editar rutina";
  if (isNew) title = clientId ? `Nueva rutina para ${clientName ?? "el cliente"}` : start ? "Duplicar rutina" : "Nueva rutina";
  // Who sees it when it's saved.
  let reach = "";
  if (isNew && clientId) reach = `Al guardarla se la asignás a ${clientName ?? "este cliente"}.`;
  else if (!isNew && holders > 0) {
    reach = `${holders === 1 ? "La tiene 1 cliente" : `La tienen ${holders} clientes`}: ven los cambios apenas guardes, con sus propias series y kilos. Si alguien necesita otros ejercicios, duplicala.`;
  }

  // New routine, first step: the name and how many days.
  if (setup) {
    return (
      <div className="screen has-action-bar">
        <div className="top-bar">
          <BackButton fallback={backTo} />
          <span className="top-bar-title">{title}</span>
        </div>
        <div className="content">
          {reach && <p className="hint">{reach}</p>}
          <label className="field">
            <span className="field-label">Nombre de la rutina</span>
            <input
              className="input"
              value={draft.name}
              placeholder="Ej: Bloque C"
              maxLength={60}
              autoFocus
              onChange={(e) => update({ name: e.target.value })}
            />
          </label>
          <h2 className="block-title">¿Cuántos días?</h2>
          <div className="days-count" role="radiogroup" aria-label="Cantidad de días">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={n === dayCount}
                className={n === dayCount ? "chip active" : "chip"}
                onClick={() => setDayCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="hint">Después podés agregar o quitar días cuando quieras.</p>
        </div>
        <div className="action-bar">
          <button type="button" className="primary-button" onClick={startDays}>
            {dayCount === 1 ? "Armar la rutina" : `Armar los ${dayCount} días`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen has-action-bar">
      <div className="top-bar">
        <BackButton fallback={backTo} confirmMessage={dirty ? "Tenés cambios sin guardar. ¿Salir igual?" : null} />
        <span className="top-bar-title">{title}</span>
      </div>

      <div className="content">
        {reach && <p className="hint">{reach}</p>}

        <label className="field">
          <span className="field-label">Nombre de la rutina</span>
          <input
            className="input"
            value={draft.name}
            placeholder="Ej: Bloque C"
            maxLength={60}
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">Resumen (opcional)</span>
          <input
            className="input"
            value={draft.focus}
            placeholder="Ej: Piernas, tren superior y posterior"
            maxLength={80}
            onChange={(e) => update({ focus: e.target.value })}
          />
        </label>

        {/* One tab per day, plus "+ Día" */}
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

        {several && (
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
          <span className="field-label">Enfoque del día (opcional)</span>
          <input
            className="input"
            value={day.focus}
            placeholder="Ej: Cuádriceps + glúteos"
            maxLength={60}
            onChange={(e) => updateDay((x) => ({ ...x, focus: e.target.value }))}
          />
        </label>

        <h2 className="block-title">Ejercicios de {dayLabel(day, current)}</h2>
        {day.steps.length === 0 && <p className="hint">Todavía no agregaste ejercicios.</p>}

        <ol className="steps">
          {day.steps.map((step, index) => {
            const kind = stepKind(step);
            const defaultPrescription = step.vuelta ? "" : (getExercise(step.exerciseIds[0])?.prescription ?? "");
            return (
              <li key={step.id} className="step edit-step">
                {/* Header: number, kind, move and delete */}
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

                {step.vuelta ? (
                  <p className="edit-vuelta">{getVuelta(step.vuelta)?.label ?? step.vuelta}</p>
                ) : (
                  <>
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
                  </>
                )}

                {/* The trainer's numbers */}
                <div className="step-numbers">
                  <label className="field">
                    <span className="field-label">Series</span>
                    <input className="input" inputMode="numeric" value={step.sets} onChange={(e) => updateStep(step.id, { sets: e.target.value })} />
                  </label>
                  <label className="field">
                    <span className="field-label">Reps</span>
                    <input className="input" value={step.reps} placeholder="8-10" onChange={(e) => updateStep(step.id, { reps: e.target.value })} />
                  </label>
                  <label className="field">
                    <span className="field-label">Kg</span>
                    <input className="input" inputMode="decimal" value={step.loadKg} onChange={(e) => updateStep(step.id, { loadKg: e.target.value })} />
                  </label>
                  <label className="field">
                    <span className="field-label">Pausa (seg)</span>
                    <input className="input" inputMode="numeric" value={step.restSec} placeholder="90" onChange={(e) => updateStep(step.id, { restSec: e.target.value })} />
                  </label>
                </div>
                <label className="field">
                  <span className="field-label">Indicaciones</span>
                  <input
                    className="input"
                    value={step.text}
                    placeholder={defaultPrescription || "Ej: bajada lenta, subida explosiva"}
                    onChange={(e) => updateStep(step.id, { text: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="field-label">Nota</span>
                  <input className="input" value={step.note} placeholder="Ej: rodillas hacia afuera" onChange={(e) => updateStep(step.id, { note: e.target.value })} />
                </label>
              </li>
            );
          })}
        </ol>

        <button type="button" className="add-button" onClick={() => setPicker({ stepId: null })}>
          + Agregar ejercicio
        </button>
        {choosingVuelta ? (
          <div className="vuelta-choices" role="group" aria-label="Elegí una vuelta">
            {VUELTAS.map((v) => (
              <button key={v.key} type="button" className="chip" onClick={() => addVuelta(v.key)}>
                {v.label}
              </button>
            ))}
            <button type="button" className="text-button" onClick={() => setChoosingVuelta(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" className="text-button" onClick={() => setChoosingVuelta(true)}>
            + Agregar una vuelta completa
          </button>
        )}

        {/* Move or remove the day on screen */}
        {several && (
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
        )}

        {!isNew && (
          <>
            {/* From what is saved: with unsaved changes, save first */}
            {!dirty && (
              <a className="secondary-button" href={`#/nueva-rutina?desde=${draft.id}`}>
                Duplicar rutina
              </a>
            )}
            <button type="button" className="danger-button" onClick={remove}>
              Eliminar rutina
            </button>
          </>
        )}
      </div>

      {/* Save bar, stuck above the tab bar */}
      <div className="action-bar">
        {error && <p className="action-error">{error}</p>}
        <button type="button" className="primary-button" onClick={save} disabled={busy}>
          {busy ? "Guardando..." : "Guardar"}
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
