/*
 * side-plank.jsx: pattern "side-plank"
 * Front view. Side plank on a straight arm, top arm reaching up. The hips
 * dip a little and lift back up, to show where the work is.
 * Used by: plancha lateral.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function SidePlank() {
  return (
    <Figure dur={2}>
      <Floor />
      {/* Legs pivot on the feet: the hip dips */}
      <Joint at={[24, 142]} turn={4}>
        <Bone from={[24, 142]} to={[68, 120]} />
        {/* Torso counter-rotates so the shoulder stays over the hand */}
        <Joint at={[68, 120]} turn={-7}>
          <Bone from={[68, 120]} to={[112, 98]} />
          <Head at={[124, 92]} />
          <Bone from={[112, 98]} to={[112, 141]} />
          <Bone from={[112, 98]} to={[112, 58]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
