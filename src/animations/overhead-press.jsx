/*
 * overhead-press.jsx: pattern "overhead-press"
 * Front view, standing. The bar starts at shoulder height and is pressed
 * straight up until the arms lock out overhead.
 * Used by: press militar con barra, press militar con mancuernas, press Arnold.
 */
import { Bone, Figure, Floor, Gear, Head, Joint } from "./Figure.jsx";

export default function OverheadPress() {
  return (
    <Figure>
      <Floor />
      {/* Body, still */}
      <Bone from={[76, 92]} to={[68, 144]} />
      <Bone from={[84, 92]} to={[92, 144]} />
      <Bone from={[80, 92]} to={[80, 52]} />
      <Bone from={[66, 54]} to={[94, 54]} />
      <Head at={[80, 40]} />
      {/* Bar rises from the shoulders to overhead */}
      <Joint shift={[0, -39]}>
        <Gear from={[44, 52]} to={[116, 52]} />
      </Joint>
      {/* Left arm: elbow swings up, forearm straightens */}
      <Joint at={[66, 54]} turn={146}>
        <Bone from={[66, 54]} to={[56, 72]} />
        <Joint at={[56, 72]} turn={-162}>
          <Bone from={[56, 72]} to={[60, 52]} />
        </Joint>
      </Joint>
      {/* Right arm mirrors it */}
      <Joint at={[94, 54]} turn={-146}>
        <Bone from={[94, 54]} to={[104, 72]} />
        <Joint at={[104, 72]} turn={162}>
          <Bone from={[104, 72]} to={[100, 52]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
