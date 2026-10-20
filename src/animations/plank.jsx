/*
 * plank.jsx: pattern "plank"
 * Side view. Forearm plank, body in one straight line. It is an isometric
 * hold, so the motion is only a slow, small "breathing" rise.
 * Used by: plancha frontal, plancha con apoyo en banco.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Plank() {
  return (
    <Figure dur={2}>
      <Floor />
      {/* The whole body pivots slightly on the toes */}
      <Joint at={[28, 142]} turn={-2}>
        <Bone from={[28, 142]} to={[110, 114]} />
        <Head at={[122, 110]} />
        {/* Upper arm counter-rotates so the forearm stays on the floor */}
        <Joint at={[110, 114]} turn={2}>
          <Bone from={[110, 114]} to={[110, 141]} />
          <Bone from={[110, 141]} to={[130, 141]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
