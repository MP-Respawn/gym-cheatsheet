/*
 * side-lunge.jsx: pattern "side-lunge"
 * Front view. Wide stance, then the hips shift to one side and drop: that
 * knee bends, the other leg stays straight. The torso stays upright.
 * Used by: estocadas laterales.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function SideLunge() {
  return (
    <Figure>
      <Floor />
      <Bone from={[52, 144]} to={[44, 144]} />
      {/* Straight leg pivots on its foot as the hips slide over */}
      <Joint at={[52, 144]} turn={21}>
        <Bone from={[52, 144]} to={[72, 84]} />
        {/* Pelvis counter-rotates so the torso stays upright */}
        <Joint at={[72, 84]} turn={-21}>
          <Bone from={[72, 84]} to={[88, 84]} />
          <Bone from={[80, 84]} to={[80, 50]} />
          <Head at={[80, 38]} />
          <Bone from={[66, 54]} to={[94, 54]} />
          {/* Arms hold one dumbbell in front */}
          <Bone from={[66, 54]} to={[76, 92]} />
          <Bone from={[94, 54]} to={[84, 92]} />
          <Disc at={[80, 96]} r={6} />
          {/* Bending leg: hip, then knee */}
          <Joint at={[88, 84]} turn={-13}>
            <Bone from={[88, 84]} to={[98, 114]} />
            <Joint at={[98, 114]} turn={76}>
              <Bone from={[98, 114]} to={[108, 144]} />
            </Joint>
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
