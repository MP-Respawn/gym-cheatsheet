/*
 * TabBar.jsx
 *
 * The bar fixed to the bottom of the screen with the sections of the app:
 * Ejercicios and Rutinas, plus Clientes for trainers (the
 * same links as the menus, from navLinks.js). The active tab is
 * highlighted. `active` is a tab key ("exercises", "routines"...) and
 * comes from App.jsx, like `exercisesHref` (the home list with the last
 * discipline you picked).
 */
import { useIsTrainer } from "../store/useStore.js";
import { linksFor } from "./navLinks.js";

export default function TabBar({ active, exercisesHref = "#/" }) {
  const tabs = linksFor(useIsTrainer());
  return (
    <nav className="tab-bar" aria-label="Secciones">
      {tabs.map((tab) => (
        <a
          key={tab.tab}
          href={tab.tab === "exercises" ? exercisesHref : tab.href}
          className={tab.tab === active ? "tab active" : "tab"}
          aria-current={tab.tab === active ? "page" : undefined}
        >
          <span className="tab-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d={tab.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
