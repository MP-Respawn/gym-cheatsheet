/*
 * cable-fly.jsx: pattern "cable-fly"
 * Front view, standing between two high pulleys. The arms start wide open
 * and sweep down and in until the hands meet in front.
 * Used by: cruces de polea, aperturas con mancuernas.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint } from "./Figure.jsx";

export default function CableFly() {
  return (
    <Figure>
      <Floor />
      {/* Pulleys high on each side */}
      <Disc at={[14, 16]} r={5} />
      <Disc at={[146, 16]} r={5} />
      {/* Body, still */}
      <Bone from={[76, 92]} to={[68, 144]} />
      <Bone from={[84, 92]} to={[92, 144]} />
      <Bone from={[80, 92]} to={[80, 52]} />
      <Bone from={[66, 54]} to={[94, 54]} />
      <Head at={[80, 40]} />
      {/* Left arm with its cable handle, sweeping in */}
      <Joint at={[66, 54]} turn={-125}>
        <Gear from={[30, 40]} to={[18, 24]} />
        <Bone from={[66, 54]} to={[30, 40]} />
      </Joint>
      {/* Right arm mirrors it */}
      <Joint at={[94, 54]} turn={125}>
        <Gear from={[130, 40]} to={[142, 24]} />
        <Bone from={[94, 54]} to={[130, 40]} />
      </Joint>
    </Figure>
  );
}
