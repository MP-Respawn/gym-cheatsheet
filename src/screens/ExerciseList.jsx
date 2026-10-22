/*
 * ExerciseList.jsx: home screen (#/)
 *
 * Top: the app's top nav (menu, name, search bar). Then the page title and a
 * sideways-scrolling row of muscle-group chips. Below: the exercises of the
 * chosen group, under a heading per muscle group.
 *
 * With "Abdomen y core" chosen, a second chip row filters by the trainer's
 * vueltas: picking one lists that vuelta's exercises in order, numbered,
 * with a link to the whole vuelta (it is also a routine). "Otros" are the
 * core exercises that are not part of any vuelta.
 *
 * Searching happens on its own page (#/buscar), opened from the search bar.
 * The chosen chips live in App.jsx (passed in as props), so they are still
 * there when you come back from an exercise detail.
 */
import AppHeader from "../components/AppHeader.jsx";
import ExerciseCard from "../components/ExerciseCard.jsx";
import { GroupChips } from "../components/ExerciseFilters.jsx";
import { EXERCISES, VUELTAS, getExercise, getVuelta } from "../data/exercises.js";
import { vueltaPlace, vueltaRoutine } from "../data/routines.js";
import { exerciseSections } from "../utils/search.js";

const VUELTA_CHIPS = [
  { key: "todas", label: "Todas" },
  ...VUELTAS.map((v) => ({ key: v.key, label: v.chip })),
  { key: "otros", label: "Otros" },
];

// The vuelta chip row (only shown inside "Abdomen y core").
function VueltaChips({ vuelta, onVueltaChange }) {
  return (
    <div className="chips chips-sub" role="group" aria-label="Vuelta de abdomen">
      {VUELTA_CHIPS.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className={chip.key === vuelta ? "chip active" : "chip"}
          aria-pressed={chip.key === vuelta}
          onClick={() => onVueltaChange(chip.key)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

// One vuelta, in the trainer's order: each exercise once, numbered with its
// step(s) ("2 y 3" when it is done with each arm).
function VueltaSection({ vueltaKey }) {
  const info = getVuelta(vueltaKey);
  const routine = vueltaRoutine(vueltaKey);
  const ids = [...new Set(routine.steps.flatMap((step) => step.exerciseIds))];
  return (
    <section className="list-section">
      <div className="section-head">
        <h2 className="section-title">{info.label}</h2>
        <a className="text-button" href={`#/rutina/${routine.id}`}>
          Ver vuelta completa
        </a>
      </div>
      <div className="card-list">
        {ids.map((id) => {
          const ex = getExercise(id);
          return <ExerciseCard key={id} exercise={ex} number={vueltaPlace(ex).positions.join(" y ")} />;
        })}
      </div>
    </section>
  );
}

export default function ExerciseList({ group, onGroupChange, vuelta, onVueltaChange, onMenuClick }) {
  const inCore = group === "core";
  const vueltaChosen = inCore && VUELTAS.some((v) => v.key === vuelta);

  // "Otros" keeps only the core exercises that are not part of a vuelta.
  let sections = exerciseSections("", group);
  if (inCore && vuelta === "otros") {
    sections = sections.map((s) => ({ ...s, items: s.items.filter((ex) => !ex.vuelta) }));
  }

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      <div className="page-head">
        <h1 className="page-title">Ejercicios</h1>
        <span className="page-count">{EXERCISES.length} ejercicios</span>
      </div>
      <GroupChips group={group} onGroupChange={onGroupChange} />
      {inCore && <VueltaChips vuelta={vuelta} onVueltaChange={onVueltaChange} />}

      {/* The list itself */}
      <div className="content">
        {vueltaChosen ? (
          <VueltaSection vueltaKey={vuelta} />
        ) : (
          sections.map((section) => (
            <section key={section.key} className="list-section">
              <h2 className="section-title">{section.label}</h2>
              <div className="card-list">
                {section.items.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
