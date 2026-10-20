/*
 * biceps-curl.jsx: pattern "biceps-curl"
 * Side view, standing. The elbow stays pinned at the side while the forearm
 * curls the dumbbell up to the shoulder, then lowers slowly.
 * Used by: bíceps en la pared, curl con barra, curl martillo.
 */
import { Bone, Disc, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function BicepsCurl() {
  return (
    <Figure>
      <Floor />
      {/* Body, still */}
      <Bone from={[80, 144]} to={[92, 144]} />
      <Bone from={[80, 144]} to={[80, 84]} />
      <Bone from={[80, 84]} to={[80, 48]} />
      <Head at={[80, 37]} />
      {/* Upper arm, fixed at the side */}
      <Bone from={[80, 54]} to={[84, 76]} />
      {/* Elbow: the forearm curls up */}
      <Joint at={[84, 76]} turn={-135}>
        <Bone from={[84, 76]} to={[86, 96]} />
        <Disc at={[86, 101]} r={5} />
      </Joint>
    </Figure>
  );
}
