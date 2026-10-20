/*
 * copenhagen.jsx: pattern "copenhagen"
 * SIMPLIFIED. Front view: side plank on the forearm with the top foot on a
 * bench. The bottom leg lifts from the floor up to meet the top leg.
 * Used by: planchas Copenhague.
 */
import { Bone, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function Copenhagen() {
  return (
    <Figure>
      <Floor />
      {/* Bench holding the top foot */}
      <Pad x={8} y={98} w={36} h={8} />
      <Gear from={[26, 106]} to={[26, 148]} />
      {/* Body line: top leg on the bench, torso, head */}
      <Bone from={[34, 95]} to={[74, 104]} />
      <Bone from={[74, 104]} to={[116, 110]} />
      <Head at={[128, 110]} />
      {/* Supporting forearm on the floor, top arm along the body */}
      <Bone from={[116, 110]} to={[116, 141]} />
      <Bone from={[116, 141]} to={[136, 141]} />
      <Bone from={[112, 106]} to={[92, 98]} />
      {/* Hip: the bottom leg rises toward the top leg */}
      <Joint at={[74, 104]} turn={45}>
        <Bone from={[74, 104]} to={[48, 140]} />
      </Joint>
    </Figure>
  );
}
