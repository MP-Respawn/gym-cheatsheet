/*
 * ExerciseFilters.jsx
 *
 * The search box plus the sideways-scrolling row of muscle-group chips.
 * It only draws the controls; whoever uses it keeps the values (query and
 * group) and decides what to do with them. Used on the home screen and in
 * the exercise picker.
 */
import { GROUPS } from "../data/exercises.js";

export default function ExerciseFilters({ query, onQueryChange, group, onGroupChange, autoFocus = false }) {
  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Buscar: nombre, técnica, equipo"
        aria-label="Buscar ejercicio"
        value={query}
        autoFocus={autoFocus}
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
    </>
  );
}
