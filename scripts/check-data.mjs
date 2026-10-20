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
 *   - every group and secondary group exists in GROUPS
 *   - every id inside an "alternatives" array exists
 *   - every trainer exercise has at least 2 alternatives
 *   - every id used in routines.js exists
 *   - every exercise has its own animation (src/animations/exercises/<id>.js)
 *     and no animation file is left without an exercise
 *   - every animation compiles, loops back to its start pose, and never
 *     pushes a joint through the floor or out of the drawing
 */

import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { EXERCISES, GROUPS } from "../src/data/exercises.js";
import { ROUTINES } from "../src/data/routines.js";
import { validate } from "../src/animations/engine/kinematics.js";

// Absolute path of the project root (one folder up from /scripts).
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Every problem found gets pushed here; we print them all at the end.
const errors = [];

const groupKeys = new Set(GROUPS.map((g) => g.key));
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
  if (ex.source !== "trainer" && ex.source !== "added") {
    errors.push(`${ex.id}: source debe ser "trainer" o "added"`);
  }
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
}

/* ---- Routines ---- */
for (const routine of ROUTINES) {
  routine.steps.forEach((step, i) => {
    for (const id of step.exerciseIds) {
      if (!exerciseIds.has(id)) {
        errors.push(`rutina ${routine.id}, paso ${i + 1}: ejercicio inexistente "${id}"`);
      }
    }
  });
}

/* ---- Animations ----
 * Each exercise has one file in src/animations/exercises/ named like its id.
 * The files are plain JavaScript, so we can load them here and run the same
 * engine the app uses to look for problems.
 */
const animDir = join(root, "src", "animations", "exercises");
const animFiles = existsSync(animDir)
  ? readdirSync(animDir).filter((f) => f.endsWith(".js")).map((f) => f.replace(/\.js$/, ""))
  : [];
let animated = 0;
for (const ex of EXERCISES) {
  const file = join(animDir, `${ex.id}.js`);
  if (!existsSync(file)) {
    errors.push(`${ex.id}: falta su animación src/animations/exercises/${ex.id}.js`);
    continue;
  }
  const spec = (await import(pathToFileURL(file).href)).default;
  const problems = validate(spec, ex.id);
  for (const p of problems) errors.push(`${ex.id} (animación): ${p}`);
  if (problems.length === 0) animated++;
}
for (const file of animFiles) {
  if (!exerciseIds.has(file)) errors.push(`animación sin ejercicio: src/animations/exercises/${file}.js`);
}

/* ---- Report ---- */
if (errors.length > 0) {
  console.error(`check-data: ${errors.length} problema(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `check-data: OK. ${EXERCISES.length} ejercicios, ${ROUTINES.length} rutinas, ${animated} animaciones.`,
);
