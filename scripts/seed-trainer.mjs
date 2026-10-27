/*
 * seed-trainer.mjs
 *
 * Puts the trainer's routines from the code (PROGRAMS in
 * src/data/routines.js: Bloque A, Bloque B) into the database as that
 * trainer's routines, creates one client for them, assigns every routine
 * to that client and prints the client's invitation link.
 *
 *   node scripts/seed-trainer.mjs --trainer-email <email> --trainer-name "<name>" \
 *     --client-email <email> --client-name "<name>" [--app-url <url>]
 *
 * Before: the trainer must have a login (dashboard: Authentication -> Users
 * -> Add user). It writes supabase/.temp/seed-trainer.sql; apply it with
 *   npx supabase db query --linked -f supabase/.temp/seed-trainer.sql
 *
 * Safe to run again: every row gets an id derived from the emails and the
 * routine, so a second run adds nothing new. Only the invitation is new
 * each time (the earlier unused link stops working).
 */
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { PROGRAMS, getTrainerProgram } from "../src/data/routines.js";

const { values: args } = parseArgs({
  options: {
    "trainer-email": { type: "string" },
    "trainer-name": { type: "string", default: "" },
    "client-email": { type: "string" },
    "client-name": { type: "string" },
    "app-url": { type: "string", default: "http://localhost:5173" },
  },
});
for (const required of ["trainer-email", "client-email", "client-name"]) {
  if (!args[required]) {
    console.error(`Missing --${required}. See the top of scripts/seed-trainer.mjs.`);
    process.exit(1);
  }
}
const trainerEmail = args["trainer-email"].trim().toLowerCase();
const clientEmail = args["client-email"].trim().toLowerCase();

// A UUID that is always the same for the same text (so reruns match rows).
function stableId(...parts) {
  const hex = createHash("sha256").update(parts.join("|")).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

// SQL literals.
const text = (value) => (value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`);
const textArray = (items) => `array[${items.map(text).join(", ")}]::text[]`;

const clientId = stableId("client", trainerEmail, clientEmail);
const token = randomBytes(24).toString("hex");

// Inserts for one routine (the program row, its days and their steps) and
// its assignment to the client.
function routineSql(program) {
  const key = "routine";
  const programId = stableId(key, trainerEmail, program.id);
  const sql = [
    `insert into public.programs (id, trainer_id, name, focus, discipline)
     values (${text(programId)}, v_trainer, ${text(program.name)}, ${text(program.focus)}, ${text(program.discipline ?? "gym")})
     on conflict (id) do nothing;`,
  ];
  program.days.forEach((day, dayIndex) => {
    const dayId = stableId(key, trainerEmail, program.id, day.id);
    sql.push(
      `insert into public.program_days (id, program_id, position, name, focus)
       values (${text(dayId)}, ${text(programId)}, ${dayIndex}, ${text(day.name)}, ${text(day.focus ?? "")})
       on conflict (id) do nothing;`,
    );
    day.steps.forEach((step, stepIndex) => {
      const stepId = stableId(key, trainerEmail, program.id, day.id, stepIndex);
      sql.push(
        `insert into public.program_steps (id, day_id, position, exercise_ids, vuelta, note, prescription_text)
         values (${text(stepId)}, ${text(dayId)}, ${stepIndex},
                 ${step.vuelta ? "'{}'::text[]" : textArray(step.exerciseIds)}, ${text(step.vuelta ?? null)},
                 ${text(step.note ?? "")}, ${text(step.prescription ?? "")})
         on conflict (id) do nothing;`,
      );
    });
  });
  sql.push(
    `insert into public.program_assignments (program_id, client_id, trainer_id)
     values (${text(programId)}, v_client, v_trainer)
     on conflict (program_id, client_id) do nothing;`,
  );
  return sql.join("\n");
}

const parts = PROGRAMS.map(({ id }) => routineSql(getTrainerProgram(id)));

const sql = `-- Written by scripts/seed-trainer.mjs. Apply with:
--   npx supabase db query --linked -f supabase/.temp/seed-trainer.sql
do $$
declare
  v_trainer uuid;
  v_client uuid := ${text(clientId)};
begin
  select id into v_trainer from public.profiles where lower(email) = ${text(trainerEmail)};
  if v_trainer is null then
    raise exception 'No login for %: add it first in Authentication -> Users', ${text(trainerEmail)};
  end if;
  -- A plain login becomes a trainer; a superadmin stays one.
  update public.profiles
    set role = case when role = 'client' then 'trainer'::public.app_role else role end,
        full_name = case when full_name = '' then ${text(args["trainer-name"])} else full_name end
    where id = v_trainer;

  insert into public.clients (id, trainer_id, full_name, email)
    values (v_client, v_trainer, ${text(args["client-name"])}, ${text(clientEmail)})
    on conflict (id) do nothing;

${parts.join("\n")}

  -- A fresh invitation for the client, unless they already accepted one.
  -- (Applying the same file twice keeps this same link working.)
  if (select user_id from public.clients where id = v_client) is null then
    update public.invitations set revoked_at = now()
      where client_id = v_client and accepted_at is null and revoked_at is null
        and token_hash <> private.hash_invitation_token(${text(token)});
    insert into public.invitations (token_hash, role, client_id, email, invited_by)
      values (private.hash_invitation_token(${text(token)}), 'client', v_client, ${text(clientEmail)}, v_trainer)
      on conflict (token_hash) do nothing;
  end if;
end;
$$;
`;

mkdirSync("supabase/.temp", { recursive: true });
writeFileSync("supabase/.temp/seed-trainer.sql", sql);
console.log("Wrote supabase/.temp/seed-trainer.sql");
console.log(`${PROGRAMS.length} routines, assigned to ${args["client-name"]} <${clientEmail}>`);
console.log(`Invitation link (valid 7 days, unless the client already accepted one):`);
console.log(`  ${args["app-url"].replace(/\/$/, "")}/#/invitacion/${token}`);
