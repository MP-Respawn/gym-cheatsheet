/*
 * nordic.jsx: pattern "nordic"
 * Side view, kneeling, ankles held down by a pad. The straight body falls
 * forward slowly from the knees (the hamstrings brake it), then comes back.
 * Used by: curl nórdico, peso muerto nórdico en máquina.
 */
import { Bone, Figure, Floor, Head, Joint, Pad } from "./Figure.jsx";

export default function Nordic() {
  return (
    <Figure dur={2.4}>
      <Floor />
      {/* Ankle anchor and shins on the floor */}
      <Pad x={16} y={128} w={16} h={8} />
      <Bone from={[24, 141]} to={[62, 141]} />
      {/* Knee: thigh, torso and head fall forward as one straight piece */}
      <Joint at={[62, 141]} turn={55}>
        <Bone from={[62, 141]} to={[62, 108]} />
        <Bone from={[62, 108]} to={[62, 74]} />
        <Head at={[62, 62]} />
        <Bone from={[62, 78]} to={[80, 94]} />
      </Joint>
    </Figure>
  );
}
