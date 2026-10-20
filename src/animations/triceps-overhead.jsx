/*
 * triceps-overhead.jsx: pattern "triceps-overhead"
 * Side view, standing. Upper arm points up and forward; the forearm starts
 * folded behind the head and extends forward until the arm is straight.
 * Used by: tríceps trasnuca con soga, tríceps en polea con barra.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function TricepsOverhead() {
  return (
    <Figure>
      <Floor />
      {/* Body, still */}
      <Bone from={[80, 144]} to={[92, 144]} />
      <Bone from={[80, 144]} to={[80, 84]} />
      <Bone from={[80, 84]} to={[80, 48]} />
      <Head at={[80, 37]} />
      {/* Upper arm, fixed, pointing up and forward */}
      <Bone from={[80, 52]} to={[92, 30]} />
      {/* Elbow: the forearm extends from behind the head to straight */}
      <Joint at={[92, 30]} turn={89}>
        <Bone from={[92, 30]} to={[76, 20]} />
        <Disc at={[72, 17]} r={4} />
      </Joint>
    </Figure>
  );
}
