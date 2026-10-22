/*
 * ExerciseList.jsx: home screen (#/, #/?d=yoga)
 *
 * Top: the app's top nav (menu, name, search bar). Then the page title, the
 * discipline tabs (Todo, Gimnasio, Yoga...) and a labelled row of
 * muscle-group chips that filter within that discipline. Below: the
 * exercises, under a heading per muscle group.
 *
 * Some groups and disciplines have fixed sequences (VUELTAS: the trainer's
 * core vueltas, the Animal Flow "Flow básico"). When one applies, a second
 * chip row filters by sequence: picking one lists it in order, numbered,
 * with a link to the whole sequence (it is also a routine). "Otros" are the
 * exercises there that are not part of any of those sequences.
 *
 * The discipline lives in the URL (App.jsx reads it), so Back returns to
 * the previous one; the chips live in App.jsx, so they survive opening an
 * exercise and coming back. Searching happens on its own page (#/buscar).
 */
import { useEffect, useRef } from "react";
import AppHeader from "../components/AppHeader.jsx";
import ExerciseCard from "../components/ExerciseCard.jsx";
import { GroupChips } from "../components/ExerciseFilters.jsx";
import { DISCIPLINES, EXERCISES, GROUPS, VUELTAS, getExercise, getVuelta } from "../data/exercises.js";
import { vueltaPlace, vueltaRoutine } from "../data/routines.js";
import { exerciseSections } from "../utils/search.js";

// Disciplines that have exercises (a new one appears once it has content),
// each with how many it has: the count is shown in its tab.
const DISCIPLINE_OPTIONS = [{ key: "todo", label: "Todo" }, ...DISCIPLINES]
  .map((d) => ({
    ...d,
    count: EXERCISES.filter((ex) => d.key === "todo" || ex.discipline === d.key).length,
  }))
  .filter((d) => d.count > 0);

// Discipline tabs: one discipline at a time, drawn as tabs on a rule (they
// are the sections of the catalogue, not a filter). On a phone the row
// scrolls sideways, so the chosen tab is scrolled into view.
function DisciplineTabs({ discipline, onDisciplineChange }) {
  const bar = useRef(null);
  useEffect(() => {
    const el = bar.current;
    const active = el?.querySelector(".disc-tab.active");
    if (!el || !active) return;
    const left = active.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + active.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollLeft = left - (el.clientWidth - active.offsetWidth) / 2;
    }
  }, [discipline]);

  return (
    <div ref={bar} className="disc-tabs" role="tablist" aria-label="Disciplina">
      {DISCIPLINE_OPTIONS.map((d) => (
        <button
          key={d.key}
          type="button"
          role="tab"
          className={d.key === discipline ? "disc-tab active" : "disc-tab"}
          aria-selected={d.key === discipline}
          onClick={() => onDisciplineChange(d.key)}
        >
          {d.label}
          <span className="disc-count" aria-label={`${d.count} ejercicios`}>
            {d.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// The sequences that apply to what is on screen: those of the chosen
// discipline, plus the gym ones of the chosen group (core vueltas).
function sequencesFor(discipline, group) {
  return VUELTAS.filter(
    (v) =>
      (v.discipline !== undefined && v.discipline === discipline) ||
      (v.group !== undefined && v.group === group && (discipline === "todo" || discipline === "gym")),
  );
}

// The sequence chip row.
function SequenceChips({ sequences, vuelta, onVueltaChange }) {
  const chips = [
    { key: "todas", label: "Todas" },
    ...sequences.map((v) => ({ key: v.key, label: v.chip })),
    { key: "otros", label: "Otros" },
  ];
  return (
    <div className="filter-row sub">
      <span className="filter-label" id="filter-secuencia">
        Secuencia
      </span>
      <div className="chips" role="group" aria-labelledby="filter-secuencia">
        {chips.map((chip) => (
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
    </div>
  );
}

// One sequence, in order: each exercise once, numbered with its step(s)
// ("2 y 3" when it is done with each arm).
function SequenceSection({ vueltaKey }) {
  const info = getVuelta(vueltaKey);
  const routine = vueltaRoutine(vueltaKey);
  const ids = [...new Set(routine.steps.flatMap((step) => step.exerciseIds))];
  return (
    <section className="list-section">
      <div className="section-head">
        <h2 className="section-title">{info.label}</h2>
        <a className="text-button" href={`#/rutina/${routine.id}`}>
          Ver rutina
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

export default function ExerciseList({
  discipline,
  onDisciplineChange,
  group,
  onGroupChange,
  vuelta,
  onVueltaChange,
  onMenuClick,
}) {
  // Exercises of the chosen discipline, and the groups that have any of them.
  const inDiscipline = EXERCISES.filter((ex) => discipline === "todo" || ex.discipline === discipline);
  const groups = GROUPS.filter((g) => inDiscipline.some((ex) => ex.group === g.key));
  // A group chip from another discipline that has nothing here counts as "Todos".
  const activeGroup = groups.some((g) => g.key === group) ? group : "todos";

  const sequences = sequencesFor(discipline, activeGroup);
  const activeVuelta = vuelta === "otros" || sequences.some((v) => v.key === vuelta) ? vuelta : "todas";
  const sequenceChosen = sequences.some((v) => v.key === activeVuelta);

  // "Otros" keeps only the exercises that are not part of these sequences.
  let sections = exerciseSections("", activeGroup, discipline);
  if (sequences.length > 0 && activeVuelta === "otros") {
    const keys = new Set(sequences.map((v) => v.key));
    sections = sections
      .map((s) => ({ ...s, items: s.items.filter((ex) => !keys.has(ex.vuelta)) }))
      .filter((s) => s.items.length > 0);
  }

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      <div className="page-head">
        <h1 className="page-title">Ejercicios</h1>
        <span className="page-count">{inDiscipline.length} ejercicios</span>
      </div>
      <DisciplineTabs discipline={discipline} onDisciplineChange={onDisciplineChange} />
      <GroupChips group={activeGroup} onGroupChange={onGroupChange} groups={groups} label="Grupo" />
      {sequences.length > 0 && (
        <SequenceChips sequences={sequences} vuelta={activeVuelta} onVueltaChange={onVueltaChange} />
      )}

      {/* The list itself */}
      <div className="content">
        {sequenceChosen ? (
          <SequenceSection vueltaKey={activeVuelta} />
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
