/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * Top: the app's top nav (menu, name, search bar). Then "Mis rutinas", the
 * ones you built (saved on this device), with a button to create a new one.
 * A routine divided into days shows its name with one card per day.
 * Below: the app's routines, under a header per discipline (Gimnasio,
 * Yoga...) and, inside it, per block ("Bloque A", "Vueltas de abdomen").
 * The backup tools ("Tus datos") live in the side menu (MenuDrawer).
 */
import AppHeader from "../components/AppHeader.jsx";
import { DISCIPLINES } from "../data/exercises.js";
import { ROUTINES } from "../data/routines.js";
import { useMyRoutines } from "../store/useStore.js";

// Right-pointing chevron, hints that the card opens.
function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoutineCard({ routine }) {
  return (
    <a className="card routine-card" href={`#/rutina/${routine.id}`}>
      <div className="card-text">
        <span className="card-title">{routine.name}</span>
        {routine.focus && <span className="card-meta">{routine.focus}</span>}
        <span className="card-desc">
          {routine.steps.length} {routine.steps.length === 1 ? "paso" : "pasos"}
        </span>
      </div>
      <Chevron />
    </a>
  );
}

export default function RoutineList({ onMenuClick }) {
  const mine = useMyRoutines();

  // Your routines, with the days of a divided one kept together (in day
  // order) where its most recently edited day would be.
  const myGroups = [];
  for (const routine of mine) {
    const key = routine.programId ?? routine.id;
    if (myGroups.some((g) => g.key === key)) continue;
    const days = routine.programId
      ? mine.filter((r) => r.programId === key).sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0))
      : [routine];
    myGroups.push({ key, name: routine.block ?? routine.name, days });
  }

  // Disciplines that have routines, each with its blocks in first-appearance
  // order ("Bloque A", "Bloque B", "Vueltas de abdomen"). A block named like
  // its discipline gets no sub-header of its own.
  const disciplines = DISCIPLINES.map((d) => {
    const routines = ROUTINES.filter((r) => r.discipline === d.key);
    const blocks = [...new Set(routines.map((r) => r.block ?? ""))];
    return { ...d, blocks: blocks.map((name) => ({ name, routines: routines.filter((r) => (r.block ?? "") === name) })) };
  }).filter((d) => d.blocks.length > 0);

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
            {myGroups.map((group) =>
              group.days.length === 1 ? (
                <RoutineCard key={group.key} routine={group.days[0]} />
              ) : (
                // A routine divided into days: its name, then one card per day
                <div key={group.key} className="my-program">
                  <h3 className="my-program-title">{group.name}</h3>
                  <div className="card-list">
                    {group.days.map((day) => (
                      <RoutineCard key={day.id} routine={day} />
                    ))}
                  </div>
                </div>
              ),
            )}
            <a className="add-button" href="#/rutina/nueva">
              + Nueva rutina
            </a>
          </div>
        </section>

        {/* The app's routines, by discipline and block */}
        {disciplines.map((d) => (
          <section key={d.key} className="discipline-section">
            <h2 className="discipline-title">{d.label}</h2>
            {d.blocks.map((block) => (
              <div key={block.name} className="list-section">
                {block.name && block.name !== d.label && <h3 className="section-title">{block.name}</h3>}
                <div className="card-list">
                  {block.routines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
