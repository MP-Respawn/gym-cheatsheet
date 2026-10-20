/*
 * lateral-raise.jsx: pattern "lateral-raise"
 * Front view, standing with dumbbells at the sides. Both arms rise out to
 * the sides up to shoulder height, then lower slowly.
 * Used by: vuelos laterales, vuelos laterales en polea.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function LateralRaise() {
  return (
    <Figure>
      <Floor />
      {/* Body, still */}
      <Bone from={[76, 92]} to={[68, 144]} />
      <Bone from={[84, 92]} to={[92, 144]} />
      <Bone from={[80, 92]} to={[80, 52]} />
      <Bone from={[66, 54]} to={[94, 54]} />
      <Head at={[80, 40]} />
      {/* Left arm rises out to the side */}
      <Joint at={[66, 54]} turn={82}>
        <Bone from={[66, 54]} to={[62, 94]} />
        <Disc at={[62, 99]} r={5} />
      </Joint>
      {/* Right arm mirrors it */}
      <Joint at={[94, 54]} turn={-82}>
        <Bone from={[94, 54]} to={[98, 94]} />
        <Disc at={[98, 99]} r={5} />
      </Joint>
    </Figure>
  );
}
