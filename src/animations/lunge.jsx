/*
 * lunge.jsx: pattern "lunge"
 * Side view, facing right, in a split stance. The body drops straight down:
 * the front shin goes vertical, the back knee sinks toward the floor.
 * Used by: estocadas, sentadilla búlgara.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Lunge() {
  return (
    <Figure>
      <Floor />
      {/* Front foot, planted */}
      <Bone from={[100, 144]} to={[110, 144]} />
      {/* Front ankle: shin straightens up to vertical */}
      <Joint at={[100, 144]} turn={19}>
        <Bone from={[100, 144]} to={[90, 115]} />
        {/* Front knee: thigh drops toward horizontal */}
        <Joint at={[90, 115]} turn={-75}>
          <Bone from={[90, 115]} to={[80, 86]} />
          {/* Back leg hangs from the hip: thigh goes vertical, shin trails back */}
          <Joint at={[80, 86]} turn={33}>
            <Bone from={[80, 86]} to={[68, 114]} />
            <Joint at={[68, 114]} turn={77}>
              <Bone from={[68, 114]} to={[58, 142]} />
            </Joint>
          </Joint>
          {/* Hip: torso stays upright, arms hang with dumbbells */}
          <Joint at={[80, 86]} turn={56}>
            <Bone from={[80, 86]} to={[80, 50]} />
            <Head at={[80, 39]} />
            <Bone from={[80, 54]} to={[80, 94]} />
            <Disc at={[80, 98]} r={5} />
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
