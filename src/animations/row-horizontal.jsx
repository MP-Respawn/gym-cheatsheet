/*
 * row-horizontal.jsx: pattern "row-horizontal"
 * Side view, seated cable row. Arms start reaching forward, then the elbows
 * pull straight back close to the body, hands to the belly.
 * Used by: remo bajo con barra, remo con mancuerna, remo en máquina, remo en polea baja.
 */
import { Bone, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function RowHorizontal() {
  return (
    <Figure>
      <Floor />
      {/* Low bench and foot plate */}
      <Pad x={30} y={124} w={44} h={8} />
      <Gear from={[118, 104]} to={[118, 134]} />
      {/* Seated body, still, feet against the plate */}
      <Bone from={[54, 120]} to={[54, 84]} />
      <Head at={[54, 72]} />
      <Bone from={[54, 120]} to={[84, 106]} />
      <Bone from={[84, 106]} to={[110, 124]} />
      <Bone from={[110, 124]} to={[114, 114]} />
      {/* Shoulder: the elbow travels back */}
      <Joint at={[54, 86]} turn={143}>
        <Bone from={[54, 86]} to={[75, 89]} />
        {/* Elbow: forearm stays level; the cable runs off to the pulley */}
        <Joint at={[75, 89]} turn={-146}>
          <Gear from={[96, 92]} to={[180, 104]} />
          <Bone from={[75, 89]} to={[96, 92]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
