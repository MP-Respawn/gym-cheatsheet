/*
 * TrainerRoutines.jsx: the coach's routines, at the top of #/rutinas
 *
 * Every routine the coach built, most recently edited first. Each card shows
 * its name, summary, size and who has it ("La tienen: Ana, Beto"), and
 * three actions: "Editar" opens the builder (ProgramEditor.jsx; everyone who
 * has it sees the change), "Asignar" gives it to clients with their own
 * numbers (AssignProgram.jsx), and "Duplicar" starts a new routine as a copy
 * (for a client who needs other exercises). Two ways to start a new one:
 * "Armar con asistente" (the builder, straight into the assistant's chat)
 * and "+ Nueva rutina a mano".
 */
import { fetchRoutines, holders, useQuery } from "../store/trainer.js";
import { programSize } from "../utils/trainerText.js";

// "La tienen: Ana y Beto", "La tiene: Ana", "Sin asignar".
function holdersText(names) {
  if (names.length === 0) return "Sin asignar";
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} y ${names.at(-1)}`;
  return `${names.length === 1 ? "La tiene" : "La tienen"}: ${list}`;
}

export default function TrainerRoutines() {
  const { data: routines, error, loading } = useQuery("routines", fetchRoutines);

  return (
    <section className="list-section">
      <h2 className="section-title">Tus rutinas</h2>
      <div className="new-routine-actions">
        <a className="primary-button" href="#/nueva-rutina?asistente=1">
          Armar con asistente
        </a>
        <a className="add-button" href="#/nueva-rutina">
          + Nueva rutina a mano
        </a>
      </div>
      {error && <p className="hint warning">{error}</p>}
      {!routines && loading && <p className="empty list-empty">Cargando tus rutinas...</p>}
      {routines?.length === 0 && (
        <p className="empty list-empty">Todavía no armaste rutinas. Armá una y asignásela a tus clientes.</p>
      )}
      <div className="card-list">
        {(routines ?? []).map((r) => (
          <article key={r.id} className="card template-card">
            <a className="card-text" href={`#/editar-rutina/${r.id}`}>
              <span className="card-title">{r.name}</span>
              {r.focus && <span className="card-meta">{r.focus}</span>}
              <span className="card-desc">{programSize(r.program_days)}</span>
              <span className="card-desc">{holdersText(holders(r))}</span>
            </a>
            <div className="template-actions">
              <a className="secondary-button" href={`#/editar-rutina/${r.id}`}>
                Editar
              </a>
              <a className="secondary-button" href={`#/nueva-rutina?desde=${r.id}`}>
                Duplicar
              </a>
              <a className="primary-button" href={`#/asignar/${r.id}`}>
                Asignar
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
