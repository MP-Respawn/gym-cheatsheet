/*
 * mobility.jsx: pattern "mobility"
 * Side view, facing right, archer stance (one foot forward, one back).
 * SIMPLIFIED: the hips rock back and forth between the legs and one arm
 * sweeps from down by the body to up overhead. The hips set the rhythm.
 * Used by: movilidad en posición de arquero, movilidad de parado, rolo + movilidad.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Mobility() {
  return (
    <Figure dur={1.4}>
      <Floor />
      {/* Front foot */}
      <Bone from={[108, 144]} to={[118, 144]} />
      {/* Front ankle and knee: the front knee bends as hips come forward */}
      <Joint at={[108, 144]} turn={39}>
        <Bone from={[108, 144]} to={[95, 117]} />
        <Joint at={[95, 117]} turn={-57}>
          <Bone from={[95, 117]} to={[70, 100]} />
          {/* Back leg: straightens as the hips move forward */}
          <Joint at={[70, 100]} turn={55}>
            <Bone from={[70, 100]} to={[66, 130]} />
            <Joint at={[66, 130]} turn={-43}>
              <Bone from={[66, 130]} to={[40, 144]} />
            </Joint>
          </Joint>
          {/* Torso stays upright */}
          <Joint at={[70, 100]} turn={18}>
            <Bone from={[70, 100]} to={[70, 66]} />
            <Head at={[70, 55]} />
            {/* Arm: down toward the back foot, then up overhead */}
            <Joint at={[70, 68]} turn={-160}>
              <Bone from={[70, 68]} to={[62, 108]} />
            </Joint>
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
