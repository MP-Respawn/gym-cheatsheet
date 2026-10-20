/*
 * index.js: the animation registry.
 *
 * Maps each movement pattern key (the `pattern` field in exercises.js) to the
 * component that draws it. To add a new pattern:
 *   1. create src/animations/<pattern>.jsx (copy a similar one),
 *   2. import it here and add a line to ANIMATIONS,
 *   3. run `node scripts/check-data.mjs`.
 */
import "./animations.css";

import AbductorMachine from "./abductor-machine.jsx";
import AdductorMachine from "./adductor-machine.jsx";
import AnkleBand from "./ankle-band.jsx";
import Balance from "./balance.jsx";
import BenchPress from "./bench-press.jsx";
import BicepsCurl from "./biceps-curl.jsx";
import CableFly from "./cable-fly.jsx";
import CalfRaise from "./calf-raise.jsx";
import Copenhagen from "./copenhagen.jsx";
import Crunch from "./crunch.jsx";
import GluteBridge from "./glute-bridge.jsx";
import Hinge from "./hinge.jsx";
import HipThrust from "./hip-thrust.jsx";
import InclinePress from "./incline-press.jsx";
import LatPulldown from "./lat-pulldown.jsx";
import LateralRaise from "./lateral-raise.jsx";
import LegCurl from "./leg-curl.jsx";
import LegExtension from "./leg-extension.jsx";
import LegRaise from "./leg-raise.jsx";
import Lunge from "./lunge.jsx";
import Mobility from "./mobility.jsx";
import Nordic from "./nordic.jsx";
import OverheadPress from "./overhead-press.jsx";
import Plank from "./plank.jsx";
import Pullover from "./pullover.jsx";
import PushUp from "./push-up.jsx";
import RowHorizontal from "./row-horizontal.jsx";
import RowWide from "./row-wide.jsx";
import SideLunge from "./side-lunge.jsx";
import SidePlank from "./side-plank.jsx";
import SingleLegHinge from "./single-leg-hinge.jsx";
import Squat from "./squat.jsx";
import Stretch from "./stretch.jsx";
import TricepsOverhead from "./triceps-overhead.jsx";

// Grouped by body area, the same way the catalog is organized.
// Keys are always in quotes on purpose: check-data.mjs searches for "<pattern>".
export const ANIMATIONS = {
  // Movilidad, core, equilibrio
  "mobility": Mobility,
  "plank": Plank,
  "side-plank": SidePlank,
  "crunch": Crunch,
  "leg-raise": LegRaise,
  "balance": Balance,
  "ankle-band": AnkleBand,
  // Piernas
  "squat": Squat,
  "lunge": Lunge,
  "side-lunge": SideLunge,
  "hinge": Hinge,
  "single-leg-hinge": SingleLegHinge,
  "nordic": Nordic,
  "glute-bridge": GluteBridge,
  "hip-thrust": HipThrust,
  "leg-extension": LegExtension,
  "leg-curl": LegCurl,
  "calf-raise": CalfRaise,
  "adductor-machine": AdductorMachine,
  "abductor-machine": AbductorMachine,
  "copenhagen": Copenhagen,
  // Tren superior
  "push-up": PushUp,
  "bench-press": BenchPress,
  "incline-press": InclinePress,
  "cable-fly": CableFly,
  "lat-pulldown": LatPulldown,
  "row-horizontal": RowHorizontal,
  "row-wide": RowWide,
  "pullover": Pullover,
  "overhead-press": OverheadPress,
  "lateral-raise": LateralRaise,
  "biceps-curl": BicepsCurl,
  "triceps-overhead": TricepsOverhead,
  // Cierre
  "stretch": Stretch,
};
