/*
 * Figure.jsx
 *
 * The small set of building blocks every stick-figure animation is made of.
 * Each animation file (squat.jsx, lunge.jsx, ...) only combines these pieces,
 * so if you want to change the look of ALL figures (thickness, colors), this
 * file and animations.css are the only places to touch.
 *
 * How the motion works, in plain words:
 *   - A body is a chain of joints: ankle -> knee -> hip -> shoulder...
 *   - Each <Joint> is a hinge. Everything inside it rotates around the point
 *     given in `at`. Joints can be nested, so rotating the knee also carries
 *     the hip, torso and head that hang from it, like a real skeleton.
 *   - The drawing as written is the START pose. `turn` says how many degrees
 *     the hinge rotates to reach the END pose (positive = clockwise).
 *   - CSS then loops start -> end -> start forever (see animations.css).
 *   - If the phone has "reduce motion" turned on, CSS disables the loop and
 *     you just see the start pose.
 *
 * Coordinates: every figure lives in a 160 x 160 box. x grows to the right,
 * y grows DOWNWARD (so y = 148 is near the floor, y = 20 near the top).
 */

/* The outer SVG box. `dur` is the seconds for one way (start -> end). */
export function Figure({ children, dur = 1.6 }) {
  return (
    <svg
      className="figure"
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
      style={{ "--dur": `${dur}s` }}
    >
      {children}
    </svg>
  );
}

/* One body segment (thigh, shin, arm...): a thick line with round ends. */
export function Bone({ from, to }) {
  return <line className="bone" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />;
}

/* The head: a filled circle. */
export function Head({ at, r = 9 }) {
  return <circle className="head" cx={at[0]} cy={at[1]} r={r} />;
}

/*
 * A hinge. Props:
 *   at     [x, y] of the pivot point
 *   turn   degrees to rotate at the end pose. A single number loops
 *          start -> end -> start. A pair [a, b] does a three-pose cycle:
 *          start -> a -> b -> start (used for sways and side-to-side moves).
 *   shift  [dx, dy] to slide the whole joint (or a pair [[dx,dy],[dx,dy]] for
 *          a cycle). Used when something moves without rotating, like a bar.
 * With neither `turn` nor `shift`, it is just a plain, still group.
 */
export function Joint({ at = [0, 0], turn, shift, children }) {
  const moves = turn !== undefined || shift !== undefined;
  if (!moves) return <g>{children}</g>;

  // Normalize to "list of poses" so the single and cycle cases share code.
  const cycle = Array.isArray(turn) || Array.isArray(shift?.[0]);
  const turns = Array.isArray(turn) ? turn : [turn ?? 0];
  const shifts = Array.isArray(shift?.[0]) ? shift : [shift ?? [0, 0]];

  // CSS reads these variables inside the shared @keyframes.
  const style = { transformOrigin: `${at[0]}px ${at[1]}px` };
  for (let i = 0; i < (cycle ? 2 : 1); i++) {
    const n = i + 1;
    style[`--r${n}`] = `${turns[i] ?? 0}deg`;
    style[`--x${n}`] = `${(shifts[i] ?? [0, 0])[0]}px`;
    style[`--y${n}`] = `${(shifts[i] ?? [0, 0])[1]}px`;
  }

  return (
    <g className={cycle ? "joint cycle" : "joint"} style={style}>
      {children}
    </g>
  );
}

/* ---- Equipment, drawn thinner and in a muted color ---- */

/* A straight piece of equipment: barbell, cable, bench edge, wall. */
export function Gear({ from, to }) {
  return <line className="gear" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />;
}

/* A rectangle: bench pad, seat, step. */
export function Pad({ x, y, w, h }) {
  return <rect className="gear" x={x} y={y} width={w} height={h} rx="2" />;
}

/* A circle: barbell plate seen from the side, dumbbell, ball, pulley. */
export function Disc({ at, r = 6 }) {
  return <circle className="gear" cx={at[0]} cy={at[1]} r={r} />;
}

/* The floor line most standing and lying figures rest on. */
export function Floor({ y = 148 }) {
  return <Gear from={[8, y]} to={[152, y]} />;
}
