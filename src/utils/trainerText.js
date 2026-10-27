/*
 * trainerText.js
 *
 * Small text helpers shared by the trainer's screens (Clientes,
 * the coach's routines, a client's page).
 */
import { stepExerciseIds } from "../data/routines.js";
import { inviteStatus } from "../store/trainer.js";

// "3 nov"
export const shortDate = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

// The line under a client's name: where they stand.
export function statusText(client) {
  const status = inviteStatus(client);
  if (status.state === "active") return "Activo";
  if (status.state === "invited") return `Invitación pendiente, vence el ${shortDate.format(new Date(status.expiresAt))}`;
  if (status.state === "expired") return "El link venció: generá uno nuevo";
  return "Sin invitar";
}

// "3 días · 14 ejercicios" from a routine's days as the database sends them.
export function programSize(days) {
  const steps = days.flatMap((d) =>
    d.program_steps.map((s) => (s.vuelta ? { vuelta: s.vuelta } : { exerciseIds: s.exercise_ids })),
  );
  const exercises = new Set(steps.flatMap(stepExerciseIds)).size;
  const dayText = days.length === 1 ? "1 día" : `${days.length} días`;
  return `${dayText} · ${exercises} ${exercises === 1 ? "ejercicio" : "ejercicios"}`;
}
