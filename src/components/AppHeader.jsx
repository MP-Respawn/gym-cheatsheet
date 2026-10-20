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

// The logo: a circular "respawn" arrow on a yellow square.
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// "RESPAWN FITNESS" next to the logo.
export function Brand() {
  return (
    <span className="brand">
      <BrandMark />
      <span className="brand-name">
        Respawn <span className="brand-accent">Fitness</span>
      </span>
    </span>
  );
}

export default function AppHeader({ onMenuClick }) {
  return (
    <header className="app-header">
      <div className="app-header-row">
        <button type="button" className="menu-button" aria-label="Abrir menú" aria-haspopup="dialog" onClick={onMenuClick}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <a href="#/" aria-label="Respawn Fitness, inicio">
          <Brand />
        </a>
      </div>
      <a className="search-link" href="#/buscar">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        Buscar ejercicios y rutinas
      </a>
    </header>
  );
}
