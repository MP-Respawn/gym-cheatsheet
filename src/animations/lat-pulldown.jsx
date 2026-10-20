/*
 * lat-pulldown.jsx: pattern "lat-pulldown"
 * Front view, seated. Arms straight up holding a wide bar, then the elbows
 * drive down and out until the bar reaches the upper chest.
 * Used by: jalón al pecho, dominada en polea, dominadas asistidas.
 */
import { Bone, Figure, Floor, Gear, Head, Joint, Pad } from "./Figure.jsx";

export default function LatPulldown() {
  return (
    <Figure>
      <Floor />
      {/* Seat and post */}
      <Pad x={56} y={98} w={48} h={7} />
      <Gear from={[80, 105]} to={[80, 148]} />
      {/* Seated body, still */}
      <Bone from={[80, 96]} to={[80, 56]} />
      <Bone from={[66, 58]} to={[94, 58]} />
      <Head at={[80, 44]} />
      <Bone from={[72, 96]} to={[88, 96]} />
      <Bone from={[72, 96]} to={[62, 110]} />
      <Bone from={[88, 96]} to={[98, 110]} />
      <Bone from={[62, 110]} to={[62, 142]} />
      <Bone from={[98, 110]} to={[98, 142]} />
      {/* Bar and its cable slide down together */}
      <Joint shift={[0, 37]}>
        <Gear from={[80, 16]} to={[80, -40]} />
        <Gear from={[40, 16]} to={[120, 16]} />
      </Joint>
      {/* Left arm: shoulder, then elbow */}
      <Joint at={[66, 58]} turn={-122}>
        <Bone from={[66, 58]} to={[58, 37]} />
        <Joint at={[58, 37]} turn={147}>
          <Bone from={[58, 37]} to={[50, 16]} />
        </Joint>
      </Joint>
      {/* Right arm mirrors it */}
      <Joint at={[94, 58]} turn={122}>
        <Bone from={[94, 58]} to={[102, 37]} />
        <Joint at={[102, 37]} turn={-147}>
          <Bone from={[102, 37]} to={[110, 16]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
