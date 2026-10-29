/*
 * SignIn.jsx: the sign-in screen (shown for every page while signed out)
 *
 * Two steps, no password:
 *   1. your email -> "Mandame el código" (Supabase emails a one-time code)
 *   2. the code   -> "Entrar"
 * "Usar otro email" goes back to step 1; "Mandar de nuevo" sends another
 * code to the same address.
 *
 * On an invitation link (Invitation.jsx passes `invitationToken`) step 1
 * is just "Entrar": a new email signs in right there, no code (the link is
 * the key; enterWithInvitation in auth.js). Only an email that already has
 * an account goes on to the code, to check it is theirs. On the plain
 * sign-in an unknown email is told to ask their trainer for the link.
 * `title` and `intro` change the heading for the invitation.
 */
import { useState } from "react";
import { Brand } from "../components/AppHeader.jsx";
import { enterWithInvitation, sendCode, verifyCode } from "../store/auth.js";

export default function SignIn({ invitationToken = null, title = "Entrar", intro }) {
  const newAccount = Boolean(invitationToken);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email"); // "email" | "code"
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Invitation, step 1: in directly with a new email, or on to the code.
  async function enterFromInvitation(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const result = await enterWithInvitation(invitationToken, email);
    if (result.signedIn) return; // auth.js switches the app to signed in
    setBusy(false);
    if (result.problem) {
      setError(result.problem);
      return;
    }
    setNotice("Ya tenés cuenta con ese email: te mandamos un código para confirmar que sos vos.");
    setStep("code");
  }

  async function requestCode(event) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const problem = await sendCode(email, { newAccount });
    setBusy(false);
    if (problem) {
      setError(problem);
      return;
    }
    if (step === "code") setNotice("Te mandamos un código nuevo.");
    setStep("code");
  }

  async function submitCode(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const problem = await verifyCode(email, code);
    // On success auth.js switches the whole app to signed in; nothing else to do.
    if (problem) {
      setBusy(false);
      setError(problem);
    }
  }

  function changeEmail() {
    setStep("email");
    setCode("");
    setError("");
    setNotice("");
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <Brand seal />
        <h1 className="page-title auth-title">{title}</h1>
        {intro && <p className="auth-intro">{intro}</p>}

        {step === "email" ? (
          <form onSubmit={invitationToken ? enterFromInvitation : requestCode} noValidate>
            <label className="field">
              <span className="field-label">Tu email</span>
              <input
                className="input"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <p className="hint">
              {invitationToken
                ? "Revisá que esté bien escrito: es el email con el que vas a entrar la próxima vez."
                : "Te mandamos un código por email. No hace falta contraseña."}
            </p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="primary-button auth-submit" disabled={busy || !email.includes("@")}>
              {invitationToken ? (busy ? "Entrando..." : "Entrar") : busy ? "Mandando..." : "Mandame el código"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} noValidate>
            <p className="auth-intro">
              Mandamos un código a <strong>{email.trim()}</strong>. Buscalo en tu email (fijate también en spam).
            </p>
            <label className="field">
              <span className="field-label">Código</span>
              <input
                className="input auth-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            {notice && (
              <p className="hint" role="status">
                {notice}
              </p>
            )}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="primary-button auth-submit" disabled={busy || code.length < 6}>
              {busy ? "Entrando..." : "Entrar"}
            </button>
            <div className="auth-links">
              <button type="button" className="text-button" onClick={requestCode} disabled={busy}>
                Mandar de nuevo
              </button>
              <button type="button" className="text-button" onClick={changeEmail} disabled={busy}>
                Usar otro email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
