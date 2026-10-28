/*
 * AssistantPanel.jsx: "Armar con asistente", inside the routine builder
 *
 * A chat with the routine assistant (src/store/assistant.js). A switch on
 * top picks the mode: Coach experto (Sonnet 5.5, may suggest exercises we
 * don't have) or Catálogo (Haiku 5.5, only our exercises). Changing it
 * starts a new conversation.
 *
 * Every message carries the builder's current routine, so the assistant
 * can refine it. When it proposes a routine, a card shows the summary:
 *   - "Usar esta propuesta" fills the builder (onApply); the coach adjusts
 *     and saves as usual. Nothing is saved by the assistant.
 *   - exercises not in the catalog are listed; in the routine they appear as
 *     the closest one of ours with a "Pendiente" note, and "Pedir" sends
 *     them to Pedidos (an email reaches whoever answers requests).
 * The conversation lasts while the builder is open.
 */
import { useState } from "react";
import { getExercise } from "../data/exercises.js";
import { requestExercise } from "../store/admin.js";
import { ASSISTANT_MODES, askAssistant, draftForAssistant, newExercises, saveMode, savedMode } from "../store/assistant.js";
import { errorText } from "../store/trainer.js";

// "3 días · 18 ejercicios" for a proposal.
function proposalSize(p) {
  const steps = p.days.reduce((n, d) => n + d.steps.length, 0);
  return `${p.days.length} ${p.days.length === 1 ? "día" : "días"} · ${steps} ${steps === 1 ? "paso" : "pasos"}`;
}

function ProposalCard({ proposal, onApply }) {
  const extra = newExercises(proposal);
  const [used, setUsed] = useState(false);
  const [asked, setAsked] = useState("idle"); // idle | busy | done | error
  const [askError, setAskError] = useState("");

  async function ask() {
    setAsked("busy");
    try {
      for (const ex of extra) await requestExercise({ name: ex.name, description: ex.description, videoUrl: "" });
      setAsked("done");
    } catch (e) {
      setAskError(errorText(e));
      setAsked("error");
    }
  }

  return (
    <div className="assistant-proposal">
      <span className="card-title">{proposal.name || "Rutina propuesta"}</span>
      {proposal.focus && <span className="card-meta">{proposal.focus}</span>}
      <span className="card-desc">{proposalSize(proposal)}</span>
      {extra.length > 0 && (
        <div className="assistant-new">
          <p className="hint">
            No están en el catálogo (mientras tanto va el más parecido):{" "}
            {extra.map((ex) => `${ex.name} → ${getExercise(ex.closestId)?.name ?? ex.closestId}`).join("; ")}.
          </p>
          {asked === "done" ? (
            <p className="hint">Pedidos enviados.</p>
          ) : (
            <button type="button" className="secondary-button" disabled={asked === "busy"} onClick={ask}>
              {asked === "busy" ? "Pidiendo..." : extra.length === 1 ? "Pedir el ejercicio nuevo" : `Pedir los ${extra.length} ejercicios nuevos`}
            </button>
          )}
          {asked === "error" && <p className="hint warning">{askError}</p>}
        </div>
      )}
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          onApply(proposal);
          setUsed(true);
        }}
      >
        {used ? "Usada: está en el constructor" : "Usar esta propuesta"}
      </button>
    </div>
  );
}

export default function AssistantPanel({ draft, onApply, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  const [mode, setMode] = useState(savedMode);
  const [history, setHistory] = useState([]); // what the function returned, sent back as is
  const [chat, setChat] = useState([]); // what is on screen: { role, text, proposal }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(null);

  function switchMode(next) {
    if (next === mode) return;
    if (chat.length > 0 && !window.confirm("Cambiar de modo empieza una conversación nueva. ¿Seguir?")) return;
    setMode(next);
    saveMode(next);
    setHistory([]);
    setChat([]);
    setError("");
    setRemaining(null);
  }

  async function send(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setBusy(true);
    setError("");
    setChat((c) => [...c, { role: "user", text: message }]);
    setInput("");
    try {
      const reply = await askAssistant({ mode, history, message, draft: draftForAssistant(draft) });
      setHistory((h) => [...h, ...reply.messages]);
      setChat((c) => [...c, { role: "assistant", text: reply.text, proposal: reply.proposal }]);
      setRemaining(reply.remainingToday);
    } catch (e) {
      setError(e.message);
      setInput(message); // keep what they wrote, to retry
      setChat((c) => c.slice(0, -1));
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button type="button" className="add-button assistant-open" onClick={() => setOpen(true)}>
        Armar con asistente
      </button>
    );
  }

  const current = ASSISTANT_MODES.find((m) => m.key === mode);
  return (
    <section className="panel assistant" aria-label="Asistente de rutinas">
      <div className="assistant-head">
        <h2 className="block-title">Asistente</h2>
        <button type="button" className="text-button" onClick={() => setOpen(false)}>
          Cerrar
        </button>
      </div>

      <div className="theme-switch assistant-modes" role="radiogroup" aria-label="Modo del asistente">
        {ASSISTANT_MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={m.key === mode}
            className={m.key === mode ? "theme-option active" : "theme-option"}
            onClick={() => switchMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="hint">{current.hint}</p>

      <div className="assistant-chat">
        {chat.length === 0 && (
          <p className="hint">
            Contale para quién es: objetivo, nivel, días por semana, tiempo, equipo y lesiones. Si ya tenés una rutina
            abierta, pedile cambios sobre esa.
          </p>
        )}
        {chat.map((m, i) => (
          <div key={i} className={m.role === "user" ? "assistant-msg from-coach" : "assistant-msg"}>
            {m.text && <p>{m.text}</p>}
            {m.proposal && <ProposalCard proposal={m.proposal} onApply={onApply} />}
          </div>
        ))}
        {busy && <p className="hint">Pensando...</p>}
      </div>

      {error && <p className="hint warning">{error}</p>}
      <form className="assistant-input" onSubmit={send}>
        <textarea
          className="input"
          rows={2}
          maxLength={4000}
          placeholder="Ej: 3 días, hipertrofia, intermedio, sin máquinas, molestia en la rodilla izquierda"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) send(e);
          }}
        />
        <button type="submit" className="primary-button" disabled={busy || !input.trim()}>
          Enviar
        </button>
      </form>
      {remaining != null && remaining <= 10 && (
        <p className="hint">Te quedan {remaining} mensajes hoy en este modo.</p>
      )}
    </section>
  );
}
