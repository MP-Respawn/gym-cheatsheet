/*
 * ExerciseList.jsx: home screen (#/)
 *
 * Top: the app's top nav (menu, name, search bar). Then the page title and a
 * sideways-scrolling row of muscle-group chips. Below: the exercises of the
 * chosen group, under a heading per muscle group.
 *
 * Searching happens on its own page (#/buscar), opened from the search bar.
 * The chosen chip lives in App.jsx (passed in as props), so it is still
 * there when you come back from an exercise detail.
 */
import AppHeader from "../components/AppHeader.jsx";
import ExerciseCard from "../components/ExerciseCard.jsx";
import { GroupChips } from "../components/ExerciseFilters.jsx";
import { EXERCISES } from "../data/exercises.js";
import { exerciseSections } from "../utils/search.js";

export default function ExerciseList({ group, onGroupChange, onMenuClick }) {
  const sections = exerciseSections("", group);

  return (
    <div className="screen">
      <AppHeader onMenuClick={onMenuClick} />

      <div className="page-head">
        <h1 className="page-title">Ejercicios</h1>
        <span className="page-count">{EXERCISES.length} ejercicios</span>
      </div>
      <GroupChips group={group} onGroupChange={onGroupChange} />

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
