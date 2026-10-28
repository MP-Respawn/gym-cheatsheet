/*
 * build-assistant-kb.mjs
 *
 * Writes what the routine assistant (supabase/functions/routine-assistant)
 * knows about our catalog, from the app's own data files:
 *   catalog-full.json   for the "catalog" mode (Claude Haiku 5.5): every
 *                       exercise with its description, prescription,
 *                       alternatives and equipment, plus INCA's vueltas
 *   catalog-names.json  for the "coach" mode (Claude Sonnet 5.5): every
 *                       exercise by id, name, group and equipment only, so
 *                       its proposals point at our exercises
 *
 *   npm run kb             write both files
 *   npm run kb -- --check  exit 1 if they are out of date (check-data runs this)
 *
 * Run it after adding or changing an exercise, then redeploy the function.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXERCISES, VUELTAS, disciplineLabel, groupLabel } from "../src/data/exercises.js";
import { ROUTINES } from "../src/data/routines.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "supabase", "functions", "routine-assistant");

const full = {
  exercises: EXERCISES.map((ex) => ({
    id: ex.id,
    name: ex.name,
    ...(ex.originalName ? { originalName: ex.originalName } : {}),
    discipline: disciplineLabel(ex.discipline),
    group: groupLabel(ex.group),
    equipment: ex.equipment ?? [],
    ...(ex.measure ? { measure: ex.measure } : {}),
    description: ex.description,
    prescription: ex.prescription ?? "",
    alternatives: ex.alternatives ?? [],
  })),
  vueltas: VUELTAS.map((v) => {
    const routine = ROUTINES.find((r) => r.id === v.routineId);
    return {
      key: v.key,
      name: v.label,
      focus: routine?.focus ?? "",
      steps: (routine?.steps ?? []).map((s) => [s.exerciseIds.join(" + "), s.note].filter(Boolean).join(": ")),
    };
  }),
};

const names = {
  exercises: EXERCISES.map((ex) => ({
    id: ex.id,
    name: ex.name,
    discipline: disciplineLabel(ex.discipline),
    group: groupLabel(ex.group),
    equipment: ex.equipment ?? [],
  })),
  vueltas: VUELTAS.map((v) => ({ key: v.key, name: v.label })),
};

const files = {
  "catalog-full.json": JSON.stringify(full),
  "catalog-names.json": JSON.stringify(names),
};

if (process.argv.includes("--check")) {
  const stale = Object.entries(files).filter(([file, text]) => {
    try {
      return readFileSync(join(outDir, file), "utf8") !== text;
    } catch {
      return true;
    }
  });
  if (stale.length > 0) {
    console.error(`Desactualizado: ${stale.map(([f]) => f).join(", ")}. Corré npm run kb y volvé a desplegar la función.`);
    process.exit(1);
  }
} else {
  for (const [file, text] of Object.entries(files)) writeFileSync(join(outDir, file), text);
  console.log(`routine-assistant: ${full.exercises.length} ejercicios, ${full.vueltas.length} vueltas`);
}
