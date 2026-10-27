/*
 * InviteLink.jsx
 *
 * An invitation link, ready to send: the link itself, "Copiar" (to paste
 * anywhere) and "Mandar por WhatsApp" (opens WhatsApp with a ready-made
 * message; you pick the chat). `name` is the client's, for the message.
 * A coach's invitation passes its own `message` (the link is added at the
 * end) and `hint`.
 */
import { useState } from "react";

const CLIENT_HINT = "Sirve una sola vez y vence en 7 días. Si se pierde, generá uno nuevo desde la ficha del cliente.";

export default function InviteLink({ link, name, message: intro, hint = CLIENT_HINT }) {
  const [copied, setCopied] = useState(false);
  const message = `${intro ?? `Hola${name ? ` ${name}` : ""}! Te armé las rutinas en Respawn Fitness. Entrá desde este link con tu email:`} ${link}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is selectable in the box anyway.
    }
  }

  return (
    <div className="invite-box">
      <input className="input invite-input" readOnly value={link} aria-label="Link de invitación" onFocus={(e) => e.target.select()} />
      <div className="invite-actions">
        <button type="button" className="secondary-button" onClick={copy}>
          {copied ? "Copiado" : "Copiar"}
        </button>
        <a className="primary-button" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
          Mandar por WhatsApp
        </a>
      </div>
      <p className="hint">{hint}</p>
    </div>
  );
}
