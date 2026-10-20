/*
 * incline-press.jsx: pattern "incline-press"
 * Side view, reclined on an incline bench. The bar comes down from locked
 * out to the upper chest and is pressed back up.
 * Used by: pecho a 45 grados con barra, press inclinado con mancuernas.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function InclinePress() {
  return (
    <Figure>
      <Floor />
      {/* Incline backrest, seat and post */}
      <Gear from={[75, 123]} to={[45, 95]} />
      <Pad x={72} y={122} w={30} h={7} />
      <Gear from={[84, 129]} to={[84, 148]} />
      {/* Reclined body, legs to the floor */}
      <Bone from={[80, 118]} to={[50, 90]} />
      <Head at={[41, 81]} />
      <Bone from={[80, 118]} to={[108, 114]} />
      <Bone from={[108, 114]} to={[110, 144]} />
      {/* Shoulder: elbow drops down and back */}
      <Joint at={[50, 90]} turn={115}>
        <Bone from={[50, 90]} to={[50, 69]} />
        {/* Elbow: hand comes over the upper chest */}
        <Joint at={[50, 69]} turn={-141}>
          <Bone from={[50, 69]} to={[50, 48]} />
          <Disc at={[50, 43]} r={6} />
        </Joint>
      </Joint>
    </Figure>
  );
}
