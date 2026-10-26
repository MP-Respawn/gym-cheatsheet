/*
 * Invitation.jsx: a trainer's link (#/invitacion/<token>)
 *
 * The trainer sends this link (by WhatsApp, say). Opening it:
 *   - signed out: the sign-in screen, allowed to create the account
 *   - signed in (right after that, or already before): accepts the
 *     invitation, which links this account to the trainer, and opens
 *     Rutinas. If the link was used, revoked or expired, says so.
 */
import { useEffect, useRef, useState } from "react";
import { Brand } from "../components/AppHeader.jsx";
import { acceptInvitation } from "../store/auth.js";
import { useAuth } from "../store/useStore.js";
import SignIn from "./SignIn.jsx";

export default function Invitation({ token }) {
  const auth = useAuth();
  const [error, setError] = useState("");
  const started = useRef(false);

  // Accept once, as soon as someone is signed in.
  useEffect(() => {
    if (auth.status !== "signed-in" || started.current) return;
    started.current = true;
    acceptInvitation(token).then((problem) => {
      if (problem) setError(problem);
      else window.location.replace("#/rutinas");
    });
  }, [auth.status, token]);

  if (auth.status === "signed-out") {
    return (
      <SignIn
        newAccount
        title="Te invitaron a entrenar"
        intro="Tu entrenador te armó las rutinas en Respawn Fitness. Entrá con tu email para verlas."
      />
    );
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <Brand />
        {error ? (
          <>
            <h1 className="page-title auth-title">No pudimos usar el link</h1>
            <p className="auth-intro">{error}</p>
            <a className="primary-button auth-submit" href="#/rutinas">
              Ir a la app
            </a>
          </>
        ) : (
          <p className="auth-intro" role="status">
            Aceptando la invitación...
          </p>
        )}
      </div>
    </div>
  );
}
