/*
 * TabBar.jsx
 *
 * The bar fixed to the bottom of the screen with the two sections of the
 * app: Ejercicios and Rutinas. The active tab is highlighted. `active` is
 * either "exercises" or "routines" and comes from App.jsx.
 */

// Each tab: where it goes, its label, and a simple line icon.
const TABS = [
  {
    key: "exercises",
    href: "#/",
    label: "Ejercicios",
    // Dumbbell
    icon: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10",
  },
  {
    key: "routines",
    href: "#/rutinas",
    label: "Rutinas",
    // List with bullets
    icon: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  },
];

export default function TabBar({ active }) {
  return (
    <nav className="tab-bar" aria-label="Secciones">
      {TABS.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className={tab.key === active ? "tab active" : "tab"}
          aria-current={tab.key === active ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d={tab.icon} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
