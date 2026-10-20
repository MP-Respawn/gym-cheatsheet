/*
 * hip-thrust.jsx: pattern "hip-thrust"
 * Side view. Upper back on a bench, bar on the hips. The hips drive up
 * until the torso is flat like a table, then lower.
 * Used by: hip thrust en punta de pie.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function HipThrust() {
  return (
    <Figure>
      <Floor />
      {/* Bench */}
      <Pad x={10} y={103} w={38} h={9} />
      <Gear from={[28, 112]} to={[28, 148]} />
      <Head at={[34, 93]} />
      {/* Shoulder on the bench edge: the torso rises to flat */}
      <Joint at={[46, 100]} turn={-43}>
        <Bone from={[46, 100]} to={[80, 132]} />
        <Bone from={[46, 100]} to={[76, 120]} />
        <Disc at={[80, 125]} r={7} />
        {/* Hip and knee rotate so the foot stays planted */}
        <Joint at={[80, 132]} turn={103}>
          <Bone from={[80, 132]} to={[106, 108]} />
          <Joint at={[106, 108]} turn={-27}>
            <Bone from={[106, 108]} to={[112, 144]} />
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
