/*
 * App.jsx
 *
 * The top of the app. It does three things:
 *   1. Reads the current page from the URL hash (useHashRoute) and shows the
 *      matching screen.
 *   2. Keeps the little bits of state that must survive moving between pages:
 *      the search text, the chosen muscle-group chip, and Modo gym.
 *   3. Draws the bottom tab bar.
 */
import { useLayoutEffect, useState } from "react";
import { savedScroll, useHashRoute } from "./hooks/useHashRoute.js";
import TabBar from "./components/TabBar.jsx";
import ExerciseList from "./screens/ExerciseList.jsx";
import ExerciseDetail from "./screens/ExerciseDetail.jsx";
import RoutineList from "./screens/RoutineList.jsx";
import RoutineDetail from "./screens/RoutineDetail.jsx";
import RoutineEditor from "./screens/RoutineEditor.jsx";
import WorkoutLog from "./screens/WorkoutLog.jsx";
import { useAnyRoutine } from "./store/useStore.js";

const GYM_MODE_KEY = "gym-mode";

// Reads Modo gym from the phone's storage. Wrapped in try/catch because
// storage can be blocked (private browsing); then it simply starts off.
function loadGymMode() {
  try {
    return window.localStorage.getItem(GYM_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveGymMode(on) {
  try {
    window.localStorage.setItem(GYM_MODE_KEY, on ? "1" : "0");
  } catch {
    // Storage unavailable: the switch still works, it just won't be remembered.
  }
}

export default function App() {
  const route = useHashRoute();

  // Home filters, kept here so they survive opening an exercise and coming back.
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("todos");

  const [gymMode, setGymMode] = useState(loadGymMode);
  function changeGymMode(on) {
    setGymMode(on);
    saveGymMode(on);
  }

  // On every page change: list pages go back to where you had scrolled,
  // detail pages start at the top.
  useLayoutEffect(() => {
    const hash = window.location.hash || "#/";
    const isList = route.name === "home" || route.name === "routines";
    window.scrollTo(0, isList ? (savedScroll[hash] ?? 0) : 0);
  }, [route]);

  // Routine pages need the routine itself: the trainer's (in the code) or
  // yours (on the device). Looked up here so every routine screen shares it.
  const { routine, isMine } = useAnyRoutine(route.id ?? "");

  // Pick the screen for the current route.
  let screen;
  if (route.name === "exercise") {
    screen = <ExerciseDetail id={route.id} />;
  } else if (route.name === "routines") {
    screen = <RoutineList />;
  } else if (route.name === "routine-new") {
    screen = <RoutineEditor key="new" />;
  } else if (route.name === "routine-edit") {
    screen = <RoutineEditor key={route.id} id={route.id} />;
  } else if (route.name === "routine-train" && routine) {
    screen = <WorkoutLog key={route.id} routine={routine} gymMode={gymMode} />;
  } else if (route.name === "routine" || route.name === "routine-train") {
    // (a workout for a routine that does not exist falls here: "not found")
    screen = <RoutineDetail routine={routine} isMine={isMine} gymMode={gymMode} onGymModeChange={changeGymMode} />;
  } else {
    screen = (
      <ExerciseList
        query={query}
        onQueryChange={setQuery}
        group={group}
        onGroupChange={setGroup}
      />
    );
  }

  // Exercise pages belong to the first tab, routine pages to the second.
  const activeTab = route.name.startsWith("routine") ? "routines" : "exercises";

  return (
    <div className="app">
      <main>{screen}</main>
      <TabBar active={activeTab} />
    </div>
  );
}
