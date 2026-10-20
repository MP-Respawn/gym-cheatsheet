/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * Top: the app's top nav (menu, name, search bar). Then "Mis rutinas", the
 * ones you built (saved on this device), with a button to create a new one.
 * Below: the trainer's routines, grouped under "Bloque A" and "Bloque B".
 * The backup tools ("Tus datos") live in the side menu (MenuDrawer).
 */
import AppHeader from "../components/AppHeader.jsx";
import { ROUTINES } from "../data/routines.js";
import { useMyRoutines } from "../store/useStore.js";

// Right-pointing chevron, hints that the card opens.
function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoutineCard({ routine }) {
  return (
    <a className="card routine-card" href={`#/rutina/${routine.id}`}>
      <div className="card-text">
        <span className="card-title">{routine.name}</span>
        {routine.focus && <span className="card-meta">{routine.focus}</span>}
        <span className="card-desc">{routine.steps.length} pasos</span>
      </div>
      <Chevron />
    </a>
  );
}

export default function RoutineList({ onMenuClick }) {
  const mine = useMyRoutines();

  // Unique block names, keeping their first-appearance order ("Bloque A", "Bloque B").
  const blocks = [...new Set(ROUTINES.map((r) => r.block))];

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      <div className="page-head">
        <h1 className="page-title">Rutinas</h1>
      </div>

      <div className="content">
        {/* Your own routines */}
        <section className="list-section">
          <h2 className="section-title">Mis rutinas</h2>
          <div className="card-list">
            {mine.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
            <a className="add-button" href="#/rutina/nueva">
              + Nueva rutina
            </a>
          </div>
        </section>

        {/* The trainer's routines */}
        {blocks.map((block) => (
          <section key={block} className="list-section">
            <h2 className="section-title">{block}</h2>
            <div className="card-list">
              {ROUTINES.filter((r) => r.block === block).map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
