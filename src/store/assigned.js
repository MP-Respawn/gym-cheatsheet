/*
 * assigned.js
 *
 * Turns the routines downloaded from the database (rows of programs ->
 * program_days -> program_steps, see remote.js) into the shape the screens
 * already know from src/data/routines.js, so RoutineDetail, ProgramDetail
 * and WorkoutLog draw them unchanged:
 *
 *   program  { id, name, focus, discipline, clientId, days }
 *   day      { id, name, focus, block, discipline, programId, dayIndex,
 *              clientId, source: "assigned", steps }
 *   step     { id, exerciseIds, vuelta, note, prescription,
 *              sets, reps, loadKg }
 *
 * `prescription` is the text the screens show ("4 series x 8 reps · 50 kg"),
 * built from the trainer's numbers plus their free text.
 * Pure functions: nothing here reads storage or the network.
 */
import { currentId } from "./storage.js";

// 42.5 -> "42,5"
const decimal = (n) => String(n).replace(".", ",");

// 90 -> "1'30\"", 60 -> "1'", 45 -> "45\""
function restText(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}"`;
  return s === 0 ? `${m}'` : `${m}'${String(s).padStart(2, "0")}"`;
}

/*
 * The prescription line of a step: the trainer's numbers, then their free
 * text. "4 series x 8 reps · 50 kg · pausa 1'30\". Bajada lenta."
 * Either part can be missing; an empty string means "show the exercise's
 * own general prescription" (as with the routines in the code).
 */
export function prescriptionText(step) {
  const { sets, reps, load_kg: loadKg, secs, rest_sec: rest, tempo } = step;
  let volume = "";
  if (sets && reps) volume = `${sets} series x ${reps} reps`;
  else if (sets) volume = `${sets} series`;
  else if (reps) volume = `${reps} reps`;
  const numbers = [
    volume,
    secs ? `${secs} seg` : "",
    loadKg != null ? `${decimal(Number(loadKg))} kg` : "",
    rest ? `pausa ${restText(rest)}` : "",
    tempo ? `tempo ${tempo}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return [numbers, step.prescription_text?.trim() ?? ""].filter(Boolean).join(". ");
}

const byPosition = (a, b) => (a.position ?? 0) - (b.position ?? 0);

function toStep(row) {
  return {
    id: row.id,
    exerciseIds: (row.exercise_ids ?? []).map(currentId),
    vuelta: row.vuelta ?? undefined,
    note: row.note ?? "",
    prescription: prescriptionText(row),
    sets: row.sets ?? null,
    reps: row.reps ?? null,
    loadKg: row.load_kg == null ? null : Number(row.load_kg),
  };
}

function toProgram(row) {
  const days = [...(row.program_days ?? [])].sort(byPosition);
  const program = {
    id: row.id,
    name: row.name,
    focus: row.focus ?? "",
    discipline: row.discipline ?? "gym",
    clientId: row.client_id,
  };
  program.days = days.map((day, i) => ({
    id: day.id,
    // One day: the routine's own name. Several: the day's ("Día 2" if empty).
    name: days.length > 1 ? day.name || `Día ${i + 1}` : day.name || row.name,
    focus: day.focus || (days.length === 1 ? program.focus : ""),
    block: row.name,
    discipline: program.discipline,
    programId: row.id,
    dayIndex: i,
    clientId: row.client_id,
    source: "assigned",
    steps: [...(day.program_steps ?? [])].sort(byPosition).map(toStep),
  }));
  return program;
}

/*
 * The routines in `assigned` (the downloaded copy in storage), oldest first,
 * leaving out routines without days. Remembered per `assigned` object, so
 * screens can call it on every render.
 */
const cache = new WeakMap();
export function assignedPrograms(assigned) {
  if (!assigned) return [];
  if (!cache.has(assigned)) {
    cache.set(
      assigned,
      (assigned.programs ?? []).map(toProgram).filter((p) => p.days.length > 0),
    );
  }
  return cache.get(assigned);
}

// Every day of every assigned routine, flat.
export function assignedDays(assigned) {
  return assignedPrograms(assigned).flatMap((p) => p.days);
}
