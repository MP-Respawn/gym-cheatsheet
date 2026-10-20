/*
 * abductor-machine.jsx: pattern "abductor-machine"
 * Front view, seated. Legs start together and push outward against the
 * pads on the outside of the knees (glúteo medio).
 * Used by: máquina de abductores, clamshell con banda.
 */
import { Bone, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function AbductorMachine() {
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
      <Bone from={[72, 96]} to={[88, 96]} />
      {/* Left leg opens outward, pad on the outer knee */}
      <Joint at={[72, 96]} turn={22}>
        <Gear from={[57, 104]} to={[57, 118]} />
        <Bone from={[72, 96]} to={[64, 112]} />
        <Bone from={[64, 112]} to={[64, 142]} />
      </Joint>
      {/* Right leg mirrors it */}
      <Joint at={[88, 96]} turn={-22}>
        <Gear from={[103, 104]} to={[103, 118]} />
        <Bone from={[88, 96]} to={[96, 112]} />
        <Bone from={[96, 112]} to={[96, 142]} />
      </Joint>
    </Figure>
  );
}
