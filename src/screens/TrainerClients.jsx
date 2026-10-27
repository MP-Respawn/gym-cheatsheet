/*
 * TrainerClients.jsx: the trainer's clients (#/clientes)
 *
 * The list of your clients, each with where they stand: "Activo" (has an
 * account), "Invitación pendiente" (link sent, until when), "Link vencido"
 * or "Sin invitar". Tapping one opens their page (TrainerClient.jsx).
 *
 * "+ Nuevo cliente" opens a small form (name, optional email). Creating
 * the client also creates their invitation link, shown right there to copy
 * or send by WhatsApp. Archived clients are hidden behind "Ver archivados".
 */
import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import InviteLink from "../components/InviteLink.jsx";
import { createClient, errorText, fetchClients, inviteStatus, useQuery } from "../store/trainer.js";
import { statusText } from "../utils/trainerText.js";

function NewClientForm({ onDone }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null); // { id, link, name }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { id, link } = await createClient({ fullName, email });
      setCreated({ id, link, name: fullName.trim() });
    } catch (e) {
      setError(errorText(e));
    }
    setBusy(false);
  }

  if (created) {
    return (
      <div className="panel">
        <h2 className="block-title">Listo: mandale este link a {created.name}</h2>
        <InviteLink link={created.link} name={created.name} />
        <div className="panel-actions">
          <a className="secondary-button" href={`#/cliente/${created.id}`}>
            Ver cliente
          </a>
          <button type="button" className="text-button" onClick={onDone}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2 className="block-title">Nuevo cliente</h2>
      <label className="field">
        <span className="field-label">Nombre</span>
        <input className="input" required autoFocus maxLength={60} value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Email (opcional)</span>
        <input
          className="input"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <p className="hint">Con el link que te damos, tu cliente entra con su email y ve las rutinas que le asignes.</p>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <div className="panel-actions">
        <button type="submit" className="primary-button" disabled={busy || !fullName.trim()}>
          {busy ? "Creando..." : "Crear y generar link"}
        </button>
        <button type="button" className="text-button" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function TrainerClients({ onMenuClick }) {
  const { data: clients, error, loading } = useQuery("clients", fetchClients);
  const [adding, setAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const active = (clients ?? []).filter((c) => !c.archived_at);
  const archived = (clients ?? []).filter((c) => c.archived_at);
  const shown = showArchived ? archived : active;

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />
      <div className="page-head">
        <h1 className="page-title">Clientes</h1>
      </div>

      <div className="content">
        {adding ? (
          <NewClientForm onDone={() => setAdding(false)} />
        ) : (
          <button type="button" className="add-button" onClick={() => setAdding(true)}>
            + Nuevo cliente
          </button>
        )}

        <section className="list-section">
          {error && <p className="hint warning">{error}</p>}
          {!clients && loading && <p className="empty list-empty">Cargando tus clientes...</p>}
          {clients && shown.length === 0 && (
            <p className="empty list-empty">
              {showArchived ? "No tenés clientes archivados." : "Todavía no tenés clientes. Creá el primero y mandale su link."}
            </p>
          )}
          <div className="card-list">
            {shown.map((c) => (
              <a key={c.id} className="card routine-card" href={`#/cliente/${c.id}`}>
                <div className="card-text">
                  <span className="card-title">{c.full_name}</span>
                  <span className={inviteStatus(c).state === "active" ? "card-meta" : "card-desc"}>{statusText(c)}</span>
                </div>
              </a>
            ))}
          </div>
          {(archived.length > 0 || showArchived) && (
            <button type="button" className="text-button" onClick={() => setShowArchived(!showArchived)}>
              {showArchived ? "Ver activos" : `Ver archivados (${archived.length})`}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
