/*
 * bench-press.jsx: pattern "bench-press"
 * Side view, lying on a flat bench. The bar starts locked out above the
 * chest, comes down as the elbows drop, and is pressed back up.
 * Used by: press plano con mancuernas, press plano con barra.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function BenchPress() {
  return (
    <Figure>
      <Floor />
      {/* Flat bench */}
      <Pad x={26} y={108} w={92} h={8} />
      <Gear from={[40, 116]} to={[40, 148]} />
      <Gear from={[104, 116]} to={[104, 148]} />
      {/* Body lying down, feet on the floor */}
      <Bone from={[50, 104]} to={[100, 104]} />
      <Head at={[113, 100]} />
      <Bone from={[50, 104]} to={[28, 108]} />
      <Bone from={[28, 108]} to={[22, 144]} />
      {/* Shoulder: upper arm drops toward the floor */}
      <Joint at={[100, 104]} turn={-120}>
        <Bone from={[100, 104]} to={[100, 83]} />
        {/* Elbow: forearm stays vertical under the bar */}
        <Joint at={[100, 83]} turn={120}>
          <Bone from={[100, 83]} to={[100, 62]} />
          <Disc at={[100, 57]} r={6} />
        </Joint>
      </Joint>
    </Figure>
  );
}
