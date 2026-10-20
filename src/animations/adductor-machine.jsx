/*
 * adductor-machine.jsx: pattern "adductor-machine"
 * Front view, seated. Legs start wide open and squeeze together against the
 * pads on the inside of the knees.
 * Used by: máquina de aductores.
 */
import { Bone, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function AdductorMachine() {
  return (
    <Figure>
      <Floor />
      {/* Seat and post */}
      <Pad x={54} y={98} w={52} h={8} />
      <Gear from={[80, 106]} to={[80, 148]} />
      {/* Upper body, still, hands on the handles */}
      <Bone from={[80, 96]} to={[80, 52]} />
      <Bone from={[66, 54]} to={[94, 54]} />
      <Head at={[80, 40]} />
      <Bone from={[66, 54]} to={[58, 92]} />
      <Bone from={[94, 54]} to={[102, 92]} />
      <Bone from={[70, 96]} to={[90, 96]} />
      {/* Left leg closes inward, pad on the inner knee */}
      <Joint at={[70, 96]} turn={-22}>
        <Gear from={[57, 102]} to={[57, 116]} />
        <Bone from={[70, 96]} to={[50, 110]} />
        <Bone from={[50, 110]} to={[46, 140]} />
      </Joint>
      {/* Right leg mirrors it */}
      <Joint at={[90, 96]} turn={22}>
        <Gear from={[103, 102]} to={[103, 116]} />
        <Bone from={[90, 96]} to={[110, 110]} />
        <Bone from={[110, 110]} to={[114, 140]} />
      </Joint>
    </Figure>
  );
}
