# Machete de gimnasio

Personal, read-only exercise cheatsheet for the phone. React + Vite, no backend.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/ (Vercel picks this up with zero config)
npm run lint     # oxlint, catches unused imports and variables
node scripts/check-data.mjs              # checks ids, groups, routines and every animation
node scripts/figure-points.mjs <id>      # prints where each joint lands in each pose
npm run test:db  # database permission tests, in PGlite (no Docker needed)
```

## Where things live

- `src/data/exercises.js`: muscle groups and every exercise (cues, prescription, alternatives).
- `src/data/routines.js`: the five routines, step by step.
- `src/animations/exercises/<id>.js`: one animation per exercise, named like its id. Each file lists poses (an angle per body segment), a timeline with the trainer's tempo, phase names, and equipment.
- `src/animations/engine/`: turns those files into SVG and CSS keyframes (`kinematics.js`), with helpers for writing poses (`helpers.js`) and the renderer (`Figure.jsx`).
- `src/store/`: your personal data (own routines and the workout log). Today it is saved on the device (localStorage) behind async functions shaped like a future database API; to add accounts and a backend later, only these files change.
- `src/screens/`: the screens (exercise list and detail, routine list and detail, routine editor, workout log). `src/App.jsx` picks one based on the URL hash.
- `src/styles.css`: all app styles; colors are the custom properties at the top.
- `supabase/`: the database for the trainer → client version (not connected to the app yet). `migrations/` holds the tables and the permissions (who can read or write what); `tests/` checks every role against them. The plan behind it is in `docs/arquitectura.md`.
- `scripts/pglite/`: the small stand-ins (Supabase's auth, pgTAP) that let `npm run test:db` run the migrations and tests in memory.

## Database setup (once, when connecting a Supabase project)

1. Install the Supabase CLI, then `supabase init` (keeps the existing `supabase/` files) and `supabase link --project-ref <ref>`.
2. `supabase db push` applies the migrations.
3. Log in once with your email, then make yourself the superadmin in the SQL editor:
   `update public.profiles set role = 'superadmin' where email = '<your email>';`
4. In Auth settings, enable email sign-in with a one-time code.

To add an exercise, copy a block in `exercises.js`, copy a similar animation file with the new id, and run the check script.
