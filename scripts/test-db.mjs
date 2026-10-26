/*
 * test-db.mjs
 *
 * Runs the database tests without Docker or a Supabase account:
 *   1. starts an in-memory Postgres (PGlite),
 *   2. adds the bits of Supabase the migrations expect (pglite/supabase-stub.sql),
 *   3. applies every file in supabase/migrations/ in order,
 *   4. runs every supabase/tests/**\/*.test.sql with a small pgTAP stand-in
 *      (pglite/pgtap-lite.sql) and prints the results.
 *
 * Exits with 1 if any test fails, so it can run before a deploy.
 * `supabase test db` runs the same test files against the real thing.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (...parts) => readFileSync(join(root, ...parts), "utf8");

const sqlFiles = (dir) =>
  readdirSync(join(root, dir), { recursive: true })
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => join(dir, f));

const db = new PGlite();
await db.exec(read("scripts/pglite/supabase-stub.sql"));
for (const file of sqlFiles("supabase/migrations")) {
  try {
    await db.exec(read(file));
  } catch (err) {
    console.error(`Migration ${file} failed: ${err.message}`);
    process.exit(1);
  }
}
await db.exec(read("scripts/pglite/pgtap-lite.sql"));

let failed = 0;
for (const file of sqlFiles("supabase/tests").filter((f) => f.endsWith(".test.sql"))) {
  console.log(`# ${file}`);
  // PGlite has no pgTAP extension; pgtap-lite.sql already provides the functions.
  const sql = read(file).replace(/^\s*create extension[^;]*pgtap[^;]*;/im, "");
  let results;
  try {
    results = await db.exec(sql);
  } catch (err) {
    await db.exec("rollback").catch(() => {});
    console.log(`not ok - the file stopped with an error: ${err.message}`);
    failed++;
    continue;
  }
  // Every row of every statement whose single value is TAP output.
  for (const { rows } of results) {
    for (const row of rows) {
      const value = Object.values(row)[0];
      if (typeof value !== "string" || !/^(not ok|ok|1\.\.|#)/.test(value)) continue;
      console.log(value);
      if (value.startsWith("not ok") || value.startsWith("# Looks like")) failed++;
    }
  }
}

console.log(failed ? `\n${failed} problem(s)` : "\nAll database tests passed");
process.exit(failed ? 1 : 0);
