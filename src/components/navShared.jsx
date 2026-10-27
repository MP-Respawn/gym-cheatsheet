/*
 * navShared.jsx
 *
 * Pieces shared by the two navigations: the phone side menu (MenuDrawer)
 * and the desktop side nav (SideNav). Both show the same links, the Modo
 * gym switch and your account, just laid out differently.
 *
 *   Icon             a line icon drawn from one SVG path (RPWN style: 1.8 stroke)
 *   GymSwitch        the Modo gym on/off switch
 *   ThemeSwitch      Oscuro · Claro · INCA (theme.js)
 *   AccountControls  who is signed in, "Instalar la app" (when the browser
 *                    offers it) + "Cerrar sesión"
 *   SyncNote         where your data lives, and what is still waiting to upload
 */
import { signOut } from "../store/auth.js";
import { install } from "../store/install.js";
import { THEMES, setTheme } from "../store/theme.js";
import { useAuth, useInstall, useIsPersistent, usePendingCount, useRemoteStatus, useTheme } from "../store/useStore.js";

export function Icon({ d, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/*
 * The Modo gym switch. `className` is the row style of whichever nav holds
 * it ("drawer-link drawer-switch" or "sidenav-link sidenav-switch").
 * `hint` adds the small explanation under the label (phone menu only).
 */
export function GymSwitch({ on, onChange, className, hint = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={on ? `${className} on` : className}
      onClick={() => onChange(!on)}
    >
      <Icon d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
      <span className={hint ? "drawer-switch-text" : "sidenav-switch-text"}>
        Modo gym
        {hint && <span className="drawer-switch-hint">Letras grandes, solo lo esencial</span>}
      </span>
      <span className="gym-toggle-track" aria-hidden="true">
        <span className="gym-toggle-thumb" />
      </span>
    </button>
  );
}

// The three themes side by side; the chosen one is highlighted. Saved on this phone.
export function ThemeSwitch() {
  const theme = useTheme();
  return (
    <div className="theme-switch" role="radiogroup" aria-label="Tema">
      {THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          role="radio"
          aria-checked={t.key === theme}
          className={t.key === theme ? "theme-option active" : "theme-option"}
          onClick={() => setTheme(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/*
 * The signed-in email and the sign-out button. `linkClass` styles the button
 * like a nav row; `noteClass` styles the email line.
 */
export function AccountControls({ linkClass, noteClass }) {
  const { user } = useAuth();
  const installable = useInstall() === "prompt";
  return (
    <>
      <p className={noteClass}>{user?.email}</p>
      {installable && (
        <button type="button" className={linkClass} onClick={() => install()}>
          {/* A phone with an arrow coming down into it */}
          <Icon d="M7 3h10v18H7zM12 7v7M9 11l3 3 3-3M11 18h2" />
          Instalar la app
        </button>
      )}
      <button type="button" className={linkClass} onClick={() => signOut()}>
        <Icon d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />
        Cerrar sesión
      </button>
    </>
  );
}

/*
 * The note at the bottom of both navs: workouts still waiting to upload (no
 * signal), or where your data lives; a warning when the browser refuses to
 * save (private window).
 */
export function SyncNote() {
  const persistent = useIsPersistent();
  const pending = usePendingCount();
  const { offline, uploadError } = useRemoteStatus();
  if (!persistent) {
    return (
      <p className="warning">
        Este navegador no permite guardar datos (¿ventana privada?): un entrenamiento sin subir se pierde al cerrar.
      </p>
    );
  }
  if (pending > 0) {
    return (
      <p className="warning">
        {pending === 1 ? "1 entrenamiento espera" : `${pending} entrenamientos esperan`} para subirse
        {offline ? ": se suben solos cuando vuelva la señal." : "."}
        {uploadError && !offline && ` No se pudo subir: ${uploadError}`}
      </p>
    );
  }
  return <p>Tus rutinas y tu historial están en tu cuenta. Se guardan en el teléfono para cuando no hay señal.</p>;
}
