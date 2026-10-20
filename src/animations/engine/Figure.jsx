/*
 * Figure.jsx
 *
 * Draws a compiled stick figure (see kinematics.js) as an inline SVG.
 *
 * Drawing order, back to front:
 *   1. floor and fixed equipment (bench, rack, machine frame)
 *   2. far-side limbs, in a darker color, so they read as "behind"
 *   3. cables and bands
 *   4. the near-side body
 *   5. bars held in both hands
 *
 * The body is drawn as nested groups: each segment is a group that rotates
 * around its joint, and everything attached further out lives inside it.
 * The far and near passes repeat the same nesting with the same animations,
 * so they always move together.
 */

// Keyframes are added once per figure into a single <style> tag in <head>.
const injected = new Set();
let styleTag = null;
function injectKeyframes(compiled) {
  if (injected.has(compiled.id) || typeof document === "undefined") return;
  injected.add(compiled.id);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "figure-keyframes";
    document.head.appendChild(styleTag);
  }
  styleTag.appendChild(document.createTextNode(compiled.css));
}

// Inline style that plays one keyframes animation around a pivot point.
function motion(name, origin, duration) {
  return { animation: `${name} ${duration}s linear infinite`, transformOrigin: origin };
}

/* One piece of equipment. `base` is set for things attached to the body:
   their coordinates are offsets from that point. */
function Shape({ s }) {
  const [ax, ay] = s.base ?? [0, 0];
  const cls = s.cls ?? (s.fill ? "gear-fill" : "gear");
  switch (s.kind) {
    case "disc":
      // fixed discs give their center in `c`; attached ones an offset dx/dy
      return s.c ? (
        <circle className={cls} cx={s.c[0]} cy={s.c[1]} r={s.r ?? 6} />
      ) : (
        <circle className={cls} cx={ax + (s.dx ?? 0)} cy={ay + (s.dy ?? 0)} r={s.r ?? 6} />
      );
    case "line":
      return <line className={cls} x1={ax + s.from[0]} y1={ay + s.from[1]} x2={ax + s.to[0]} y2={ay + s.to[1]} />;
    case "rect":
      return <rect className={cls} x={ax + s.x} y={ay + s.y} width={s.w} height={s.h} rx={s.rx ?? 2} />;
    case "path":
      return <path className={cls} d={s.d} />;
    default:
      return null;
  }
}

/* A shape that may have its own animation (weight stack, bar, cable). */
function LooseShape({ s, duration }) {
  if (!s.anim) return <Shape s={s} />;
  return (
    <g className="mv" style={motion(s.anim, s.origin, duration)}>
      <Shape s={s} />
    </g>
  );
}

/* One body segment and everything that hangs from it, for one layer. */
function BoneGroup({ bone, layer, duration }) {
  if (!bone.has[layer]) return null;
  const mine = bone.layer === layer;
  const content = (
    <>
      {mine && !bone.hidden && !bone.head && (
        <line className={layer === "far" ? "bone far" : "bone"} x1={bone.start[0]} y1={bone.start[1]} x2={bone.end[0]} y2={bone.end[1]} />
      )}
      {mine && bone.head && <Head bone={bone} />}
      {bone.props
        .filter((p) => p.layer === layer)
        .map((p, i) => (
          <Shape key={i} s={p} />
        ))}
      {bone.children.map((child) => (
        <BoneGroup key={child.seg} bone={child} layer={layer} duration={duration} />
      ))}
    </>
  );
  if (!bone.anim) return <g>{content}</g>;
  return (
    <g className="mv" style={motion(bone.anim, bone.origin, duration)}>
      {content}
    </g>
  );
}

/* Neck stub plus a filled circle for the head. */
function Head({ bone }) {
  const { at, from } = bone.head;
  const dx = at[0] - from[0];
  const dy = at[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const neckEnd = [at[0] - (dx / len) * 9, at[1] - (dy / len) * 9];
  return (
    <>
      <line className="bone" x1={from[0]} y1={from[1]} x2={neckEnd[0]} y2={neckEnd[1]} />
      <circle className="head" cx={at[0]} cy={at[1]} r={9} />
    </>
  );
}

export default function Figure({ compiled }) {
  injectKeyframes(compiled);
  const { viewBox, floor, duration, tree, loose, stroke } = compiled;
  const style = stroke ? { "--stroke": stroke } : undefined;

  return (
    <svg className="figure" viewBox={viewBox.join(" ")} aria-hidden="true" focusable="false" style={style}>
      {floor !== null && <line className="gear" x1={viewBox[0] + 6} y1={floor} x2={viewBox[0] + viewBox[2] - 6} y2={floor} />}
      {loose.back.map((s, i) => (
        <LooseShape key={`b${i}`} s={s} duration={duration} />
      ))}
      {tree.map((b) => (
        <BoneGroup key={`far-${b.seg}`} bone={b} layer="far" duration={duration} />
      ))}
      {loose.mid.map((s, i) => (
        <LooseShape key={`m${i}`} s={s} duration={duration} />
      ))}
      {tree.map((b) => (
        <BoneGroup key={`near-${b.seg}`} bone={b} layer="near" duration={duration} />
      ))}
      {loose.front.map((s, i) => (
        <LooseShape key={`f${i}`} s={s} duration={duration} />
      ))}
    </svg>
  );
}
