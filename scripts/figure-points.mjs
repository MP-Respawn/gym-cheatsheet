/*
 * figure-points.mjs
 *
 * Helper for tuning an animation. Prints where every joint lands in each
 * pose of the timeline, so you can see (without opening the app) if a foot
 * slides, a hand misses the bar, or the head leaves the drawing.
 *
 *   node scripts/figure-points.mjs sentadilla-barra
 *   node scripts/figure-points.mjs sentadilla-barra hip kneeR ankleR   (only some joints)
 */
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compile, validate } from "../src/animations/engine/kinematics.js";

const [id, ...only] = process.argv.slice(2);
if (!id) {
  console.error("Uso: node scripts/figure-points.mjs <id-del-ejercicio> [articulaciones...]");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src", "animations", "exercises", `${id}.js`);
const spec = (await import(pathToFileURL(file).href)).default;

const compiled = compile(spec, id);
for (const frame of compiled.frames) {
  const entries = Object.entries(frame.pos)
    .filter(([joint]) => only.length === 0 || only.includes(joint))
    .map(([joint, [x, y]]) => `${joint}(${x.toFixed(0)},${y.toFixed(0)})`);
  console.log(`${frame.time.toFixed(2).padStart(5)}s  ${frame.pose.padEnd(12)} ${entries.join(" ")}`);
}

const problems = validate(spec, id);
console.log(problems.length ? `\nProblemas:\n  - ${problems.join("\n  - ")}` : "\nSin problemas.");
