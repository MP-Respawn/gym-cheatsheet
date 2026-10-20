# Machete de gimnasio

Personal, read-only exercise cheatsheet for the phone. React + Vite, no backend.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/ (Vercel picks this up with zero config)
npm run lint     # oxlint, catches unused imports and variables
node scripts/check-data.mjs   # checks every id, group and animation reference
```

## Where things live

- `src/data/exercises.js`: muscle groups and every exercise (cues, prescription, alternatives).
- `src/data/routines.js`: the five routines, step by step.
- `src/animations/`: one stick-figure file per movement pattern. `Figure.jsx` has the building blocks, `index.js` the registry.
- `src/screens/`: the four screens. `src/App.jsx` picks one based on the URL hash.
- `src/styles.css`: all app styles; colors are the custom properties at the top.

To add an exercise, copy a block in `exercises.js`, then run the check script.
