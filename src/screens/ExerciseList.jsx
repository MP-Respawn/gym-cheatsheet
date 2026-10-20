/*
 * ExerciseList.jsx: home screen (#/)
 *
 * Top: a sticky bar with the search box and a sideways-scrolling row of
 * muscle-group chips. Below: the exercises that match, grouped under a
 * heading per muscle group.
 *
 * The search text and the chosen chip live in App.jsx (passed in as props),
 * so they are still there when you come back from an exercise detail.
 * The filtering itself is in src/utils/search.js (shared with the picker).
 */
import ExerciseCard from "../components/ExerciseCard.jsx";
import ExerciseFilters from "../components/ExerciseFilters.jsx";
import { exerciseSections } from "../utils/search.js";

export default function ExerciseList({ query, onQueryChange, group, onGroupChange }) {
  const sections = exerciseSections(query, group);

  return (
    <div className="screen">
      {/* Sticky filter bar: stays on top while the list scrolls */}
      <div className="filter-bar">
        <ExerciseFilters query={query} onQueryChange={onQueryChange} group={group} onGroupChange={onGroupChange} />
      </div>

      {/* The list itself */}
      <div className="content">
        {sections.length === 0 && (
          <p className="empty">No encontramos ejercicios con esa búsqueda.</p>
        )}
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
