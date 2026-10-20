/*
 * leg-raise.jsx: pattern "leg-raise"
 * Side view, lying on the back, shoulders slightly up. Straight legs rise
 * from the floor to vertical, holding a ball between the feet.
 * Used by: abdomen en pelota, vuelta de abdomen estirado, dead bug, elevación colgado.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function LegRaise() {
  return (
    <Figure>
      <Floor />
      {/* Torso and head, still, shoulders a bit off the floor */}
      <Bone from={[88, 141]} to={[48, 137]} />
      <Head at={[36, 131]} />
      <Bone from={[50, 139]} to={[80, 143]} />
      {/* Hip: the legs swing up, ball between the feet */}
      <Joint at={[88, 141]} turn={-80}>
        <Bone from={[88, 141]} to={[144, 141]} />
        <Disc at={[148, 134]} r={6} />
      </Joint>
    </Figure>
  );
}
