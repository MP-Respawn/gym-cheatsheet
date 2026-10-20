/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * The five saved routines, grouped under "Bloque A" and "Bloque B" in the
 * order they appear in routines.js. Each card opens the routine.
 */
import { ROUTINES } from "../data/routines.js";

export default function RoutineList() {
  // Unique block names, keeping their first-appearance order ("Bloque A", "Bloque B").
  const blocks = [...new Set(ROUTINES.map((r) => r.block))];

  return (
    <div className="screen">
      <div className="top-bar">
        <h1 className="top-title">Rutinas</h1>
      </div>

      <div className="content">
        {blocks.map((block) => (
          <section key={block} className="list-section">
            <h2 className="section-title">{block}</h2>
            <div className="card-list">
              {ROUTINES.filter((r) => r.block === block).map((routine) => (
                <a key={routine.id} className="card routine-card" href={`#/rutina/${routine.id}`}>
                  <div className="card-text">
                    <span className="card-title">{routine.name}</span>
                    <span className="card-meta">{routine.focus}</span>
                    <span className="card-desc">{routine.steps.length} pasos</span>
                  </div>
                  {/* Right-pointing chevron, hints that the card opens */}
                  <svg className="chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
