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
```

## Where things live

- `src/data/exercises.js`: muscle groups and every exercise (cues, prescription, alternatives).
- `src/data/routines.js`: the five routines, step by step.
- `src/animations/exercises/<id>.js`: one animation per exercise, named like its id. Each file lists poses (an angle per body segment), a timeline with the trainer's tempo, phase names, and equipment.
- `src/animations/engine/`: turns those files into SVG and CSS keyframes (`kinematics.js`), with helpers for writing poses (`helpers.js`) and the renderer (`Figure.jsx`).
- `src/screens/`: the four screens. `src/App.jsx` picks one based on the URL hash.
- `src/styles.css`: all app styles; colors are the custom properties at the top.

To add an exercise, copy a block in `exercises.js`, copy a similar animation file with the new id, and run the check script.
