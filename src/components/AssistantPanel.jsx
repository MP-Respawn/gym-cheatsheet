/*
 * AssistantPanel.jsx: "Armar con asistente", inside the routine builder
 *
 * A chat with the routine assistant (src/store/assistant.js). A switch on
 * top picks the mode: Coach experto (Sonnet 5.5, may suggest exercises we
 * don't have) or Catálogo (Haiku 5.5, only our exercises). Changing it
 * starts a new conversation.
 *
 * The coach can type or dictate (DictateButton.jsx). When the assistant
 * needs to know something, it asks with questions that show one at a time,
 * with quick answers to tap (QuestionsCard); the answers go back together.
 * Its replies are plain text; a stray **bold** shows as bold, never as
 * asterisks.
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
import { Fragment, useState } from "react";
import { getExercise } from "../data/exercises.js";
import { requestExercise } from "../store/admin.js";
import { ASSISTANT_MODES, askAssistant, draftForAssistant, newExercises, saveMode, savedMode } from "../store/assistant.js";
import { errorText } from "../store/trainer.js";
import { canDictate } from "../utils/speech.js";
import DictateButton from "./DictateButton.jsx";

// What a text field suggests, mentioning the keyboard's microphone where
// the browser cannot dictate by itself.
const typeOrDictate = canDictate ? "Escribí o tocá el micrófono" : "Escribí (o dictá con el micrófono del teclado)";

/*
 * The assistant's text as React elements: paragraphs and line breaks as
 * written, **bold** as bold. Never inserted as HTML.
 */
function PlainText({ text }) {
  return text.split(/\n{2,}/).map((paragraph, p) => (
    <p key={p}>
      {paragraph.split("\n").map((line, l) => (
        <Fragment key={l}>
          {l > 0 && <br />}
          {line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
        </Fragment>
      ))}
    </p>
  ));
}

/*
 * The assistant's questions, one at a time: "Pregunta 2 de 4", the quick
 * answers to tap (tapping one moves on), and a field to type or dictate
 * something else. The last one sends all the answers together.
 */
function QuestionsCard({ questions, busy, onSend }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [micError, setMicError] = useState("");
  const q = questions[index];
  const last = index === questions.length - 1;

  const setAnswer = (text) => setAnswers((a) => a.map((v, i) => (i === index ? text : v)));
  function next(answersNow = answers) {
    if (last) onSend(answersNow);
    else setIndex(index + 1);
  }
  function pick(option) {
    const updated = answers.map((v, i) => (i === index ? option : v));
    setAnswers(updated);
    next(updated);
  }

  return (
    <div className="assistant-questions">
      <span className="eyebrow">
        Pregunta {index + 1} de {questions.length}
      </span>
      <p className="assistant-question">{q.question}</p>
      {q.options.length > 0 && (
        <div className="assistant-options">
          {q.options.map((option) => (
            <button
              key={option}
              type="button"
              className={answers[index] === option ? "chip active" : "chip"}
              disabled={busy}
              onClick={() => pick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      <div className="assistant-input">
        <textarea
          className="input"
          rows={2}
          maxLength={1000}
          placeholder={q.options.length > 0 ? `O ${typeOrDictate.toLowerCase()} otra respuesta` : typeOrDictate}
          value={answers[index]}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <DictateButton value={answers[index]} onChange={setAnswer} onError={setMicError} />
      </div>
      {micError && <p className="hint warning">{micError}</p>}
      <div className="template-actions">
        <button type="button" className="secondary-button" disabled={index === 0 || busy} onClick={() => setIndex(index - 1)}>
          Atrás
        </button>
        <button type="button" className="primary-button" disabled={busy} onClick={() => next()}>
          {last ? "Enviar respuestas" : answers[index].trim() ? "Siguiente" : "Saltear"}
        </button>
      </div>
    </div>
  );
}

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
  const [chat, setChat] = useState([]); // what is on screen: { role, text, proposal, questions }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [micError, setMicError] = useState("");
  const [remaining, setRemaining] = useState(null);

  // The questions of the last reply, while they wait for answers.
  const pending = chat.at(-1)?.role === "assistant" ? chat.at(-1).questions : null;

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

  /*
   * One turn: a message, or the answers to the pending questions (shown in
   * the chat as "question: answer" lines). On failure the message goes back
   * to the field, to retry.
   */
  async function ask({ message = "", answers = [] }) {
    const shown = answers.length
      ? pending.map((q, i) => `${q.question} ${answers[i]?.trim() || "(sin respuesta)"}`).join("\n")
      : message;
    setBusy(true);
    setError("");
    setChat((c) => [...c, { role: "user", text: shown }]);
    try {
      const reply = await askAssistant({ mode, history, message, answers, draft: draftForAssistant(draft) });
      setHistory((h) => [...h, ...reply.messages]);
      setChat((c) => [...c, { role: "assistant", text: reply.text, proposal: reply.proposal, questions: reply.questions }]);
      setRemaining(reply.remainingToday);
    } catch (e) {
      setError(e.message);
      if (message) setInput(message);
      setChat((c) => c.slice(0, -1));
    }
    setBusy(false);
  }

  function send(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    ask({ message });
  }

  if (!open) {
    return (
      <button type="button" className="primary-button assistant-open" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          {/* Sparkles: something made with the assistant */}
          <path
            d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
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
            {m.text && <PlainText text={m.text} />}
            {m.proposal && <ProposalCard proposal={m.proposal} onApply={onApply} />}
          </div>
        ))}
        {pending && !busy && <QuestionsCard key={chat.length} questions={pending} busy={busy} onSend={(answers) => ask({ answers })} />}
        {busy && <p className="hint">Pensando...</p>}
      </div>

      {error && <p className="hint warning">{error}</p>}
      {micError && <p className="hint warning">{micError}</p>}
      <form className="assistant-input" onSubmit={send}>
        <textarea
          className="input"
          rows={2}
          maxLength={4000}
          placeholder={
            chat.length === 0
              ? `${typeOrDictate}: "3 días, hipertrofia, intermedio, sin máquinas, molestia en la rodilla"`
              : pending
                ? "O escribile otra cosa"
                : typeOrDictate
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) send(e);
          }}
        />
        <DictateButton value={input} onChange={setInput} onError={setMicError} />
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
