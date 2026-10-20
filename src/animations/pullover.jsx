/*
 * pullover.jsx: pattern "pullover"
 * Side view, lying on a flat bench. Straight arms hold a dumbbell above the
 * chest and swing it back behind the head in a wide arc, then return.
 * Used by: pullover.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function Pullover() {
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
      {/* Shoulder: the straight arm swings back past the head */}
      <Joint at={[100, 104]} turn={95}>
        <Bone from={[100, 104]} to={[100, 62]} />
        <Disc at={[100, 57]} r={6} />
      </Joint>
    </Figure>
  );
}
