/*
 * calf-raise.jsx: pattern "calf-raise"
 * Side view, standing. The heel lifts and the whole body rises onto the
 * toes, then lowers all the way down.
 * Used by: gemelos de pie, a un pie, en máquina, en prensa, sentado.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function CalfRaise() {
  return (
    <Figure dur={1.2}>
      <Floor />
      {/* Foot pivots on the toes, lifting the heel */}
      <Joint at={[92, 144]} turn={42}>
        <Bone from={[80, 144]} to={[92, 144]} />
      </Joint>
      {/* The rest of the body slides up and a bit forward with the ankle */}
      <Joint shift={[3, -8]}>
        <Bone from={[80, 144]} to={[80, 114]} />
        <Bone from={[80, 114]} to={[80, 84]} />
        <Bone from={[80, 84]} to={[80, 48]} />
        <Head at={[80, 37]} />
        <Bone from={[82, 54]} to={[82, 94]} />
        <Disc at={[82, 98]} r={5} />
      </Joint>
    </Figure>
  );
}
