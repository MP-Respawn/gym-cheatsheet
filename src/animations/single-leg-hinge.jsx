/*
 * single-leg-hinge.jsx: pattern "single-leg-hinge"
 * Side view, facing right. Standing on one leg, the torso tips forward while
 * the free leg rises behind, until the body makes a "T" like a scale.
 * Used by: balanzas, peso muerto a un pie + remo, patada de glúteo en polea.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function SingleLegHinge() {
  return (
    <Figure>
      <Floor />
      <Bone from={[80, 144]} to={[92, 144]} />
      {/* Standing leg: soft knee */}
      <Joint at={[80, 144]} turn={8}>
        <Bone from={[80, 144]} to={[80, 114]} />
        <Joint at={[80, 114]} turn={-18}>
          <Bone from={[80, 114]} to={[80, 84]} />
          {/* Hip: torso AND free leg rotate together, so they stay in line */}
          <Joint at={[80, 84]} turn={90}>
            <Bone from={[80, 84]} to={[80, 48]} />
            <Head at={[80, 37]} />
            {/* Free leg, drawn hanging straight down in the start pose */}
            <Bone from={[80, 84]} to={[80, 144]} />
            {/* Arms keep pointing at the floor */}
            <Joint at={[80, 52]} turn={-80}>
              <Bone from={[80, 52]} to={[80, 94]} />
            </Joint>
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
