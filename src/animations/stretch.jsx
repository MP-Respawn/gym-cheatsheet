/*
 * stretch.jsx: pattern "stretch"
 * Side view, sitting on the floor with straight legs. The torso folds
 * forward over the legs, hands reaching for the feet (posterior chain).
 * Used by: flexibilidad de cierre.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Stretch() {
  return (
    <Figure dur={2}>
      <Floor />
      {/* Legs straight on the floor, toes up */}
      <Bone from={[52, 141]} to={[124, 141]} />
      <Bone from={[124, 141]} to={[126, 131]} />
      {/* Hip: the torso folds forward */}
      <Joint at={[52, 141]} turn={50}>
        <Bone from={[52, 141]} to={[52, 106]} />
        <Head at={[52, 94]} />
        <Bone from={[52, 110]} to={[80, 100]} />
      </Joint>
    </Figure>
  );
}
