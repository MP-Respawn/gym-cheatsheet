/*
 * AssignProgram.jsx: give a routine to clients, or change their numbers
 * (#/asignar/<id>?cliente=<id>)
 *
 * 1. Tick the clients (opening it from a client's page ticks them already).
 *    Clients who already have the routine say so.
 * 2. The grid: every step of the routine, day by day, with one row per
 *    ticked client to set their own series, reps and kg. The rows start
 *    with the numbers that client has now (the routine's, or their own);
 *    change only what is different for that person.
 * 3. "Asignar" / "Guardar" gives the routine to every ticked client and
 *    sets their numbers, all at once (assign_program in the database: all
 *    or nothing). Then it goes to the client's page (one client) or back
 *    to the routines.
 *
 * Only numbers that differ from the routine travel as "overrides", and
 * they replace what each ticked client had:
 *   { [clientId]: { [stepId]: { sets, reps, load_kg } } }
 */
import { useState } from "react";
import { getExercise, getVuelta } from "../data/exercises.js";
import { assignProgram, errorText, fetchAssignments, fetchClients, fetchProgram, useQuery } from "../store/trainer.js";
import BackButton from "../components/BackButton.jsx";

const byPosition = (a, b) => a.position - b.position;

// "Sentadilla con barra + Press Arnold", or the vuelta's name.
function stepTitle(step) {
  if (step.vuelta) return getVuelta(step.vuelta)?.label ?? step.vuelta;
  return step.exercise_ids.map((id) => getExercise(id)?.name ?? id).join(" + ");
}

// Numbers for a step as the text the inputs show: the routine's, with a
// client's own on top (`own`, from assignment_steps) where they have them.
const startValues = (step, own) => {
  const sets = own?.sets ?? step.sets;
  const kg = own?.load_kg ?? step.load_kg;
  return {
    sets: sets == null ? "" : String(sets),
    reps: own?.reps ?? step.reps ?? "",
    kg: kg == null ? "" : String(kg).replace(".", ","),
  };
};

function asNumber(text, whole = false) {
  const n = Number(String(text).replace(",", ".").trim());
  if (String(text).trim() === "" || Number.isNaN(n) || n < 0) return null;
  return whole ? Math.round(n) : n;
}

export default function AssignProgram({ id, preselected }) {
  const { data: program, error: programError } = useQuery(`program:${id}`, fetchProgram(id));
  const { data: clients, error: clientsError } = useQuery("clients", fetchClients);
  const { data: assignments, error: assignmentsError } = useQuery(`assignments:${id}`, fetchAssignments(id));
  const [chosen, setChosen] = useState(() => (preselected ? [preselected] : []));
  // values[clientId][stepId] = { sets, reps, kg } as typed; missing = what they have now.
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const back = preselected ? `#/cliente/${preselected}` : "#/rutinas";

  // Wait for everything: saving replaces each client's numbers, so the grid
  // must start from the ones they have.
  if (!program || !clients || !assignments) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback={back} />
        </div>
        <p className="empty">{programError ?? clientsError ?? assignmentsError ?? "Cargando..."}</p>
      </div>
    );
  }

  const active = clients.filter((c) => !c.archived_at);
  const chosenClients = active.filter((c) => chosen.includes(c.id));
  const days = [...program.program_days].sort(byPosition);
  const steps = days.flatMap((d) => d.program_steps);

  // Who has it now, and each one's own numbers by step.
  const has = new Set(assignments.filter((a) => !a.archived_at).map((a) => a.client_id));
  const ownNumbers = new Map(
    assignments.map((a) => [a.client_id, new Map(a.assignment_steps.map((o) => [o.step_id, o]))]),
  );
  // Someone who had it taken away starts again from the routine's numbers.
  const own = (clientId, step) => (has.has(clientId) ? ownNumbers.get(clientId)?.get(step.id) : undefined);
  const valueOf = (clientId, step) => values[clientId]?.[step.id] ?? startValues(step, own(clientId, step));
  const onlyAdjusting = chosen.length > 0 && chosen.every((c) => has.has(c));

  function toggle(clientId) {
    setChosen((list) => (list.includes(clientId) ? list.filter((c) => c !== clientId) : [...list, clientId]));
    setError("");
  }

  function change(clientId, step, field, text) {
    setValues((v) => ({
      ...v,
      [clientId]: { ...v[clientId], [step.id]: { ...valueOf(clientId, step), [field]: text } },
    }));
  }

  // Every step where a ticked client's numbers differ from the routine's.
  // All of them, typed now or not: saving replaces what each client had.
  function overrides() {
    const result = {};
    for (const clientId of chosen) {
      for (const step of steps) {
        const typed = valueOf(clientId, step);
        const base = startValues(step);
        const diff = {};
        if (typed.sets !== base.sets) diff.sets = asNumber(typed.sets, true);
        if (typed.reps !== base.reps) diff.reps = typed.reps.trim() || null;
        if (typed.kg !== base.kg) diff.load_kg = asNumber(typed.kg);
        // An emptied box goes back to the routine's number (a client cannot have "none").
        for (const key of Object.keys(diff)) if (diff[key] == null) delete diff[key];
        if (Object.keys(diff).length > 0) ((result[clientId] ??= {})[step.id] = diff);
      }
    }
    return result;
  }

  async function assign() {
    setBusy(true);
    setError("");
    try {
      await assignProgram(program.id, chosen, overrides());
      window.location.replace(chosen.length === 1 ? `#/cliente/${chosen[0]}` : "#/rutinas");
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  return (
    <div className="screen has-action-bar">
      <div className="top-bar">
        <BackButton fallback={back} />
        <span className="top-bar-title">{onlyAdjusting ? "Ajustar series y kilos" : "Asignar rutina"}</span>
      </div>

      <div className="content">
        <p className="routine-block">Rutina</p>
        <h1 className="detail-title">{program.name}</h1>

        <h2 className="block-title">¿A quién?</h2>
        {active.length === 0 && <p className="hint">Todavía no tenés clientes: creá uno en Clientes.</p>}
        <div className="client-choices">
          {active.map((c) => (
            <label key={c.id} className={chosen.includes(c.id) ? "chip active" : "chip"}>
              <input type="checkbox" className="visually-hidden" checked={chosen.includes(c.id)} onChange={() => toggle(c.id)} />
              {c.full_name}
              {has.has(c.id) && <span className="chip-note"> · ya la tiene</span>}
            </label>
          ))}
        </div>

        {chosenClients.length > 0 && (
          <>
            <h2 className="block-title">Series, reps y kilos de cada uno</h2>
            <p className="hint">
              Empiezan con los que tiene cada uno ahora. Cambiá solo lo que sea distinto para cada persona; si después
              cambiás la rutina, cada uno conserva los suyos.
            </p>

            {days.map((day, dayIndex) => (
              <section key={day.id} className="assign-day">
                {days.length > 1 && <h3 className="section-title">{day.name || `Día ${dayIndex + 1}`}</h3>}
                <ol className="steps">
                  {[...day.program_steps].sort(byPosition).map((step, index) => (
                    <li key={step.id} className="step assign-step">
                      <div className="step-head">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-name">{stepTitle(step)}</span>
                      </div>
                      {step.prescription_text && <p className="hint">{step.prescription_text}</p>}
                      <div className="assign-rows">
                        {chosenClients.map((client) => {
                          const v = valueOf(client.id, step);
                          return (
                            <div key={client.id} className="assign-row">
                              <span className="assign-name">{client.full_name}</span>
                              <input
                                className="input"
                                inputMode="numeric"
                                aria-label={`Series de ${client.full_name}`}
                                placeholder="series"
                                value={v.sets}
                                onChange={(e) => change(client.id, step, "sets", e.target.value)}
                              />
                              <span className="assign-x">x</span>
                              <input
                                className="input"
                                aria-label={`Reps de ${client.full_name}`}
                                placeholder="reps"
                                value={v.reps}
                                onChange={(e) => change(client.id, step, "reps", e.target.value)}
                              />
                              <input
                                className="input"
                                inputMode="decimal"
                                aria-label={`Kilos de ${client.full_name}`}
                                placeholder="kg"
                                value={v.kg}
                                onChange={(e) => change(client.id, step, "kg", e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </>
        )}
      </div>

      <div className="action-bar">
        {error && <p className="action-error">{error}</p>}
        <button type="button" className="primary-button" onClick={assign} disabled={busy || chosen.length === 0}>
          {busy
            ? "Guardando..."
            : chosen.length === 0
              ? "Elegí a quién"
              : onlyAdjusting
                ? "Guardar"
                : chosen.length > 1
                  ? `Asignar a ${chosen.length} clientes`
                  : `Asignar a ${chosenClients[0]?.full_name ?? "1 cliente"}`}
        </button>
      </div>
    </div>
  );
}
