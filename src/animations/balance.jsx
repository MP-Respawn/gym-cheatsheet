/*
 * balance.jsx: pattern "balance"
 * Side view, facing right. Standing on one leg with the other knee lifted,
 * swaying a little back and forth over the ankle.
 * Used by: equilibrio en bosu, equilibrio a un pie.
 */
import { Bone, Figure, Floor, Head, Joint } from "./Figure.jsx";

export default function Balance() {
  return (
    <Figure dur={1.2}>
      <Floor />
      <Bone from={[80, 144]} to={[92, 144]} />
      {/* The whole body sways around the ankle: a bit back, a bit forward */}
      <Joint at={[80, 144]} turn={[-3, 3]}>
        <Bone from={[80, 144]} to={[80, 114]} />
        <Bone from={[80, 114]} to={[80, 84]} />
        {/* Lifted leg: knee forward, foot hanging */}
        <Bone from={[80, 84]} to={[104, 96]} />
        <Bone from={[104, 96]} to={[100, 124]} />
        <Bone from={[80, 84]} to={[80, 48]} />
        <Head at={[80, 37]} />
        {/* Arms slightly open, one forward and one back */}
        <Bone from={[80, 54]} to={[100, 74]} />
        <Bone from={[80, 54]} to={[62, 76]} />
      </Joint>
    </Figure>
  );
}
