/*
 * ExerciseFilters.jsx
 *
 * The search box plus the sideways-scrolling row of muscle-group chips.
 * They only draw the controls; whoever uses them keeps the values (query and
 * group) and decides what to do with them. The home screen uses the chips
 * alone (its search lives in the top nav); the exercise picker uses both.
 */
import { GROUPS } from "../data/exercises.js";

export function GroupChips({ group, onGroupChange }) {
  return (
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
  );
}

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
      <GroupChips group={group} onGroupChange={onGroupChange} />
    </>
  );
}
