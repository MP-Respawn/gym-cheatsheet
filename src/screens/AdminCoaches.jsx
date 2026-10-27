/*
 * AdminCoaches.jsx: the coaches (#/entrenadores), for the superadmin only
 *
 * "+ Invitar un coach" makes a one-use link (optional email, just to
 * remember who it was for): whoever opens it and signs in becomes a coach.
 * Links not used yet are listed, and can be cancelled.
 *
 * Then every coach, with how many clients they have, and two switches:
 *   - "Desactivar" turns the account off: they keep their data, but cannot
 *     see or change anything (their clients still see their routines).
 *   - "Responde pedidos" lets that coach answer exercise requests with you
 *     (the coach who curates the catalog).
 * Your own row has no switches (the database refuses turning you off).
 */
import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import InviteLink from "../components/InviteLink.jsx";
import {
  fetchCoachInvitations,
  fetchCoaches,
  inviteCoach,
  revokeInvitation,
  setCoachDisabled,
  setCurator,
} from "../store/admin.js";
import { getAuth } from "../store/auth.js";
import { errorText, useQuery } from "../store/trainer.js";
import { shortDate } from "../utils/trainerText.js";

const COACH_MESSAGE = "Hola! Te sumé como coach en Respawn Fitness. Entrá desde este link con tu email:";
const COACH_HINT = "Sirve una sola vez y vence en 7 días. Quien lo abra y entre con su email queda como coach.";

function InviteForm({ onDone }) {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setLink(await inviteCoach(email));
    } catch (e) {
      setError(errorText(e));
    }
    setBusy(false);
  }

  if (link) {
    return (
      <div className="panel">
        <h2 className="block-title">Mandale este link</h2>
        <InviteLink link={link} message={COACH_MESSAGE} hint={COACH_HINT} />
        <div className="panel-actions">
          <button type="button" className="text-button" onClick={onDone}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2 className="block-title">Invitar un coach</h2>
      <label className="field">
        <span className="field-label">Email (opcional, para acordarte de quién es)</span>
        <input
          className="input"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <div className="panel-actions">
        <button type="submit" className="primary-button" disabled={busy}>
          {busy ? "Generando..." : "Generar link"}
        </button>
        <button type="button" className="text-button" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function AdminCoaches({ onMenuClick }) {
  const { data: coaches, error, loading } = useQuery("coaches", fetchCoaches);
  const { data: invitations } = useQuery("coach-invitations", fetchCoachInvitations);
  const [inviting, setInviting] = useState(false);
  const [actionError, setActionError] = useState("");
  const me = getAuth().user?.id;

  // Runs an action and shows its error, if any.
  const run = (action) => async () => {
    setActionError("");
    try {
      await action();
    } catch (e) {
      setActionError(errorText(e));
    }
  };

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />
      <div className="page-head">
        <h1 className="page-title">Coaches</h1>
      </div>

      <div className="content">
        {inviting ? (
          <InviteForm onDone={() => setInviting(false)} />
        ) : (
          <button type="button" className="add-button" onClick={() => setInviting(true)}>
            + Invitar un coach
          </button>
        )}

        {invitations?.length > 0 && (
          <section className="list-section">
            <h2 className="section-title">Links sin usar</h2>
            {invitations.map((inv) => (
              <div key={inv.id} className="archived-row">
                <span>
                  {inv.email || "Sin email"} · vence el {shortDate.format(new Date(inv.expires_at))}
                </span>
                <button type="button" className="text-button" onClick={run(() => revokeInvitation(inv.id))}>
                  Anular
                </button>
              </div>
            ))}
          </section>
        )}

        <section className="list-section">
          <h2 className="section-title">Coaches</h2>
          {(error || actionError) && <p className="hint warning">{actionError || error}</p>}
          {!coaches && loading && <p className="empty list-empty">Cargando...</p>}
          <div className="card-list">
            {(coaches ?? []).map((c) => {
              const clients = c.clients?.[0]?.count ?? 0;
              const isMe = c.id === me;
              const off = Boolean(c.disabled_at);
              return (
                <article key={c.id} className={off ? "card template-card coach-off" : "card template-card"}>
                  <div className="card-text">
                    <span className="card-title">
                      {c.full_name || c.email}
                      {isMe && " (vos)"}
                    </span>
                    {c.full_name && <span className="card-meta">{c.email}</span>}
                    <span className="card-desc">
                      {clients === 1 ? "1 cliente" : `${clients} clientes`}
                      {off && ` · desactivado desde el ${shortDate.format(new Date(c.disabled_at))}`}
                    </span>
                  </div>
                  {!isMe && (
                    <div className="coach-controls">
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={c.can_curate_catalog}
                          onChange={run(() => setCurator(c.id, !c.can_curate_catalog))}
                        />
                        Responde pedidos de ejercicios
                      </label>
                      <button
                        type="button"
                        className={off ? "secondary-button" : "danger-button"}
                        onClick={run(async () => {
                          const name = c.full_name || c.email;
                          if (off || window.confirm(`¿Desactivar a ${name}? No va a poder entrar a ver ni cambiar nada; sus datos se conservan.`)) {
                            await setCoachDisabled(c.id, !off);
                          }
                        })}
                      >
                        {off ? "Activar" : "Desactivar"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
