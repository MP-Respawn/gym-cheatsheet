/*
 * leg-curl.jsx: pattern "leg-curl"
 * Side view, lying face down on the machine. The lower leg curls up toward
 * the glutes against the pad, then lowers slowly.
 * Used by: camilla de isquios.
 */
import { Bone, Disc, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function LegCurl() {
  return (
    <Figure>
      <Floor />
      {/* Machine bench */}
      <Pad x={36} y={104} w={96} h={8} />
      <Gear from={[50, 112]} to={[50, 148]} />
      <Gear from={[118, 112]} to={[118, 148]} />
      {/* Body lying face down, hands on the front handles */}
      <Bone from={[80, 98]} to={[114, 98]} />
      <Head at={[127, 94]} />
      <Bone from={[114, 100]} to={[122, 118]} />
      <Bone from={[80, 98]} to={[52, 98]} />
      {/* Knee: the shin curls up, pad behind the ankle */}
      <Joint at={[52, 98]} turn={95}>
        <Bone from={[52, 98]} to={[24, 98]} />
        <Disc at={[28, 91]} r={5} />
      </Joint>
    </Figure>
  );
}
