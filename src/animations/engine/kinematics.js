/*
 * kinematics.js
 *
 * The brain of the stick-figure animations. Pure JavaScript: no React, no
 * DOM, so the check script can also run it in Node.
 *
 * What it does, in plain words:
 *   1. Knows the human body as a list of segments (torso, thigh, forearm...)
 *      with their lengths.
 *   2. Takes an exercise "spec" (see any file in ../exercises/) that says, for
 *      each pose, which way every segment points.
 *   3. Works out where every joint lands in each pose (forward kinematics).
 *   4. Turns the timeline (pose after pose, with durations) into CSS
 *      @keyframes that rotate each body part around its joint.
 *
 * Angles: 0 = pointing up, 90 = pointing right, 180 = down, 270 = left.
 * Positive = clockwise. A segment's angle always means "from the joint
 * closer to the hip toward the joint farther from it": thigh = hip -> knee,
 * shin = knee -> ankle, forearm = elbow -> hand, torso = hip -> neck.
 *
 * Coordinates: a 160 x 160 drawing, x to the right, y DOWN. The floor line
 * sits at y = 148, so a foot resting on it is at y = 144.
 */

/* ------------------------------------------------------------------ */
/* The body                                                            */
/* ------------------------------------------------------------------ */

// Every segment: id, the joint it starts at, the joint it ends at, and its
// length in side view and in front view. In side view the pelvis and the
// collarbones have no width, so both legs and both arms start at one point.
export const SEGMENTS = [
  { id: "torso", from: "hip", to: "neck", side: 32, front: 32 },
  { id: "head", from: "neck", to: "head", side: 15, front: 15 },
  { id: "clavL", from: "neck", to: "shoulderL", side: 0, front: 13 },
  { id: "clavR", from: "neck", to: "shoulderR", side: 0, front: 13 },
  { id: "armL", from: "shoulderL", to: "elbowL", side: 21, front: 21 },
  { id: "forearmL", from: "elbowL", to: "handL", side: 20, front: 20 },
  { id: "armR", from: "shoulderR", to: "elbowR", side: 21, front: 21 },
  { id: "forearmR", from: "elbowR", to: "handR", side: 20, front: 20 },
  { id: "pelvisL", from: "hip", to: "hipL", side: 0, front: 6 },
  { id: "pelvisR", from: "hip", to: "hipR", side: 0, front: 6 },
  { id: "thighL", from: "hipL", to: "kneeL", side: 30, front: 30 },
  { id: "shinL", from: "kneeL", to: "ankleL", side: 30, front: 30 },
  { id: "footL", from: "ankleL", to: "toeL", side: 12, front: 8 },
  { id: "thighR", from: "hipR", to: "kneeR", side: 30, front: 30 },
  { id: "shinR", from: "kneeR", to: "ankleR", side: 30, front: 30 },
  { id: "footR", from: "ankleR", to: "toeR", side: 12, front: 8 },
];

export const SEGMENT_IDS = SEGMENTS.map((s) => s.id);
const SEGMENT_BY_ID = Object.fromEntries(SEGMENTS.map((s) => [s.id, s]));

export const JOINTS = [...new Set(SEGMENTS.flatMap((s) => [s.from, s.to]))];

/*
 * When a pose does not mention a segment, it keeps its angle RELATIVE to
 * the segment listed here (as it was in the start pose). So the head follows
 * the torso, the forearm follows the upper arm, and so on. Thighs follow
 * nothing: if a pose does not mention them they keep their absolute angle.
 */
export const FOLLOWS = {
  head: "torso",
  clavL: "torso",
  clavR: "torso",
  armL: "torso",
  armR: "torso",
  forearmL: "armL",
  forearmR: "armR",
  pelvisL: "torso",
  pelvisR: "torso",
  shinL: "thighL",
  shinR: "thighR",
  footL: "shinL",
  footR: "shinR",
};

export const FLOOR_Y = 148;
export const HEAD_RADIUS = 9;

// Easing names usable in a timeline step, mapped to CSS timing functions.
export const EASINGS = {
  smooth: "cubic-bezier(.45,0,.55,1)", // gentle start and stop (default)
  slow: "cubic-bezier(.35,0,.65,1)", // same idea, a bit more even
  fast: "cubic-bezier(.15,.85,.3,1)", // explosive: most of the move happens early
  in: "cubic-bezier(.55,0,.9,.5)", // starts slow and speeds up (falling)
  linear: "linear",
};

/* ------------------------------------------------------------------ */
/* Small geometry helpers                                              */
/* ------------------------------------------------------------------ */

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// Unit vector for an angle in our convention (0 up, clockwise).
export function direction(angle) {
  return [Math.sin(toRad(angle)), -Math.cos(toRad(angle))];
}

// Angle of the line from point a to point b, in our convention.
export function angleBetween(a, b) {
  return toDeg(Math.atan2(b[0] - a[0], -(b[1] - a[1])));
}

// Wraps any angle difference into the range (-180, 180].
function wrap(deg) {
  let d = ((deg + 180) % 360 + 360) % 360 - 180;
  if (d === -180) d = 180;
  return d;
}

const round = (n) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/* Spec -> poses                                                       */
/* ------------------------------------------------------------------ */

function lengthsFor(spec) {
  const view = spec.view === "front" ? "front" : "side";
  const out = {};
  for (const s of SEGMENTS) out[s.id] = spec.lengths?.[s.id] ?? s[view];
  return out;
}

// Fills in every segment angle of one pose, using FOLLOWS for the missing ones.
function resolvePose(start, partial) {
  const out = {};
  for (const id of SEGMENT_IDS) {
    if (partial && id in partial) out[id] = partial[id];
    else if (partial && FOLLOWS[id]) out[id] = out[FOLLOWS[id]] + (start[id] - start[FOLLOWS[id]]);
    else out[id] = start[id];
  }
  out.$root = partial?.$root ?? [0, 0];
  return out;
}

/*
 * Builds the skeleton as a tree that grows outward from the root joint (the
 * joint that stays put: a planted foot, the hips on a seat, the hands on a
 * bar...). Each "bone" is a segment oriented away from the root.
 */
function buildTree(rootJoint) {
  const byJoint = {};
  for (const s of SEGMENTS) {
    (byJoint[s.from] ??= []).push(s);
    (byJoint[s.to] ??= []).push(s);
  }
  const bones = [];
  const used = new Set();
  const parentOfJoint = { [rootJoint]: null };
  const queue = [rootJoint];
  while (queue.length) {
    const joint = queue.shift();
    for (const seg of byJoint[joint] ?? []) {
      if (used.has(seg.id)) continue;
      used.add(seg.id);
      const reversed = seg.from !== joint; // true when the bone runs distal -> proximal
      const end = reversed ? seg.from : seg.to;
      const bone = { seg: seg.id, start: joint, end, reversed, parent: parentOfJoint[joint], children: [] };
      bones.push(bone);
      if (bone.parent) bone.parent.children.push(bone);
      parentOfJoint[end] = bone;
      queue.push(end);
    }
  }
  return bones;
}

// Places every joint for one fully-resolved pose.
function forwardKinematics(bones, lengths, pose, rootJoint, rootAt) {
  const pos = { [rootJoint]: [rootAt[0] + pose.$root[0], rootAt[1] + pose.$root[1]] };
  const boneAngle = {};
  for (const b of bones) {
    const a = pose[b.seg] + (b.reversed ? 180 : 0);
    boneAngle[b.seg] = a;
    const [dx, dy] = direction(a);
    const p = pos[b.start];
    pos[b.end] = [p[0] + dx * lengths[b.seg], p[1] + dy * lengths[b.seg]];
  }
  return { pos, boneAngle };
}

// A "point reference" in props: a joint name, or a list of joints (= their midpoint).
function refPoint(ref, pos) {
  if (Array.isArray(ref)) {
    const pts = ref.map((r) => pos[r]);
    return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  }
  return pos[ref];
}

/* ------------------------------------------------------------------ */
/* compile(): spec -> everything the renderer needs                     */
/* ------------------------------------------------------------------ */

export function compile(spec, id) {
  const problems = [];
  const viewBox = spec.viewBox ?? [0, 0, 160, 160];
  // Pivots are measured from the drawing's 0,0 corner; browsers disagree on
  // how to handle a viewBox that starts elsewhere, so it must start at 0,0.
  // To zoom in, use a smaller viewBox like [0, 0, 90, 90] and draw near it.
  if (viewBox[0] !== 0 || viewBox[1] !== 0) problems.push("viewBox tiene que empezar en 0,0");
  const lengths = lengthsFor(spec);
  const rootJoint = spec.root;
  if (!JOINTS.includes(rootJoint)) throw new Error(`root "${rootJoint}" no es una articulación conocida`);

  for (const segId of SEGMENT_IDS) {
    if (typeof spec.start?.[segId] !== "number") problems.push(`start: falta el ángulo de "${segId}"`);
  }
  for (const [name, pose] of Object.entries(spec.poses ?? {})) {
    for (const key of Object.keys(pose)) {
      if (key !== "$root" && !SEGMENT_BY_ID[key]) problems.push(`pose "${name}": segmento desconocido "${key}"`);
    }
  }

  const steps = spec.timeline ?? [];
  if (steps.length === 0) problems.push("timeline vacío");
  for (const st of steps) {
    if (st.to !== "start" && !spec.poses?.[st.to]) problems.push(`timeline: pose desconocida "${st.to}"`);
    if (!(st.s > 0)) problems.push(`timeline: duración inválida en "${st.to}"`);
    if (st.ease && !EASINGS[st.ease]) problems.push(`timeline: easing desconocido "${st.ease}"`);
  }
  if (steps.length && steps[steps.length - 1].to !== "start") {
    problems.push('timeline: el último paso tiene que volver a "start" para que el loop no salte');
  }
  if (problems.length) {
    const err = new Error(problems.join("\n"));
    err.problems = problems;
    throw err;
  }

  // Resolve every pose and every frame of the timeline.
  const start = resolvePose(spec.start, null);
  const resolved = { start };
  for (const [name, p] of Object.entries(spec.poses ?? {})) resolved[name] = resolvePose(spec.start, p);

  const bones = buildTree(rootJoint);
  const frames = [{ pose: "start", time: 0 }];
  let t = 0;
  for (const st of steps) {
    t += st.s;
    frames.push({ pose: st.to, time: t });
  }
  const duration = t;
  const fk = frames.map((f) => forwardKinematics(bones, lengths, resolved[f.pose], rootJoint, spec.at));
  const pos0 = fk[0].pos;

  // Keyframe percentages and the easing of the move that starts at each frame.
  const pct = frames.map((f) => round((f.time / duration) * 100));
  const easeAfter = frames.map((_, k) => EASINGS[steps[k]?.ease ?? "smooth"]);

  const origin = (p) => `${round(p[0])}px ${round(p[1])}px`;

  let css = "";
  let counter = 0;
  const animName = () => `fig-${id}-${counter++}`;

  // Writes one @keyframes block and returns its name.
  function keyframes(values) {
    const name = animName();
    const body = values
      .map((v, k) => {
        const ease = k < values.length - 1 ? `animation-timing-function:${easeAfter[k]};` : "";
        return `${pct[k]}%{transform:${v};${ease}}`;
      })
      .join("");
    css += `@keyframes ${name}{${body}}\n`;
    return name;
  }

  // Side view: the far-side limbs (L) are drawn darker and behind.
  const view = spec.view === "front" ? "front" : "side";
  const farSet = new Set(spec.far ?? (view === "side" ? SEGMENT_IDS.filter((s) => s.endsWith("L")) : []));
  const hidden = new Set(spec.hide ?? []);

  // ---- Bones: rotation of each one, relative to its parent ----
  const total = {}; // total rotation of each bone at each frame
  const boneOut = {};
  for (const b of bones) {
    const raw = fk.map((f) => f.boneAngle[b.seg]);
    const unwrapped = [raw[0]];
    for (let k = 1; k < raw.length; k++) unwrapped.push(unwrapped[k - 1] + wrap(raw[k] - raw[k - 1]));
    total[b.seg] = unwrapped.map((a) => a - unwrapped[0]);
    const parentTotal = b.parent ? total[b.parent.seg] : frames.map(() => 0);
    const own = total[b.seg].map((r, k) => round(r - parentTotal[k]));
    const isTop = !b.parent;
    const shifts = fk.map((f, k) => resolved[frames[k].pose].$root);
    const moves = own.some((r) => Math.abs(r) > 0.01) || (isTop && shifts.some((s) => s[0] !== 0 || s[1] !== 0));
    let anim = null;
    if (moves) {
      anim = keyframes(
        own.map((r, k) => (isTop ? `translate(${round(shifts[k][0])}px,${round(shifts[k][1])}px) rotate(${r}deg)` : `rotate(${r}deg)`)),
      );
    }
    const seg = SEGMENT_BY_ID[b.seg];
    boneOut[b.seg] = {
      seg: b.seg,
      layer: farSet.has(b.seg) ? "far" : "near",
      hidden: hidden.has(b.seg) || lengths[b.seg] === 0,
      start: pos0[b.start],
      end: pos0[b.end],
      // the head is drawn as a short neck plus a circle at the head joint
      head: b.seg === "head" ? { at: pos0[seg.to], from: pos0[seg.from] } : null,
      anim,
      origin: origin(pos0[b.start]),
      props: [],
      children: [],
      parentSeg: b.parent?.seg ?? null,
    };
  }
  const tree = [];
  for (const b of bones) {
    const out = boneOut[b.seg];
    if (out.parentSeg) boneOut[out.parentSeg].children.push(out);
    else tree.push(out);
  }

  // ---- Props (equipment) ----
  const loose = { back: [], mid: [], front: [] };

  for (const prop of spec.props ?? []) {
    const shape = { ...prop };

    if (prop.on) {
      // Attached to a body segment: drawn inside that segment's group, so it
      // moves with it. Coordinates are offsets from the attach point.
      const seg = SEGMENT_BY_ID[prop.on];
      if (!seg) throw new Error(`prop: segmento desconocido "${prop.on}"`);
      const a = pos0[seg.from];
      const b = pos0[seg.to];
      const f = prop.at ?? 1;
      const p = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      shape.base = p; // the shape's offsets are measured from here
      shape.layer = prop.layer ?? boneOut[prop.on].layer;
      boneOut[prop.on].props.push(shape);
      continue;
    }

    if (prop.kind === "span") {
      // A straight bar between two moving points (both hands on a barbell).
      const ends = fk.map((f) => [refPoint(prop.from, f.pos), refPoint(prop.to, f.pos)]);
      const mids = ends.map(([p, q]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
      const rawAng = ends.map(([p, q]) => angleBetween(p, q));
      const ang = [rawAng[0]];
      for (let k = 1; k < rawAng.length; k++) ang.push(ang[k - 1] + wrap(rawAng[k] - rawAng[k - 1]));
      const [p0, q0] = ends[0];
      const half = Math.hypot(q0[0] - p0[0], q0[1] - p0[1]) / 2 + (prop.extend ?? 0);
      const [ux, uy] = direction(rawAng[0]);
      shape.kind = "line";
      shape.from = [mids[0][0] - ux * half, mids[0][1] - uy * half];
      shape.to = [mids[0][0] + ux * half, mids[0][1] + uy * half];
      shape.cls = prop.cls ?? "gear bar";
      shape.anim = keyframes(
        mids.map((m, k) => `translate(${round(m[0] - mids[0][0])}px,${round(m[1] - mids[0][1])}px) rotate(${round(ang[k] - ang[0])}deg)`),
      );
      shape.origin = origin(mids[0]);
      loose[prop.layer ?? "front"].push(shape);
      continue;
    }

    if (prop.kind === "cable") {
      // A cable or elastic band from a fixed anchor to a moving point. It
      // rotates AND stretches so both ends always stay attached.
      const A = prop.anchor;
      const targets = fk.map((f) => refPoint(prop.to, f.pos));
      const rawAng = targets.map((p) => toDeg(Math.atan2(p[1] - A[1], p[0] - A[0])));
      const ang = [rawAng[0]];
      for (let k = 1; k < rawAng.length; k++) ang.push(ang[k - 1] + wrap(rawAng[k] - rawAng[k - 1]));
      const len0 = Math.hypot(targets[0][0] - A[0], targets[0][1] - A[1]) || 1;
      shape.kind = "line";
      shape.from = A;
      shape.to = targets[0];
      shape.cls = prop.band ? "band" : "cable";
      shape.anim = keyframes(
        targets.map((p, k) => {
          const s = Math.hypot(p[0] - A[0], p[1] - A[1]) / len0;
          return `rotate(${round(ang[k])}deg) scaleX(${round(s)}) rotate(${round(-ang[0])}deg)`;
        }),
      );
      shape.origin = origin(A);
      loose[prop.layer ?? "mid"].push(shape);
      continue;
    }

    // Plain equipment in a fixed place, optionally sliding per pose
    // (weight stacks, a leg-press sled): shift = { poseName: [dx, dy] }.
    if (prop.shift) {
      const moves = frames.map((f) => prop.shift[f.pose] ?? [0, 0]);
      shape.anim = keyframes(moves.map((m) => `translate(${round(m[0])}px,${round(m[1])}px)`));
      shape.origin = "0px 0px";
    }
    loose[prop.layer ?? "back"].push(shape);
  }

  // Which bones have something to draw in each layer (to skip empty groups).
  function mark(node) {
    node.has = { far: false, near: false };
    for (const layer of ["far", "near"]) {
      if ((node.layer === layer && !node.hidden) || (node.layer === layer && node.head)) node.has[layer] = true;
      if (node.props.some((p) => p.layer === layer)) node.has[layer] = true;
    }
    for (const c of node.children) {
      mark(c);
      node.has.far ||= c.has.far;
      node.has.near ||= c.has.near;
    }
  }
  tree.forEach(mark);

  // ---- Phase labels (shown under the big animation) ----
  const labels = [];
  steps.forEach((st, k) => {
    if (!st.say) return;
    let label = labels.find((l) => l.text === st.say);
    if (!label) labels.push((label = { text: st.say, ranges: [] }));
    const from = pct[k];
    const to = pct[k + 1];
    const last = label.ranges[label.ranges.length - 1];
    if (last && last[1] === from) last[1] = to;
    else label.ranges.push([from, to]);
  });
  for (const label of labels) {
    const name = animName();
    const points = new Map([[0, false], [100, false]]);
    for (const [a, b] of label.ranges) {
      if (!points.has(b) || points.get(b) === false) points.set(b, false);
      points.set(a, true);
    }
    const body = [...points.entries()]
      .sort((x, y) => x[0] - y[0])
      .map(([p, on]) => `${p}%{opacity:${on ? 1 : 0.38};color:${on ? "var(--accent)" : "var(--muted)"}}`)
      .join("");
    css += `@keyframes ${name}{${body}}\n`;
    label.anim = name;
  }

  return {
    id,
    viewBox,
    floor: spec.floor === false ? null : (spec.floor ?? FLOOR_Y),
    stroke: spec.stroke ?? null,
    duration: round(duration),
    tree,
    loose,
    labels,
    css,
    // for the check script
    frames: frames.map((f, k) => ({ ...f, pos: fk[k].pos })),
  };
}

/* ------------------------------------------------------------------ */
/* validate(): sanity checks used by scripts/check-data.mjs             */
/* ------------------------------------------------------------------ */

export function validate(spec, id) {
  let compiled;
  try {
    compiled = compile(spec, id);
  } catch (e) {
    return e.problems ?? [e.message];
  }
  const problems = [];
  const [vx, vy, vw, vh] = compiled.viewBox;
  const hidden = new Set(spec.hide ?? []);
  const hiddenJoints = new Set(
    SEGMENTS.filter((s) => hidden.has(s.id)).map((s) => s.to),
  );
  for (const frame of compiled.frames) {
    for (const [joint, [x, y]] of Object.entries(frame.pos)) {
      if (hiddenJoints.has(joint)) continue;
      const pad = joint === "head" ? HEAD_RADIUS : 2;
      if (x < vx + pad - 0.5 || x > vx + vw - pad + 0.5 || y < vy + pad - 0.5 || y > vy + vh - pad + 0.5) {
        problems.push(`pose "${frame.pose}": "${joint}" queda fuera del cuadro (${x.toFixed(0)}, ${y.toFixed(0)})`);
      }
      if (compiled.floor !== null) {
        const limit = joint === "head" ? compiled.floor - 1 - HEAD_RADIUS : compiled.floor - 2.5;
        if (y > limit + 0.01) {
          problems.push(`pose "${frame.pose}": "${joint}" atraviesa el piso (y = ${y.toFixed(1)})`);
        }
      }
    }
  }
  return [...new Set(problems)];
}
