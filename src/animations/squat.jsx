/*
 * squat.jsx: pattern "squat"
 * Side view, facing right. Standing tall with a bar on the upper back, then
 * sitting down: knees travel forward, hips go back and down, torso leans.
 * Used by: sentadilla con barra, Smith, goblet, prensa, sentadilla explosiva.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Squat() {
  return (
    <Figure>
      <Floor />
      {/* Foot, planted the whole time */}
      <Bone from={[80, 144]} to={[92, 144]} />
      {/* Ankle: the shin tips forward */}
      <Joint at={[80, 144]} turn={35}>
        <Bone from={[80, 144]} to={[80, 114]} />
        {/* Knee: the thigh folds back toward horizontal */}
        <Joint at={[80, 114]} turn={-110}>
          <Bone from={[80, 114]} to={[80, 84]} />
          {/* Hip: torso leans forward, carrying head, arms and bar */}
          <Joint at={[80, 84]} turn={110}>
            <Bone from={[80, 84]} to={[80, 48]} />
            <Head at={[80, 37]} />
            <Disc at={[74, 52]} r={6} />
            <Bone from={[80, 54]} to={[68, 66]} />
            <Bone from={[68, 66]} to={[74, 54]} />
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
