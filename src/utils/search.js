/*
 * search.js
 *
 * Exercise search and filtering, shared by the home list, the exercise
 * picker in the routine editor and the search page (which also looks
 * through routines).
 */
import { EXERCISES, GROUPS, getVuelta } from "../data/exercises.js";
import { stepExerciseIds } from "../data/routines.js";

// Lowercase and strip accents, so "biceps" finds "Bíceps" and "cuadri" finds "Cuádriceps".
export function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Does this exercise match what was typed? Looks at name, cues, equipment
// and the vuelta it belongs to (so "pelota" finds the whole ball vuelta).
// Every word typed must appear somewhere ("remo barra" finds "Remo cruz con barra").
export function matchesSearch(exercise, query) {
  if (!query) return true;
  const vuelta = getVuelta(exercise.vuelta)?.label ?? "";
  const haystack = normalize([exercise.name, ...exercise.cues, ...exercise.equipment, vuelta].join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/*
 * The exercises that pass both filters, split into one section per muscle
 * group (in GROUPS order). Within a group, the coach's exercises come first
 * and the suggested extras after. `group` is a group key or "todos".
 */
export function exerciseSections(query, group) {
  const visible = EXERCISES.filter(
    (ex) => (group === "todos" || ex.group === group) && matchesSearch(ex, query),
  );
  return GROUPS.map((g) => ({
    ...g,
    items: visible
      .filter((ex) => ex.group === g.key)
      .sort((a, b) => (a.source === b.source ? 0 : a.source === "trainer" ? -1 : 1)),
  })).filter((section) => section.items.length > 0);
}

// The words typed, normalized, without blanks: "Remo  Barra" -> ["remo", "barra"].
function queryWords(query) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

/*
 * Global search (the #/buscar page): which routines match what was typed.
 * A routine matches on its own name, focus or block, or when one of its
 * exercises matches. `why` says which, for the line under the name:
 * the routine's focus, or "Incluye <exercise>".
 * Returns [{ routine, why }].
 */
export function searchRoutines(routines, query) {
  const words = queryWords(query);
  if (words.length === 0) return [];
  const results = [];
  for (const routine of routines) {
    const own = normalize([routine.name, routine.focus ?? "", routine.block ?? ""].join(" "));
    if (words.every((word) => own.includes(word))) {
      results.push({ routine, why: routine.focus || routine.block || "" });
      continue;
    }
    const ids = routine.steps.flatMap(stepExerciseIds);
    const hit = ids.map((id) => EXERCISES.find((ex) => ex.id === id)).find((ex) => ex && matchesSearch(ex, query));
    if (hit) results.push({ routine, why: `Incluye ${hit.name}` });
  }
  return results;
}

/*
 * Splits `text` into pieces so the parts that match the typed words can be
 * highlighted: [{ text, hit }]. Accents are ignored when comparing; that is
 * safe because normalize() keeps one character per character of the
 * (precomposed) names in exercises.js.
 */
export function highlightParts(text, query) {
  const words = queryWords(query);
  const folded = normalize(text);
  const marked = new Array(text.length).fill(false);
  if (folded.length === text.length) {
    for (const word of words) {
      let at = folded.indexOf(word);
      while (at !== -1) {
        marked.fill(true, at, at + word.length);
        at = folded.indexOf(word, at + word.length);
      }
    }
  }
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === marked[i]) last.text += text[i];
    else parts.push({ text: text[i], hit: marked[i] });
  }
  return parts;
}
