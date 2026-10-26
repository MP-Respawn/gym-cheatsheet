/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * Top: the app's top nav (menu, name, search bar). Then "Mis rutinas", the
 * ones you built (saved on this device), with a button to create a new one.
 * Below: the app's routines, under a header per discipline (Gimnasio,
 * Yoga...): first the routines with days (Bloque A, Bloque B), then the
 * one-day ones under their block ("Vueltas de abdomen").
 *
 * Every routine is one card. With several days it opens the routine page
 * (one lane per day); with one day it opens that day directly.
 * The backup tools ("Tus datos") live in the side menu (MenuDrawer).
 */
import AppHeader from "../components/AppHeader.jsx";
import { DISCIPLINES } from "../data/exercises.js";
import { PROGRAMS, ROUTINES, getTrainerProgram, stepExerciseIds } from "../data/routines.js";
import { routineHref, useMyRoutines } from "../store/useStore.js";

// Right-pointing chevron, hints that the card opens.
function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// "3 días · 14 ejercicios" for a routine with days, "6 pasos" for one day.
function summary(days) {
  if (days.length === 1) {
    const n = days[0].steps.length;
    return `${n} ${n === 1 ? "paso" : "pasos"}`;
  }
  const exercises = new Set(days.flatMap((d) => d.steps.flatMap(stepExerciseIds))).size;
  return `${days.length} días · ${exercises} ${exercises === 1 ? "ejercicio" : "ejercicios"}`;
}

// One routine: `days` are its day routines, in order.
function RoutineCard({ name, focus, days }) {
  return (
    <a className="card routine-card" href={routineHref(days)}>
      <div className="card-text">
        <span className="card-title">{name}</span>
        {focus && <span className="card-meta">{focus}</span>}
        <span className="card-desc">{summary(days)}</span>
      </div>
      <Chevron />
    </a>
  );
}

export default function RoutineList({ onMenuClick }) {
  const mine = useMyRoutines();

  // Your routines, one per programId (its days in order), most recently
  // edited first. Old routines saved without days count as one day.
  const myRoutines = [];
  for (const routine of mine) {
    const key = routine.programId ?? routine.id;
    if (myRoutines.some((g) => g.key === key)) continue;
    const days = routine.programId
      ? mine.filter((r) => r.programId === key).sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0))
      : [routine];
    const focus = days.length === 1 ? days[0].focus : days.map((d) => d.focus).filter(Boolean).join(", ");
    myRoutines.push({ key, name: routine.block ?? routine.name, focus, days });
  }

  // The app's routines per discipline: its routines with days, then the
  // one-day ones grouped by block. A block named like its discipline
  // ("Yoga") gets no sub-header of its own.
  const disciplines = DISCIPLINES.map((d) => {
    const programs = PROGRAMS.map((p) => getTrainerProgram(p.id)).filter((p) => p.discipline === d.key);
    const singles = ROUTINES.filter((r) => r.discipline === d.key && !r.programId);
    const blocks = [...new Set(singles.map((r) => r.block ?? ""))];
    return {
      ...d,
      programs,
      blocks: blocks.map((name) => ({ name, routines: singles.filter((r) => (r.block ?? "") === name) })),
    };
  }).filter((d) => d.programs.length > 0 || d.blocks.length > 0);

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
            {myRoutines.map((r) => (
              <RoutineCard key={r.key} name={r.name} focus={r.focus} days={r.days} />
            ))}
            <a className="add-button" href="#/rutina/nueva">
              + Nueva rutina
            </a>
          </div>
        </section>

        {/* The app's routines, by discipline */}
        {disciplines.map((d) => (
          <section key={d.key} className="discipline-section">
            <h2 className="discipline-title">{d.label}</h2>
            {d.programs.length > 0 && (
              <div className="list-section">
                <div className="card-list">
                  {d.programs.map((p) => (
                    <RoutineCard key={p.id} name={p.name} focus={p.focus} days={p.days} />
                  ))}
                </div>
              </div>
            )}
            {d.blocks.map((block) => (
              <div key={block.name} className="list-section">
                {block.name && block.name !== d.label && <h3 className="section-title">{block.name}</h3>}
                <div className="card-list">
                  {block.routines.map((routine) => (
                    <RoutineCard key={routine.id} name={routine.name} focus={routine.focus} days={[routine]} />
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
