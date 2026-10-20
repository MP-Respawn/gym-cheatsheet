/*
 * glute-bridge.jsx: pattern "glute-bridge"
 * Side view, lying on the back with knees bent. The hips push up until the
 * body is a straight line from shoulders to knees; feet stay put.
 * Used by: puente de glúteos + press, hip thrust en el piso, curl de isquios con pelota.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function GluteBridge() {
  return (
    <Figure>
      <Floor />
      <Head at={[28, 137]} />
      {/* Arms resting on the floor */}
      <Bone from={[40, 141]} to={[70, 143]} />
      {/* Shoulder: the torso lifts like a ramp */}
      <Joint at={[40, 141]} turn={-22}>
        <Bone from={[40, 141]} to={[82, 141]} />
        {/* Hip and knee rotate back so the foot stays on the floor */}
        <Joint at={[82, 141]} turn={49}>
          <Bone from={[82, 141]} to={[104, 113]} />
          <Joint at={[104, 113]} turn={-14}>
            <Bone from={[104, 113]} to={[118, 143]} />
            <Bone from={[118, 143]} to={[126, 143]} />
          </Joint>
        </Joint>
      </Joint>
    </Figure>
  );
}
