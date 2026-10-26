/*
 * Search.jsx: search page (#/buscar)
 *
 * Opened from the search bar in the top nav. One box that looks through
 * every exercise and every routine (the ones assigned to you and the
 * catalog's sequences), with the results in two groups and the typed words
 * highlighted.
 *
 * With nothing typed it shows your recent searches. A search is remembered
 * when you open one of its results. The search text lives in App.jsx, so it
 * is still there when you come back from a result.
 */
import { useState } from "react";
import { EXERCISES, groupLabel } from "../data/exercises.js";
import { CATALOG_ROUTINES, useAssignedPrograms } from "../store/useStore.js";
import { highlightParts, matchesSearch, normalize, searchRoutines } from "../utils/search.js";
import BackButton from "../components/BackButton.jsx";
import ExerciseAnimation from "../components/ExerciseAnimation.jsx";

const RECENT_KEY = "recent-searches";
const MAX_RECENT = 6;

// Recent searches from the phone's storage; [] if storage is blocked.
function loadRecent() {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable: recent searches just won't be remembered.
  }
}

// The name with the matching words wrapped in <mark>.
function Highlighted({ text, query }) {
  return highlightParts(text, query).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : part.text));
}

export default function Search({ query, onQueryChange }) {
  const assigned = useAssignedPrograms().flatMap((p) => p.days);
  const [recent, setRecent] = useState(loadRecent);
  const typed = query.trim();

  // Exercises whose name matches come first, then matches on cues or equipment.
  const exercises = typed
    ? EXERCISES.filter((ex) => matchesSearch(ex, typed)).sort((a, b) => {
        const nameHit = (ex) => normalize(typed).split(/\s+/).every((w) => normalize(ex.name).includes(w));
        return Number(nameHit(b)) - Number(nameHit(a));
      })
    : [];
  const routines = searchRoutines([...assigned, ...CATALOG_ROUTINES], typed);

  // Called when a result is opened: move this search to the top of the list.
  function remember() {
    if (!typed) return;
    const next = [typed, ...recent.filter((item) => normalize(item) !== normalize(typed))].slice(0, MAX_RECENT);
    setRecent(next);
    saveRecent(next);
  }

  function clearRecent() {
    setRecent([]);
    saveRecent([]);
  }

  const count = (n) => (n === 1 ? "1 resultado" : `${n} resultados`);

  return (
    <div className="screen">
      <div className="top-bar search-top-bar">
        <BackButton fallback="#/" />
        <div className="search-field">
          <svg className="search-field-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            className="search search-input"
            type="search"
            placeholder="Buscar ejercicios y rutinas"
            aria-label="Buscar ejercicios y rutinas"
            enterKeyHint="search"
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button type="button" className="search-clear" aria-label="Borrar búsqueda" onClick={() => onQueryChange("")}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="content">
        {/* Nothing typed yet: recent searches */}
        {!typed && recent.length > 0 && (
          <section className="list-section">
            <div className="section-head">
              <h2 className="section-title">Búsquedas recientes</h2>
              <button type="button" className="text-button" onClick={clearRecent}>
                Borrar
              </button>
            </div>
            <div className="recent-chips">
              {recent.map((item) => (
                <button key={item} type="button" className="chip" onClick={() => onQueryChange(item)}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}
        {!typed && recent.length === 0 && (
          <p className="empty">Buscá por nombre, técnica o equipo: &ldquo;plancha&rdquo;, &ldquo;mancuernas&rdquo;, &ldquo;día 2&rdquo;.</p>
        )}

        {typed && exercises.length === 0 && routines.length === 0 && (
          <p className="empty">No encontramos ejercicios ni rutinas con esa búsqueda.</p>
        )}

        {exercises.length > 0 && (
          <section className="list-section">
            <div className="section-head">
              <h2 className="section-title">Ejercicios</h2>
              <span className="section-count">{count(exercises.length)}</span>
            </div>
            <div className="card-list">
              {exercises.map((ex) => (
                <a key={ex.id} className="card" href={`#/ejercicio/${ex.id}`} onClick={remember}>
                  <ExerciseAnimation id={ex.id} className="thumb small" />
                  <div className="card-text">
                    <span className="card-title">
                      <Highlighted text={ex.name} query={typed} />
                    </span>
                    <span className="card-meta">{groupLabel(ex.group)}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {routines.length > 0 && (
          <section className="list-section">
            <div className="section-head">
              <h2 className="section-title">Rutinas</h2>
              <span className="section-count">{count(routines.length)}</span>
            </div>
            <div className="card-list">
              {routines.map(({ routine, why }) => (
                <a key={routine.id} className="card routine-card" href={`#/rutina/${routine.id}`} onClick={remember}>
                  <div className="card-text">
                    <span className="card-title">
                      <Highlighted text={routine.name} query={typed} />
                    </span>
                    <span className="card-desc">
                      {routine.block}
                      {why && ` · ${why}`}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
