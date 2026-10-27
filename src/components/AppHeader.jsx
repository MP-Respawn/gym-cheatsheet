/*
 * AppHeader.jsx
 *
 * The top nav on the two main screens (Ejercicios and Rutinas): the
 * hamburger button that opens the menu, the Respawn Fitness name, and the
 * search bar underneath. The search bar is a link: tapping it opens the
 * search page (#/buscar), which looks through exercises and routines.
 *
 * `onMenuClick` comes from App.jsx, which owns the menu.
 */
import { useTheme } from "../store/useStore.js";

/*
 * The wordmark, built from text only (the RPWN Studio logo rules): a teal
 * "> " prompt, "Respawn" in bold Space Grotesk, and "fitness" small, spaced
 * and teal. Never an image, so it stays crisp at any size.
 * In the INCA theme: the isotipo (the crown in its circle), "INCA" in
 * Archivo expanded black and "MMA" small, spaced and gold. With `seal`
 * (the sign-in screens, where there is room) it is INCA's whole seal
 * instead, above the manual's 96px minimum. Both images are cut from INCA's
 * brand manual v1.0 (public/brand/); swap them when there is an SVG.
 */
export function Brand({ seal = false }) {
  const theme = useTheme();
  if (theme === "inca" && seal) {
    return <img className="brand-seal" src="/brand/inca-sello.png" alt="INCA MMA" width="112" height="120" />;
  }
  if (theme === "inca") {
    return (
      <span className="brand brand-inca">
        <img className="brand-isotipo" src="/brand/inca-isotipo.png" alt="" width="32" height="32" />
        <span className="brand-name">INCA</span>
        <span className="brand-accent">MMA</span>
      </span>
    );
  }
  return (
    <span className="brand">
      <span className="brand-prompt" aria-hidden="true">
        &gt;
      </span>
      <span className="brand-name">Respawn</span>
      <span className="brand-accent">fitness</span>
    </span>
  );
}

export default function AppHeader({ onMenuClick }) {
  return (
    <header className="app-header">
      <div className="app-header-row">
        <button type="button" className="menu-button" aria-label="Abrir menú" aria-haspopup="dialog" onClick={onMenuClick}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <a href="#/" aria-label="Respawn Fitness, inicio">
          <Brand />
        </a>
      </div>
      <a className="search-link" href="#/buscar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Buscar ejercicios y rutinas
      </a>
    </header>
  );
}
