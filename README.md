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
npm run icons    # remakes the app icons in public/ from public/icon.svg
npm run preview  # serves the production build: the offline service worker only runs here, not in dev
```

It is an installable web app (PWA): on Android Chrome offers "Instalar la app", on iPhone it's Safari → Compartir → Agregar a inicio. Installed, it opens full screen and without signal. No app store involved.

## Where things live

- `src/data/exercises.js`: muscle groups and every exercise (cues, prescription, alternatives).
- `src/data/routines.js`: the routines written in code: INCA's four core vueltas, shown to everyone under Rutinas as "Recomendadas por INCA". Every other routine is built by a coach in the app.
- `src/animations/exercises/<id>.js`: one animation per exercise, named like its id. Each file lists poses (an angle per body segment), a timeline with the trainer's tempo, phase names, and equipment.
- `src/animations/engine/`: turns those files into SVG and CSS keyframes (`kinematics.js`), with helpers for writing poses (`helpers.js`) and the renderer (`Figure.jsx`).
- `src/store/`: the signed-in person's data. `auth.js` signs in with an email code; `remote.js` downloads the assigned routines and the workout history and uploads finished workouts; `storage.js` keeps a copy on the phone (one per account) so it works without signal; `assigned.js` turns database rows into the routine shape the screens use; `useStore.js` holds the React hooks.
- `src/screens/`: the screens (sign-in, invitation, exercise list and detail, routine list and detail, workout log), and for trainers `TrainerClients`, `TrainerClient`, `ProgramEditor` (the routine builder) and `AssignProgram` (the per-client sets/kg grid); their routine list is `src/components/TrainerRoutines.jsx`, shown at the top of the routine list. `src/App.jsx` picks one based on the URL hash.
- `src/store/trainer.js`: the trainer's reads (clients, routines and who has them, a client's routines and workouts, through a small shared cache) and actions (new client and invitation link, save, assign, take away, archive).
- `src/store/admin.js`, `src/screens/AdminCoaches.jsx` and `src/screens/ExerciseRequests.jsx`: the superadmin's Coaches page (invite, turn off, who answers requests) and Pedidos (coaches ask for exercises; you answer).
- `src/styles.css`: all app styles; colors and fonts are the custom properties at the top. Three themes, picked in the menu and kept on each phone (`src/store/theme.js`): Oscuro (the original), Claro (Respawn in light, outlined cards) and INCA (INCA MMA's brand: bone, grey and gold, Archivo and IBM Plex Mono). A theme is only a list of those properties (`:root[data-theme="…"]`); `--accent` is the accent as text and lines, `--accent-fill` as a solid fill.
- `vite.config.js`: the installable app (manifest, and the service worker that keeps the app on the phone). `src/components/Notices.jsx` registers it and shows "Sin conexión" and "Hay una versión nueva"; `src/store/install.js` and `src/components/InstallHint.jsx` invite to install it.
- `.env`: the Supabase address and publishable key. Both are public by design; never put the secret key there.
- `supabase/`: the database. `migrations/` holds the tables, the permissions (who can read or write what) and the functions the app calls; `tests/` checks every role against them; `functions/exercise-request-email/` sends the emails about exercise requests through Resend.
- `scripts/pglite/`: the small stand-ins (Supabase's auth, pgTAP) that let `npm run test:db` run the migrations and tests in memory.

## Database setup (once per Supabase project)

1. `npx supabase login`, then `npx supabase link --project-ref <ref>`.
2. `npx supabase db push` applies the migrations (run it again after adding one).
3. Add your user in the dashboard (Authentication → Users → Add user, auto-confirm), then make it the superadmin in the SQL editor:
   `update public.profiles set role = 'superadmin' where email = '<your email>';`
4. Authentication → Emails → Templates: put `{{ .Token }}` in "Magic Link" and "Confirm signup", so people get a code.
5. Before inviting people outside your Supabase team, connect a custom SMTP sender (Resend): the built-in one only emails team members.
6. The exercise-request emails: create a Resend API key (sending access), save it, and deploy the function:

```bash
npx supabase secrets set RESEND_API_KEY=<your key>
```

```bash
npx supabase functions deploy exercise-request-email --use-api
```

## A trainer and their first client

A trainer signs in and gets **Clientes** (create a client, send their invitation link, see and adjust their routines, see their workouts), **Pedidos** (ask for a missing exercise) and their own routines at the top of **Rutinas** (build, edit, duplicate, assign with each client's sets and kilos). A routine is built once and assigned to many: editing it reaches everyone who has it, and each keeps their own numbers.

To make someone a coach, the superadmin opens **Coaches** → "+ Invitar un coach" and sends them the link: they sign in from it and are a coach. (Or, for a login that already exists, in the SQL editor: `update public.profiles set role = 'trainer' where email = '<email>';`)

To add an exercise, copy a block in `exercises.js`, copy a similar animation file with the new id, and run the check script.
