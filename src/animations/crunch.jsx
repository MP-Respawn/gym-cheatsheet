/*
 * crunch.jsx: pattern "crunch"
 * Side view, lying on the back with knees bent. The shoulders curl up off
 * the floor toward the knees, then lower again.
 * Used by: abdomen clásico, plegado isométrico.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Crunch() {
  return (
    <Figure>
      <Floor />
      {/* Legs: bent knees, feet on the floor */}
      <Bone from={[80, 141]} to={[100, 114]} />
      <Bone from={[100, 114]} to={[118, 141]} />
      {/* Hip: the torso curls up */}
      <Joint at={[80, 141]} turn={32}>
        <Bone from={[80, 141]} to={[44, 141]} />
        <Head at={[31, 137]} />
        {/* Arms reach toward the knees */}
        <Bone from={[44, 141]} to={[68, 134]} />
      </Joint>
    </Figure>
  );
}
