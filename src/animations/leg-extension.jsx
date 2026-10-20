/*
 * leg-extension.jsx: pattern "leg-extension"
 * Side view, seated on the machine. The lower leg kicks up to straight
 * against the pad, then lowers slowly.
 * Used by: camilla de cuádriceps (normal e isométrica).
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function LegExtension() {
  return (
    <Figure>
      <Floor />
      {/* Machine: seat, backrest, post */}
      <Pad x={48} y={106} w={56} h={8} />
      <Gear from={[52, 106]} to={[52, 60]} />
      <Gear from={[76, 114]} to={[76, 148]} />
      {/* Seated body, still */}
      <Bone from={[70, 102]} to={[64, 68]} />
      <Head at={[62, 56]} />
      <Bone from={[64, 70]} to={[76, 100]} />
      <Bone from={[70, 102]} to={[100, 102]} />
      {/* Knee: the shin swings forward and up, pad on the ankle */}
      <Joint at={[100, 102]} turn={-80}>
        <Bone from={[100, 102]} to={[100, 132]} />
        <Disc at={[106, 127]} r={5} />
      </Joint>
    </Figure>
  );
}
