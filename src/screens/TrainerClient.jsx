/*
 * TrainerClient.jsx: one of the trainer's clients (#/cliente/<id>)
 *
 * From top to bottom:
 *   - name, email and where they stand (account, pending link...). Until
 *     they have an account, "Generar link" makes a new invitation link
 *     (the previous one stops working) to copy or send by WhatsApp.
 *   - their routines: "Series y kilos" changes their own numbers (the
 *     assign screen with only them), "Editar rutina" opens the builder (the
 *     change reaches everyone who has it), "Quitar" takes it away (they stop
 *     seeing it; nothing is deleted), and taken ones can be given back.
 *   - "Armar una rutina nueva": the builder; the routine is theirs on save.
 *   - "Asignar una rutina": pick one of your routines; the assign screen
 *     opens with this client ticked.
 *   - what they trained: their last workouts, newest first, each exercise
 *     with the sets they did and, when the routine had numbers, the plan.
 *   - archive the client (hidden from your list; nothing is deleted).
 */
import { useState } from "react";
import { getExercise } from "../data/exercises.js";
import { formatNumber, formatSet } from "../store/workouts.js";
import {
  errorText,
  fetchClient,
  fetchClientAssignments,
  fetchClientSessions,
  fetchRoutines,
  inviteStatus,
  newInvitation,
  setAssignmentArchived,
  setClientArchived,
  useQuery,
} from "../store/trainer.js";
import BackButton from "../components/BackButton.jsx";
import InviteLink from "../components/InviteLink.jsx";
import { programSize, shortDate, statusText } from "../utils/trainerText.js";

// "lun 3 nov"
const sessionDate = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", month: "short" });

// The plan of an exercise in a workout, from its first set: "4 x 8 · 50 kg", or "".
function planText(set) {
  const parts = [];
  if (set.planned_sets && set.planned_reps) parts.push(`${set.planned_sets} x ${set.planned_reps}`);
  else if (set.planned_sets) parts.push(`${set.planned_sets} series`);
  else if (set.planned_reps) parts.push(`${set.planned_reps} reps`);
  if (set.planned_load_kg != null) parts.push(`${formatNumber(Number(set.planned_load_kg))} kg`);
  return parts.join(" · ");
}

// One workout: its exercises in order, each with its sets.
function Workout({ session }) {
  const entries = [];
  for (const set of [...session.workout_sets].sort((a, b) => a.entry_index - b.entry_index || a.set_index - b.set_index)) {
    (entries[set.entry_index] ??= { exerciseId: set.exercise_id, sets: [] }).sets.push(set);
  }
  const title =
    session.program_name && session.day_name && session.program_name !== session.day_name
      ? `${session.program_name} · ${session.day_name}`
      : session.day_name || session.program_name;
  return (
    <article className="card workout-card">
      <div className="card-text">
        <span className="card-meta">{sessionDate.format(new Date(session.started_at))}</span>
        <span className="card-title">{title}</span>
        <ul className="workout-lines">
          {entries.filter(Boolean).map((entry, i) => {
            const plan = planText(entry.sets[0]);
            const done = entry.sets.map((s) =>
              formatSet({ kg: s.kg == null ? null : Number(s.kg), reps: s.reps, secs: s.secs }),
            );
            return (
              <li key={i}>
                <span className="workout-exercise">{getExercise(entry.exerciseId)?.name ?? entry.exerciseId}</span>{" "}
                {done.join(", ")}
                {plan && <span className="workout-plan"> (plan: {plan})</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export default function TrainerClient({ id }) {
  const { data: client, error: clientError } = useQuery(`client:${id}`, fetchClient(id));
  const { data: assignments } = useQuery(`client-assignments:${id}`, fetchClientAssignments(id));
  const { data: sessions, error: sessionsError } = useQuery(`client-sessions:${id}`, fetchClientSessions(id));
  const { data: routines } = useQuery("routines", fetchRoutines);
  const [link, setLink] = useState(null);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState("");

  if (!client) {
    return (
      <div className="screen">
        <div className="top-bar">
          <BackButton fallback="#/clientes" />
        </div>
        <p className="empty">{clientError ?? "Cargando..."}</p>
      </div>
    );
  }

  const active = inviteStatus(client).state === "active";
  const mine = (assignments ?? []).filter((a) => a.programs);
  const current = mine.filter((a) => !a.archived_at);
  const archived = mine.filter((a) => a.archived_at);
  // Routines they don't have yet, for "Asignar una rutina".
  const others = (routines ?? []).filter((r) => !current.some((a) => a.program_id === r.id));

  // Runs an action and shows its error, if any.
  const run = (action) => async () => {
    setError("");
    try {
      await action();
    } catch (e) {
      setError(errorText(e));
    }
  };

  return (
    <div className="screen">
      <div className="top-bar">
        <BackButton fallback="#/clientes" />
      </div>

      <div className="content">
        <p className="routine-block">Cliente</p>
        <h1 className="detail-title">{client.full_name}</h1>
        {client.email && <p className="routine-focus">{client.email}</p>}
        <p className={active ? "program-meta client-active" : "program-meta"}>{statusText(client)}</p>
        {error && <p className="hint warning">{error}</p>}

        {/* Invitation, until they have an account */}
        {!active &&
          (link ? (
            <InviteLink link={link} name={client.full_name} />
          ) : (
            <button type="button" className="secondary-button" onClick={run(async () => setLink(await newInvitation(client.id)))}>
              Generar link de invitación
            </button>
          ))}

        {/* Their routines */}
        <section className="list-section">
          <h2 className="section-title">Rutinas</h2>
          {assignments && current.length === 0 && <p className="hint">Todavía no tiene rutinas asignadas.</p>}
          <div className="card-list">
            {current.map((a) => {
              const p = a.programs;
              // Others who have it too (an edit reaches them as well).
              const shared = p.program_assignments.filter((x) => !x.archived_at && x.id !== a.id).length;
              return (
                <article key={a.id} className="card template-card">
                  <a className="card-text" href={`#/asignar/${p.id}?cliente=${client.id}`}>
                    <span className="card-title">{p.name}</span>
                    <span className="card-desc">
                      {programSize(p.program_days)} · desde el {shortDate.format(new Date(a.created_at))}
                    </span>
                    {shared > 0 && (
                      <span className="card-desc">
                        También la {shared === 1 ? "tiene 1 cliente más" : `tienen ${shared} clientes más`}
                      </span>
                    )}
                  </a>
                  <div className="template-actions">
                    <a className="secondary-button" href={`#/asignar/${p.id}?cliente=${client.id}`}>
                      Series y kilos
                    </a>
                    <a className="secondary-button" href={`#/editar-rutina/${p.id}`}>
                      Editar rutina
                    </a>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={run(async () => {
                        if (window.confirm(`¿Quitarle "${p.name}" a ${client.full_name}? Su historial se conserva.`)) {
                          await setAssignmentArchived(a.id, true);
                        }
                      })}
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {choosing ? (
            <div className="vuelta-choices" role="group" aria-label="Elegí una rutina">
              {others.map((r) => (
                <a key={r.id} className="chip" href={`#/asignar/${r.id}?cliente=${client.id}`}>
                  {r.name}
                </a>
              ))}
              {routines && others.length === 0 && (
                <p className="hint">No tenés otras rutinas: armá una nueva o duplicá una en Rutinas.</p>
              )}
              <button type="button" className="text-button" onClick={() => setChoosing(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="add-button" onClick={() => setChoosing(true)}>
                + Asignar una rutina
              </button>
              <a className="add-button" href={`#/nueva-rutina?cliente=${client.id}`}>
                + Armar una rutina nueva
              </a>
            </>
          )}

          {archived.length > 0 && (
            <details className="archived">
              <summary>Rutinas quitadas ({archived.length})</summary>
              {archived.map((a) => (
                <div key={a.id} className="archived-row">
                  <span>{a.programs.name}</span>
                  <button type="button" className="text-button" onClick={run(() => setAssignmentArchived(a.id, false))}>
                    Devolver
                  </button>
                </div>
              ))}
            </details>
          )}
        </section>

        {/* What they trained */}
        <section className="list-section">
          <h2 className="section-title">Entrenamientos</h2>
          {sessionsError && <p className="hint warning">{sessionsError}</p>}
          {sessions?.length === 0 && <p className="hint">Todavía no registró entrenamientos.</p>}
          <div className="card-list">
            {(sessions ?? []).map((s) => (
              <Workout key={s.id} session={s} />
            ))}
          </div>
        </section>

        <button
          type="button"
          className="danger-button"
          onClick={run(async () => {
            if (client.archived_at) {
              await setClientArchived(client.id, false);
            } else if (window.confirm(`¿Archivar a ${client.full_name}? Deja de aparecer en tu lista; no se borra nada.`)) {
              await setClientArchived(client.id, true);
              window.location.replace("#/clientes");
            }
          })}
        >
          {client.archived_at ? "Volver a la lista de clientes" : "Archivar cliente"}
        </button>
      </div>
    </div>
  );
}
