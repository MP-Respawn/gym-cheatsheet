/*
 * Invitation.jsx: a trainer's link (#/invitacion/<token>)
 *
 * The trainer sends this link (by WhatsApp, say), or you send a coach's
 * (?rol=entrenador, only changes the wording). Opening it:
 *   - signed out: the sign-in screen in invitation mode: a new email signs
 *     in right away, no code (an email with an account gets a code)
 *   - signed in (right after that, or already before): accepts the
 *     invitation, which links this account to the trainer, and opens
 *     Rutinas. If the link was used, revoked or expired, says so.
 */
import { useEffect, useRef, useState } from "react";
import { Brand } from "../components/AppHeader.jsx";
import { acceptInvitation } from "../store/auth.js";
import { useAuth } from "../store/useStore.js";
import SignIn from "./SignIn.jsx";

export default function Invitation({ token, coach = false }) {
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
        invitationToken={token}
        title={coach ? "Te sumaron como coach" : "Te invitaron a entrenar"}
        intro={
          coach
            ? "Armá rutinas y asignáselas a tus clientes en Respawn Fitness. Entrá con tu email para empezar."
            : "Tu entrenador te armó las rutinas en Respawn Fitness. Entrá con tu email para verlas."
        }
      />
    );
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <Brand seal />
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
