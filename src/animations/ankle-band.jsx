/*
 * ankle-band.jsx: pattern "ankle-band"
 * SIMPLIFIED: a close-up of one lower leg seen from the front, not a full
 * figure. The foot tilts in and out against an elastic band tied to a post.
 * Used by: eversión e inversión con banda, flexión de tobillo a la pared.
 */
import { Bone, Figure, Gear, Joint } from "./Figure.jsx";

export default function AnkleBand() {
  return (
    <Figure dur={1}>
      {/* Post the band is tied to */}
      <Gear from={[142, 96]} to={[142, 148]} />
      {/* Shin, from the knee down to the ankle */}
      <Bone from={[80, 22]} to={[80, 104]} />
      {/* Ankle: the foot tilts left, then right, then back to center */}
      <Joint at={[80, 106]} turn={[-22, 22]}>
        <Gear from={[96, 120]} to={[142, 118]} />
        <Bone from={[80, 104]} to={[80, 118]} />
        <Bone from={[62, 122]} to={[98, 122]} />
      </Joint>
    </Figure>
  );
}
