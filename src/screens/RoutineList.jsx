/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * Top: the app's top nav (menu, name, search bar). For a coach, their own
 * routines come first (TrainerRoutines.jsx: edit, duplicate, assign). Then
 * "Tus rutinas", the ones your trainer assigned you (downloaded from the
 * database, kept on the phone for when there is no signal; a coach only sees
 * this section if someone assigned them one). Below: "Recomendadas por
 * INCA", the routines that live in the code (INCA's core vueltas, in
 * routines.js), grouped by block, for everyone.
 *
 * Every routine is one card. With several days it opens the routine page
 * (one lane per day); with one day it opens that day directly.
 */
import AppHeader from "../components/AppHeader.jsx";
import InstallHint from "../components/InstallHint.jsx";
import TrainerRoutines from "../components/TrainerRoutines.jsx";
import { stepExerciseIds } from "../data/routines.js";
import {
  CATALOG_ROUTINES,
  routineHref,
  useAssignedPrograms,
  useAssignedState,
  useIsTrainer,
  useRemoteStatus,
} from "../store/useStore.js";

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

// The recommended routines (the ones in the code), grouped by block
// ("Vueltas de abdomen"), in the order they are written.
const RECOMMENDED = [...new Set(CATALOG_ROUTINES.map((r) => r.block ?? ""))].map((name) => ({
  name,
  routines: CATALOG_ROUTINES.filter((r) => (r.block ?? "") === name),
}));

export default function RoutineList({ onMenuClick }) {
  const programs = useAssignedPrograms();
  const { downloaded } = useAssignedState();
  const { loading, offline } = useRemoteStatus();
  const isTrainer = useIsTrainer();

  // What to say when there are no routines: still downloading, no signal on
  // the very first time, or the trainer has not assigned anything yet.
  let emptyText = "Todavía no tenés rutinas asignadas. Cuando tu entrenador te asigne una, aparece acá.";
  if (!downloaded && loading) emptyText = "Cargando tus rutinas...";
  else if (!downloaded && offline) emptyText = "Sin conexión. Tus rutinas aparecen cuando vuelva la señal.";

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      <div className="page-head">
        <h1 className="page-title">Rutinas</h1>
      </div>

      <div className="content">
        {/* "Add it to your home screen", until it is installed */}
        <InstallHint />

        {/* A coach's own routines, to edit and assign */}
        {isTrainer && <TrainerRoutines />}

        {/* Assigned by your trainer (a coach only sees this if they have some) */}
        {(!isTrainer || programs.length > 0) && (
          <section className="list-section">
            <h2 className="section-title">{isTrainer ? "Asignadas a vos" : "Tus rutinas"}</h2>
            {programs.length > 0 ? (
              <div className="card-list">
                {programs.map((p) => (
                  <RoutineCard key={`${p.clientId}:${p.id}`} name={p.name} focus={p.focus} days={p.days} />
                ))}
              </div>
            ) : (
              <p className="empty list-empty">{emptyText}</p>
            )}
          </section>
        )}

        {/* INCA's recommendations, for everyone */}
        <section className="discipline-section">
          <h2 className="discipline-title">Recomendadas por INCA</h2>
          {RECOMMENDED.map((block) => (
            <div key={block.name} className="list-section">
              {block.name && <h3 className="section-title">{block.name}</h3>}
              <div className="card-list">
                {block.routines.map((routine) => (
                  <RoutineCard key={routine.id} name={routine.name} focus={routine.focus} days={[routine]} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
