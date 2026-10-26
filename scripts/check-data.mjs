/*
 * check-data.mjs
 *
 * A tiny safety net for the data files. Run it with:
 *
 *   node scripts/check-data.mjs
 *
 * It prints every problem it finds and exits with code 1 if there is at least
 * one, so a typo in an id never reaches the phone unnoticed.
 *
 * What it checks:
 *   - exercise ids are unique and kebab-case
 *   - every exercise and routine has a valid discipline
 *   - every group and secondary group exists in GROUPS
 *   - every id inside an "alternatives" array exists
 *   - every trainer exercise has at least 2 alternatives
 *   - every id used in routines.js exists, and every day of a routine with
 *     days (PROGRAMS) is a real routine that belongs to only one of them
 *   - core vueltas: every `vuelta` and `measure` value is valid, each step is
 *     either exercises or a vuelta, and each vuelta routine lists exactly the
 *     exercises tagged with that vuelta
 *   - no data file still uses an old id from renamedIds.js
 *   - every exercise's animation resolves: its own file
 *     (src/animations/exercises/<id>.js), or another exercise's file through
 *     `anim.from`; and no animation file is left unused
 *   - "Estirá después" (stretches) and routineLink point at real items
 *   - every animation compiles, loops back to its start pose, and never
 *     pushes a joint through the floor or out of the drawing
 */

import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DISCIPLINES, EXERCISES, GROUPS, VUELTAS } from "../src/data/exercises.js";
import { RENAMED_IDS } from "../src/data/renamedIds.js";
import { PROGRAMS, ROUTINES } from "../src/data/routines.js";
import { holdSpec, validate } from "../src/animations/engine/kinematics.js";

// Absolute path of the project root (one folder up from /scripts).
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Every problem found gets pushed here; we print them all at the end.
const errors = [];

const groupKeys = new Set(GROUPS.map((g) => g.key));
const disciplineKeys = new Set(DISCIPLINES.map((d) => d.key));
const SOURCES = ["trainer", "added", "research"];
const exerciseIds = new Set();
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* ---- Exercises: ids, groups ---- */
for (const ex of EXERCISES) {
  if (!kebab.test(ex.id)) errors.push(`id no es kebab-case: "${ex.id}"`);
  if (exerciseIds.has(ex.id)) errors.push(`id repetido: "${ex.id}"`);
  exerciseIds.add(ex.id);

  if (!groupKeys.has(ex.group)) errors.push(`${ex.id}: grupo inexistente "${ex.group}"`);
  for (const g of ex.secondary ?? []) {
    if (!groupKeys.has(g)) errors.push(`${ex.id}: grupo secundario inexistente "${g}"`);
  }
  if (!SOURCES.includes(ex.source)) {
    errors.push(`${ex.id}: source debe ser uno de ${SOURCES.join(", ")}`);
  }
  if (!disciplineKeys.has(ex.discipline)) errors.push(`${ex.id}: disciplina inexistente "${ex.discipline}"`);
  if (ex.originalName !== undefined && typeof ex.originalName !== "string") {
    errors.push(`${ex.id}: originalName tiene que ser texto`);
  }
  if (ex.vuelta !== undefined && !VUELTAS.some((v) => v.key === ex.vuelta)) {
    errors.push(`${ex.id}: vuelta inexistente "${ex.vuelta}"`);
  }
  if (ex.measure !== undefined && ex.measure !== "reps" && ex.measure !== "secs") {
    errors.push(`${ex.id}: measure debe ser "reps" o "secs"`);
  }
  if (RENAMED_IDS[ex.id]) errors.push(`${ex.id}: este id figura como viejo en renamedIds.js`);
}

/* ---- Exercises: alternatives (needs the full id set, so a second pass) ---- */
for (const ex of EXERCISES) {
  for (const alt of ex.alternatives ?? []) {
    if (!exerciseIds.has(alt)) errors.push(`${ex.id}: alternativa inexistente "${alt}"`);
    if (alt === ex.id) errors.push(`${ex.id}: se lista a sí mismo como alternativa`);
  }
  if (ex.source === "trainer" && (ex.alternatives ?? []).length < 2) {
    errors.push(`${ex.id}: ejercicio del entrenador con menos de 2 alternativas`);
  }
  for (const id of ex.stretches ?? []) {
    if (!exerciseIds.has(id)) errors.push(`${ex.id}: estiramiento inexistente "${id}"`);
    if (id === ex.id) errors.push(`${ex.id}: se lista a sí mismo como estiramiento`);
  }
}

/* ---- Old ids: every new id exists, and nothing still points at an old one ---- */
for (const [oldId, newId] of Object.entries(RENAMED_IDS)) {
  if (!exerciseIds.has(newId)) errors.push(`renamedIds.js: "${oldId}" apunta a "${newId}", que no existe`);
}
for (const ex of EXERCISES) {
  for (const alt of ex.alternatives ?? []) {
    if (RENAMED_IDS[alt]) errors.push(`${ex.id}: alternativa con id viejo "${alt}" (ahora "${RENAMED_IDS[alt]}")`);
  }
}

/* ---- Routines ---- */
const routineIds = new Set(ROUTINES.map((r) => r.id));
for (const ex of EXERCISES) {
  if (ex.routineLink !== undefined && !routineIds.has(ex.routineLink)) {
    errors.push(`${ex.id}: routineLink a una rutina inexistente "${ex.routineLink}"`);
  }
}
for (const routine of ROUTINES) {
  if (!disciplineKeys.has(routine.discipline)) {
    errors.push(`rutina ${routine.id}: disciplina inexistente "${routine.discipline}"`);
  }
  routine.steps.forEach((step, i) => {
    const where = `rutina ${routine.id}, paso ${i + 1}`;
    const hasIds = Array.isArray(step.exerciseIds);
    if (hasIds === (step.vuelta !== undefined)) {
      errors.push(`${where}: tiene que tener exerciseIds o vuelta (uno de los dos)`);
    }
    if (step.vuelta !== undefined && !VUELTAS.some((v) => v.key === step.vuelta)) {
      errors.push(`${where}: vuelta inexistente "${step.vuelta}"`);
    }
    for (const id of step.exerciseIds ?? []) {
      if (RENAMED_IDS[id]) errors.push(`${where}: id viejo "${id}" (ahora "${RENAMED_IDS[id]}")`);
      else if (!exerciseIds.has(id)) errors.push(`${where}: ejercicio inexistente "${id}"`);
    }
  });
}

/* ---- Routines with days: every day exists, and belongs to one routine only ---- */
const dayOwner = new Map();
for (const program of PROGRAMS) {
  if (routineIds.has(program.id)) errors.push(`programa ${program.id}: usa el mismo id que una rutina`);
  if (program.dayIds.length < 2) errors.push(`programa ${program.id}: necesita al menos 2 días`);
  for (const dayId of program.dayIds) {
    if (!routineIds.has(dayId)) errors.push(`programa ${program.id}: día inexistente "${dayId}"`);
    if (dayOwner.has(dayId)) errors.push(`programa ${program.id}: "${dayId}" ya es un día de ${dayOwner.get(dayId)}`);
    dayOwner.set(dayId, program.id);
  }
}

/* ---- Vueltas: each routine holds exactly the exercises tagged with it ---- */
for (const vuelta of VUELTAS) {
  // Where its filter chip shows: inside a group or inside a discipline.
  const inGroup = vuelta.group !== undefined && groupKeys.has(vuelta.group);
  const inDiscipline = vuelta.discipline !== undefined && disciplineKeys.has(vuelta.discipline);
  if (inGroup === inDiscipline) {
    errors.push(`vuelta ${vuelta.key}: tiene que tener un group o una discipline válidos (uno solo)`);
  }
  if (typeof vuelta.partOf !== "string" || !vuelta.partOf) {
    errors.push(`vuelta ${vuelta.key}: falta partOf (la frase "Parte de..." de la ficha)`);
  }
  if (!routineIds.has(vuelta.routineId)) {
    errors.push(`vuelta ${vuelta.key}: falta la rutina "${vuelta.routineId}"`);
    continue;
  }
  const routine = ROUTINES.find((r) => r.id === vuelta.routineId);
  const inRoutine = new Set(routine.steps.flatMap((step) => step.exerciseIds ?? []));
  for (const id of inRoutine) {
    if (EXERCISES.find((ex) => ex.id === id)?.vuelta !== vuelta.key) {
      errors.push(`vuelta ${vuelta.key}: "${id}" está en la rutina pero no tiene vuelta: "${vuelta.key}"`);
    }
  }
  for (const ex of EXERCISES.filter((e) => e.vuelta === vuelta.key)) {
    if (!inRoutine.has(ex.id)) errors.push(`vuelta ${vuelta.key}: "${ex.id}" tiene la etiqueta pero falta en la rutina`);
  }
}

/* ---- Animations ----
 * Each exercise has one file in src/animations/exercises/ named like its id,
 * or reuses another exercise's file through `anim.from` (optionally held
 * or without equipment). The files are plain JavaScript, so we can
 * load them here and run the same engine the app uses to look for problems.
 */
const animDir = join(root, "src", "animations", "exercises");
const animFiles = existsSync(animDir)
  ? readdirSync(animDir).filter((f) => f.endsWith(".js")).map((f) => f.replace(/\.js$/, ""))
  : [];
const usedFiles = new Set();
let animated = 0;
for (const ex of EXERCISES) {
  const anim = ex.anim ?? {};
  for (const key of Object.keys(anim)) {
    if (!["from", "hold", "bare"].includes(key)) errors.push(`${ex.id}: anim.${key} no existe (from, hold, bare)`);
  }
  const from = anim.from ?? ex.id;
  if (anim.from !== undefined) {
    const source = EXERCISES.find((e) => e.id === anim.from);
    if (!source) {
      errors.push(`${ex.id}: anim.from a un ejercicio inexistente "${anim.from}"`);
      continue;
    }
    if (source.anim?.from) errors.push(`${ex.id}: anim.from apunta a "${anim.from}", que a su vez reusa otra animación`);
  }
  const file = join(animDir, `${from}.js`);
  if (!existsSync(file)) {
    errors.push(`${ex.id}: falta su animación src/animations/exercises/${from}.js`);
    continue;
  }
  usedFiles.add(from);
  let spec = (await import(pathToFileURL(file).href)).default;
  if (anim.bare) spec = { ...spec, props: [] };
  if (anim.hold) spec = holdSpec(spec);
  const problems = validate(spec, ex.id);
  for (const p of problems) errors.push(`${ex.id} (animación): ${p}`);
  if (problems.length === 0) animated++;
}
for (const file of animFiles) {
  if (!usedFiles.has(file)) errors.push(`animación sin usar: src/animations/exercises/${file}.js`);
}

/* ---- Report ---- */
if (errors.length > 0) {
  console.error(`check-data: ${errors.length} problema(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `check-data: OK. ${EXERCISES.length} ejercicios, ${ROUTINES.length} rutinas, ${animated} animaciones válidas (${animFiles.length} archivos).`,
);
for (const d of DISCIPLINES) {
  const exercises = EXERCISES.filter((ex) => ex.discipline === d.key).length;
  const routines = ROUTINES.filter((r) => r.discipline === d.key).length;
  console.log(`  ${d.label.padEnd(12)} ${String(exercises).padStart(3)} ejercicios, ${routines} rutinas`);
}
