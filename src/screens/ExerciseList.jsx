/*
 * ExerciseList.jsx: home screen (#/, #/?d=yoga)
 *
 * Top: the app's top nav (menu, name, search bar). Then the page title,
 * which follows the chosen tab ("Ejercicios de yoga", with how many), the
 * discipline tabs (Todo, Gimnasio, Yoga...) and a labelled row of
 * muscle-group chips that filter within that discipline. Below: the
 * exercises, under a heading per muscle group. (The fixed sequences, like
 * the core vueltas or Flow básico, are routines: they live in Rutinas.)
 *
 * The discipline lives in the URL (App.jsx reads it), so Back returns to
 * the previous one; the group chip lives in App.jsx, so it survives opening
 * an exercise and coming back. Searching happens on its own page (#/buscar).
 */
import { useEffect, useRef } from "react";
import AppHeader from "../components/AppHeader.jsx";
import ExerciseCard from "../components/ExerciseCard.jsx";
import { GroupChips } from "../components/ExerciseFilters.jsx";
import { DISCIPLINES, EXERCISES, GROUPS } from "../data/exercises.js";
import { exerciseSections } from "../utils/search.js";

// Disciplines that have exercises (a new one appears once it has content),
// each with how many it has: the count is shown in its tab.
const DISCIPLINE_OPTIONS = [{ key: "todo", label: "Todo", title: "Todos los ejercicios" }, ...DISCIPLINES]
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

export default function ExerciseList({ discipline, onDisciplineChange, group, onGroupChange, onMenuClick }) {
  // Exercises of the chosen discipline, and the groups that have any of them.
  const inDiscipline = EXERCISES.filter((ex) => discipline === "todo" || ex.discipline === discipline);
  const groups = GROUPS.filter((g) => inDiscipline.some((ex) => ex.group === g.key));
  // A group chip from another discipline that has nothing here counts as "Todos".
  const activeGroup = groups.some((g) => g.key === group) ? group : "todos";
  const sections = exerciseSections("", activeGroup, discipline);

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      {/* "Ejercicios de yoga" and how many, following the chosen tab */}
      <div className="page-head">
        <h1 className="page-title exercises-title">
          {DISCIPLINE_OPTIONS.find((d) => d.key === discipline)?.title ?? "Ejercicios"}
          <span className="title-count" aria-label={`${inDiscipline.length} ejercicios`}>
            {inDiscipline.length}
          </span>
        </h1>
      </div>
      <DisciplineTabs discipline={discipline} onDisciplineChange={onDisciplineChange} />
      <GroupChips group={activeGroup} onGroupChange={onGroupChange} groups={groups} label="Grupo" />

      {/* The list itself */}
      <div className="content">
        {sections.map((section) => (
          <section key={section.key} className="list-section">
            <h2 className="section-title">{section.label}</h2>
            <div className="card-list">
              {section.items.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
