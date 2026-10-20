/*
 * hinge.jsx: pattern "hinge"
 * Side view, facing right. Deadlift / RDL: the hips go back, the torso tips
 * forward with a straight back, and the arms hang straight holding the bar.
 * Used by: peso muerto, peso muerto rumano, buenos días.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Hinge() {
  return (
    <Figure>
      <Floor />
      <Bone from={[80, 144]} to={[92, 144]} />
      {/* Ankle: small forward tilt of the shin */}
      <Joint at={[80, 144]} turn={12}>
        <Bone from={[80, 144]} to={[80, 114]} />
        {/* Knee: thigh tilts back so the hips travel backward */}
        <Joint at={[80, 114]} turn={-32}>
          <Bone from={[80, 114]} to={[80, 84]} />
          {/* Hip: the big hinge, torso goes almost horizontal */}
          <Joint at={[80, 84]} turn={95}>
            <Bone from={[80, 84]} to={[80, 48]} />
            <Head at={[80, 37]} />
            {/* Shoulder: arms stay pointing at the floor */}
            <Joint at={[80, 52]} turn={-75}>
              <Bone from={[80, 52]} to={[80, 94]} />
              <Disc at={[80, 99]} r={6} />
            </Joint>
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
