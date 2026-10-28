/*
 * assistant.js
 *
 * Talks to the routine assistant (supabase/functions/routine-assistant).
 * Two modes, picked with a switch in the builder and remembered on this
 * phone:
 *   "coach"    Coach experto: Claude Sonnet 5.5 as a personal trainer; may
 *              suggest exercises we don't have yet
 *   "catalog"  Catálogo: Claude Haiku 5.5, only our exercises; cheaper
 *
 * The conversation lives in the builder while it is open: `history` is the
 * list of messages the function returned so far, sent back untouched.
 */
import { supabase } from "./supabase.js";

export const ASSISTANT_MODES = [
  { key: "coach", label: "Coach experto", hint: "Criterio de preparador físico; puede sugerir ejercicios nuevos." },
  { key: "catalog", label: "Catálogo", hint: "Solo con nuestros ejercicios. Más barato." },
];

const MODE_KEY = "assistant-mode";

export function savedMode() {
  try {
    return window.localStorage.getItem(MODE_KEY) === "catalog" ? "catalog" : "coach";
  } catch {
    return "coach";
  }
}

export function saveMode(mode) {
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // Storage blocked: the switch still works for now.
  }
}

/*
 * One turn with the assistant: a `message`, or the `answers` to the
 * questions of its last reply (in order). `draft` is the builder's routine
 * (null when it is still empty). Returns { messages, text, proposal,
 * questions, remainingToday }; throws an Error with a message to show.
 */
export async function askAssistant({ mode, history, message = "", answers = [], draft }) {
  const call = () =>
    supabase.functions.invoke("routine-assistant", { body: { mode, history, message, answers, draft } });
  let { data, error } = await call();
  // 401: the sign-in token expired (they last an hour) and was not renewed
  // in time. Renew it and try once more; if that fails, say so plainly.
  if (error?.context?.status === 401) {
    const { error: renewError } = await supabase.auth.refreshSession();
    if (renewError) throw new Error("Tu sesión venció. Cerrá sesión y volvé a entrar.");
    ({ data, error } = await call());
  }
  if (error) {
    // The function answers errors as { error: "..." } with a status code.
    let text = "No se pudo consultar al asistente. Probá de nuevo.";
    try {
      const body = await error.context?.json();
      if (body?.error) text = body.error;
    } catch {
      if (!navigator.onLine) text = "Sin conexión. Probá de nuevo cuando tengas señal.";
    }
    throw new Error(text);
  }
  return data;
}

// The builder's draft in the shape the assistant uses (snake_case, numbers).
export function draftForAssistant(draft) {
  const hasSteps = draft.days.some((d) => d.steps.length > 0);
  if (!hasSteps) return null;
  const num = (text) => {
    const n = Number(String(text).replace(",", ".").trim());
    return String(text).trim() === "" || Number.isNaN(n) ? 0 : n;
  };
  return {
    name: draft.name,
    focus: draft.focus,
    days: draft.days.map((d) => ({
      name: d.name,
      focus: d.focus,
      steps: d.steps.map((s) => ({
        exercise_ids: s.exerciseIds,
        vuelta: s.vuelta ?? "",
        sets: num(s.sets),
        reps: s.reps,
        load_kg: num(s.loadKg),
        rest_sec: num(s.restSec),
        text: s.text,
        note: s.note,
      })),
    })),
  };
}

// The exercises a proposal suggests that are not in the catalog yet.
export function newExercises(proposal) {
  return (proposal?.days ?? [])
    .flatMap((d) => d.steps)
    .filter((s) => s.new_exercise_name)
    .map((s) => ({ name: s.new_exercise_name, description: s.new_exercise_description ?? "", closestId: s.closest_id }));
}
