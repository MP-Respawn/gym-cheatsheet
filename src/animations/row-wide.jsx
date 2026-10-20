/*
 * row-wide.jsx: pattern "row-wide"
 * Front view, wide grip. The bar starts low at arm's length and is pulled to
 * the chest with the elbows flaring out to 90 degrees, away from the ribs.
 * Used by: remo cruz con barra, face pull.
 */
import { Bone, Figure, Floor, Gear, Head, Joint } from "./Figure.jsx";

export default function RowWide() {
  return (
    <Figure>
      <Floor />
      {/* Body, still */}
      <Bone from={[76, 92]} to={[68, 144]} />
      <Bone from={[84, 92]} to={[92, 144]} />
      <Bone from={[80, 92]} to={[80, 52]} />
      <Bone from={[64, 56]} to={[96, 56]} />
      <Head at={[80, 40]} />
      {/* Bar slides up to the chest */}
      <Joint shift={[0, -22]}>
        <Gear from={[40, 98]} to={[120, 98]} />
      </Joint>
      {/* Left arm: upper arm swings out, forearm folds up */}
      <Joint at={[64, 56]} turn={60}>
        <Bone from={[64, 56]} to={[59, 77]} />
        <Joint at={[59, 77]} turn={-125}>
          <Bone from={[59, 77]} to={[54, 98]} />
        </Joint>
      </Joint>
      {/* Right arm mirrors it */}
      <Joint at={[96, 56]} turn={-60}>
        <Bone from={[96, 56]} to={[101, 77]} />
        <Joint at={[101, 77]} turn={125}>
          <Bone from={[101, 77]} to={[106, 98]} />
        </Joint>
      </Joint>
    </Figure>
  );
}
