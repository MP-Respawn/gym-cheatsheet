/*
 * search.js
 *
 * Exercise search and filtering, shared by the home list and the exercise
 * picker in the routine editor.
 */
import { EXERCISES, GROUPS } from "../data/exercises.js";

// Lowercase and strip accents, so "biceps" finds "Bíceps" and "cuadri" finds "Cuádriceps".
export function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Does this exercise match what was typed? Looks at name, cues and equipment.
// Every word typed must appear somewhere ("remo barra" finds "Remo cruz con barra").
export function matchesSearch(exercise, query) {
  if (!query) return true;
  const haystack = normalize([exercise.name, ...exercise.cues, ...exercise.equipment].join(" "));
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
