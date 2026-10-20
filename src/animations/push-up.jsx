/*
 * push-up.jsx: pattern "push-up"
 * Side view. Straight-arm plank, then the straight body lowers toward the
 * floor as the elbows bend, and pushes back up.
 * Used by: flexiones, fondos en paralelas, fondos en banco.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function PushUp() {
  return (
    <Figure>
      <Floor />
      {/* Toes: the whole straight body pivots here */}
      <Joint at={[24, 140]} turn={15}>
        <Bone from={[24, 140]} to={[110, 104]} />
        <Head at={[123, 99]} />
        {/* Shoulder and elbow bend so the hand stays on the floor */}
        <Joint at={[110, 104]} turn={69}>
          <Bone from={[110, 104]} to={[110, 124]} />
          <Joint at={[110, 124]} turn={-132}>
            <Bone from={[110, 124]} to={[110, 141]} />
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
