# Machete de gimnasio

Exercise cheatsheet and workout log for the phone, where trainers assign routines to their clients. React + Vite on Vercel, Supabase (Postgres + email-code login) behind it. Everything needs an account; clients get in through their trainer's invitation link. The plan is in `docs/arquitectura.md`.

## Run

```bash
npm install
npm run dev      # local dev server (talks to the live Supabase project in .env)
npm run build    # production build into dist/ (Vercel picks this up with zero config)
npm run lint     # oxlint, catches unused imports and variables
node scripts/check-data.mjs              # checks ids, groups, routines and every animation
node scripts/figure-points.mjs <id>      # prints where each joint lands in each pose
npm run test:db  # database permission tests, in PGlite (no Docker needed)
```

## Where things live

- `src/data/exercises.js`: muscle groups and every exercise (cues, prescription, alternatives).
- `src/data/routines.js`: routines written in code. The catalog's sequences (core vueltas, Flow básico, yoga, Jiu Jitsu) are shown to everyone; Bloque A and B are only the source for `scripts/seed-trainer.mjs`.
- `src/animations/exercises/<id>.js`: one animation per exercise, named like its id. Each file lists poses (an angle per body segment), a timeline with the trainer's tempo, phase names, and equipment.
- `src/animations/engine/`: turns those files into SVG and CSS keyframes (`kinematics.js`), with helpers for writing poses (`helpers.js`) and the renderer (`Figure.jsx`).
- `src/store/`: the signed-in person's data. `auth.js` signs in with an email code; `remote.js` downloads the assigned routines and the workout history and uploads finished workouts; `storage.js` keeps a copy on the phone (one per account) so it works without signal; `assigned.js` turns database rows into the routine shape the screens use; `useStore.js` holds the React hooks.
- `src/screens/`: the screens (sign-in, invitation, exercise list and detail, routine list and detail, workout log), and for trainers `TrainerClients`, `TrainerClient`, `ProgramEditor` (the routine builder) and `AssignProgram` (the per-client sets/kg grid); their routine list is `src/components/TrainerRoutines.jsx`, shown at the top of the routine list. `src/App.jsx` picks one based on the URL hash.
- `src/store/trainer.js`: the trainer's reads (clients, routines and who has them, a client's routines and workouts, through a small shared cache) and actions (new client and invitation link, save, assign, take away, archive).
- `src/styles.css`: all app styles; colors are the custom properties at the top.
- `.env`: the Supabase address and publishable key. Both are public by design; never put the secret key there.
- `supabase/`: the database. `migrations/` holds the tables, the permissions (who can read or write what) and the functions the app calls; `tests/` checks every role against them.
- `scripts/pglite/`: the small stand-ins (Supabase's auth, pgTAP) that let `npm run test:db` run the migrations and tests in memory.

## Database setup (once per Supabase project)

1. `npx supabase login`, then `npx supabase link --project-ref <ref>`.
2. `npx supabase db push` applies the migrations (run it again after adding one).
3. Add your user in the dashboard (Authentication → Users → Add user, auto-confirm), then make it the superadmin in the SQL editor:
   `update public.profiles set role = 'superadmin' where email = '<your email>';`
4. Authentication → Emails → Templates: put `{{ .Token }}` in "Magic Link" and "Confirm signup", so people get a code.
5. Before inviting people outside your Supabase team, connect a custom SMTP sender (Resend): the built-in one only emails team members.

## A trainer and their first client

A trainer signs in and gets **Clientes** (create a client, send their invitation link, see and adjust their routines, see their workouts) and their own routines at the top of **Rutinas** (build, edit, duplicate, assign with each client's sets and kilos). A routine is built once and assigned to many: editing it reaches everyone who has it, and each keeps their own numbers. To make someone a trainer, add their login in the dashboard and run in the SQL editor:
`update public.profiles set role = 'trainer' where email = '<email>';`

To also import Bloque A and B from the code as that trainer's routines, with a first client:

```bash
node scripts/seed-trainer.mjs --trainer-email <email> --trainer-name "<name>" --client-email <email> --client-name "<name>" --app-url <app url>
```

```bash
npx supabase db query --linked -f supabase/.temp/seed-trainer.sql
```

It imports Bloque A and B as the trainer's routines, assigns them to the client and prints the client's invitation link.

To add an exercise, copy a block in `exercises.js`, copy a similar animation file with the new id, and run the check script.
