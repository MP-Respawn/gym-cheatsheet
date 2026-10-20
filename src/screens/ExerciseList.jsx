/*
 * ExerciseList.jsx: home screen (#/)
 *
 * Top: a sticky bar with the search box and a sideways-scrolling row of
 * muscle-group chips. Below: the exercises that match, grouped under a
 * heading per muscle group.
 *
 * The search text and the chosen chip live in App.jsx (passed in as props),
 * so they are still there when you come back from an exercise detail.
 */
import { EXERCISES, GROUPS } from "../data/exercises.js";
import ExerciseCard from "../components/ExerciseCard.jsx";

// Lowercase and strip accents, so "biceps" finds "Bíceps" and "cuadri" finds "Cuádriceps".
function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Does this exercise match what was typed? Looks at name, cues and equipment.
function matchesSearch(exercise, query) {
  if (!query) return true;
  const haystack = normalize(
    [exercise.name, ...exercise.cues, ...exercise.equipment].join(" "),
  );
  // Every word typed must appear somewhere ("remo barra" finds "Remo cruz con barra").
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function ExerciseList({ query, onQueryChange, group, onGroupChange }) {
  // Keep only the exercises that pass both filters.
  const visible = EXERCISES.filter(
    (ex) => (group === "todos" || ex.group === group) && matchesSearch(ex, query),
  );

  // Split them into sections, following the GROUPS order. Within a group,
  // the coach's exercises come first and the suggested extras after.
  const sections = GROUPS.map((g) => ({
    ...g,
    items: visible
      .filter((ex) => ex.group === g.key)
      .sort((a, b) => (a.source === b.source ? 0 : a.source === "trainer" ? -1 : 1)),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="screen">
      {/* Sticky filter bar: stays on top while the list scrolls */}
      <div className="filter-bar">
        <input
          className="search"
          type="search"
          placeholder="Buscar: nombre, técnica, equipo"
          aria-label="Buscar ejercicio"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Grupo muscular">
          {[{ key: "todos", label: "Todos" }, ...GROUPS].map((g) => (
            <button
              key={g.key}
              type="button"
              className={g.key === group ? "chip active" : "chip"}
              aria-pressed={g.key === group}
              onClick={() => onGroupChange(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>
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
