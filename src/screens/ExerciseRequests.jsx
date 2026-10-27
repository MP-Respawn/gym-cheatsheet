/*
 * ExerciseRequests.jsx: "Pedidos" (#/pedidos, ?nombre=<text> fills the name)
 *
 * For every coach: "+ Pedir un ejercicio" (name, how it's done, a video
 * link) and their requests with the answer: pending, added (with a link to
 * the exercise) or not added, with the note.
 *
 * For you and the coach who curates the catalog, it is also the inbox:
 * "Por responder" lists everybody's pending requests. Once the exercise is
 * in the code (exercises.js + its animation, deployed), "Ya está" picks it
 * from the catalog and marks the request accepted; "No lo agregamos"
 * rejects it. Both take a note for the coach, who gets the answer by email
 * (and you get an email for every new request: supabase/functions/
 * exercise-request-email).
 */
import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import ExercisePicker from "../components/ExercisePicker.jsx";
import { getExercise } from "../data/exercises.js";
import { fetchRequests, isMine, requestExercise, resolveRequest } from "../store/admin.js";
import { errorText, useQuery } from "../store/trainer.js";
import { useIsCurator } from "../store/useStore.js";
import { shortDate } from "../utils/trainerText.js";

function RequestForm({ startName, onDone }) {
  const [name, setName] = useState(startName);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await requestExercise({ name, description, videoUrl });
      onDone();
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2 className="block-title">Pedir un ejercicio</h2>
      <label className="field">
        <span className="field-label">Nombre</span>
        <input className="input" required autoFocus maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Cómo se hace (opcional)</span>
        <textarea
          className="input"
          rows={3}
          maxLength={1000}
          placeholder="Ej: con mancuernas, el pie de atrás en un banco"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="field-label">Link a un video (opcional)</span>
        <input
          className="input"
          type="url"
          inputMode="url"
          autoCapitalize="none"
          placeholder="https://..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </label>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <div className="panel-actions">
        <button type="submit" className="primary-button" disabled={busy || !name.trim()}>
          {busy ? "Mandando..." : "Mandar pedido"}
        </button>
        <button type="button" className="text-button" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

// The answer part of a request: "Agregado: <exercise>" / "No se agrega" / "Pendiente".
function Answer({ request }) {
  if (request.status === "pending") return <span className="card-desc">Pendiente</span>;
  const exercise = request.resolved_exercise_id && getExercise(request.resolved_exercise_id);
  return (
    <>
      {request.status === "accepted" ? (
        <span className="card-meta">
          Agregado:{" "}
          <a href={`#/ejercicio/${request.resolved_exercise_id}`}>{exercise?.name ?? request.resolved_exercise_id}</a>
        </span>
      ) : (
        <span className="card-desc request-rejected">No se agrega</span>
      )}
      {request.resolution_note && <span className="card-desc">{request.resolution_note}</span>}
    </>
  );
}

// One request. `answering` adds the curator's buttons.
function RequestCard({ request, answering }) {
  const [mode, setMode] = useState(null); // null | "accept" | "reject"
  const [exerciseId, setExerciseId] = useState(null);
  const [picking, setPicking] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const asker = request.profiles?.full_name || request.profiles?.email;

  async function save() {
    setBusy(true);
    setError("");
    try {
      await resolveRequest(request.id, { status: mode === "accept" ? "accepted" : "rejected", exerciseId, note });
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  return (
    <article className="card template-card">
      <div className="card-text">
        <span className="card-title">{request.name}</span>
        <span className="card-desc">
          {answering && asker && !isMine(request) ? `${asker} · ` : ""}
          {shortDate.format(new Date(request.created_at))}
        </span>
        {request.description && <span className="card-desc request-text">{request.description}</span>}
        {request.video_url && (
          <a className="card-desc" href={request.video_url} target="_blank" rel="noreferrer">
            Ver el video
          </a>
        )}
        <Answer request={request} />
      </div>

      {answering && !mode && (
        <div className="template-actions">
          <button type="button" className="primary-button" onClick={() => setMode("accept")}>
            Ya está
          </button>
          <button type="button" className="secondary-button" onClick={() => setMode("reject")}>
            No lo agregamos
          </button>
        </div>
      )}

      {mode && (
        <div className="request-answer">
          {mode === "accept" && (
            <button type="button" className="secondary-button" onClick={() => setPicking(true)}>
              {exerciseId ? `Ejercicio: ${getExercise(exerciseId)?.name ?? exerciseId}` : "Elegí el ejercicio del catálogo"}
            </button>
          )}
          <label className="field">
            <span className="field-label">Nota para el coach (opcional)</span>
            <input
              className="input"
              value={note}
              placeholder={mode === "accept" ? "Ej: lo llamamos Sentadilla búlgara" : "Ej: usá Zancada atrás en su lugar"}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          {error && <p className="hint warning">{error}</p>}
          <div className="template-actions">
            <button type="button" className="primary-button" disabled={busy || (mode === "accept" && !exerciseId)} onClick={save}>
              {busy ? "Guardando..." : "Responder"}
            </button>
            <button type="button" className="text-button" onClick={() => setMode(null)}>
              Cancelar
            </button>
          </div>
          {picking && (
            <ExercisePicker
              title="¿Cuál es el ejercicio?"
              onPick={(id) => {
                setExerciseId(id);
                setPicking(false);
              }}
              onClose={() => setPicking(false)}
            />
          )}
        </div>
      )}
    </article>
  );
}

export default function ExerciseRequests({ onMenuClick, startName = "" }) {
  const { data: requests, error, loading } = useQuery("requests", fetchRequests);
  const isCurator = useIsCurator();
  const [asking, setAsking] = useState(Boolean(startName));

  const all = requests ?? [];
  const pending = isCurator ? all.filter((r) => r.status === "pending") : [];
  // A coach: their own. A curator: everything already answered (theirs included).
  const rest = isCurator ? all.filter((r) => r.status !== "pending") : all.filter(isMine);

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />
      <div className="page-head">
        <h1 className="page-title">Pedidos de ejercicios</h1>
      </div>

      <div className="content">
        {asking ? (
          <RequestForm startName={startName} onDone={() => setAsking(false)} />
        ) : (
          <button type="button" className="add-button" onClick={() => setAsking(true)}>
            + Pedir un ejercicio
          </button>
        )}
        <p className="hint">
          ¿Falta un ejercicio en el catálogo? Pedilo y te avisamos por email cuando esté (o si no lo vamos a agregar).
        </p>
        {error && <p className="hint warning">{error}</p>}
        {!requests && loading && <p className="empty list-empty">Cargando...</p>}

        {isCurator && (
          <section className="list-section">
            <h2 className="section-title">Por responder ({pending.length})</h2>
            {requests && pending.length === 0 && <p className="hint">No hay pedidos sin responder.</p>}
            <div className="card-list">
              {pending.map((r) => (
                <RequestCard key={r.id} request={r} answering />
              ))}
            </div>
          </section>
        )}

        <section className="list-section">
          <h2 className="section-title">{isCurator ? "Respondidos" : "Tus pedidos"}</h2>
          {requests && rest.length === 0 && (
            <p className="hint">{isCurator ? "Todavía no respondiste pedidos." : "Todavía no pediste ejercicios."}</p>
          )}
          <div className="card-list">
            {rest.map((r) => (
              <RequestCard key={r.id} request={r} answering={false} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
