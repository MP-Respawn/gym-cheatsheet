/*
 * ExercisePicker.jsx
 *
 * Full-screen panel to choose an exercise, used by the routine editor.
 * Same search and group chips as the home screen. Tapping an exercise calls
 * onPick(id); "Cerrar" calls onClose().
 *
 * `exclude` lists exercises that cannot be picked (already in the superset
 * you are adding to); they show greyed out.
 *
 * While open, the page behind it stops scrolling, so only the list moves.
 */
import { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard.jsx";
import ExerciseFilters from "./ExerciseFilters.jsx";
import { exerciseSections } from "../utils/search.js";

export default function ExercisePicker({ title, exclude = [], onPick, onClose }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("todos");
  const sections = exerciseSections(query, group);

  // Lock the page scroll behind the panel while it is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="picker" role="dialog" aria-modal="true" aria-label={title}>
      <div className="picker-head">
        <div className="picker-title-row">
          <h2 className="picker-title">{title}</h2>
          <button type="button" className="text-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <ExerciseFilters query={query} onQueryChange={setQuery} group={group} onGroupChange={setGroup} />
      </div>

      <div className="picker-list">
        {sections.length === 0 && <p className="empty">No encontramos ejercicios con esa búsqueda.</p>}
        {sections.map((section) => (
          <section key={section.key} className="list-section">
            <h3 className="section-title">{section.label}</h3>
            <div className="card-list">
              {section.items.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onSelect={onPick} disabled={exclude.includes(ex.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
