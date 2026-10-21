/*
 * App.jsx
 *
 * The top of the app. It does four things:
 *   1. Reads the current page from the URL hash (useHashRoute) and shows the
 *      matching screen.
 *   2. Keeps the little bits of state that must survive moving between pages:
 *      the search text, the chosen muscle-group chip, and Modo gym.
 *   3. Owns the side menu (MenuDrawer): the hamburger in the top nav opens
 *      it, and moving to another page closes it.
 *   4. Draws the navigation: the bottom tab bar on phones, the side nav on
 *      wide screens (both are always rendered; styles.css shows one or the
 *      other depending on the screen width).
 */
import { useEffect, useLayoutEffect, useState } from "react";
import { savedScroll, useHashRoute } from "./hooks/useHashRoute.js";
import MenuDrawer from "./components/MenuDrawer.jsx";
import SideNav from "./components/SideNav.jsx";
import TabBar from "./components/TabBar.jsx";
import ExerciseList from "./screens/ExerciseList.jsx";
import ExerciseDetail from "./screens/ExerciseDetail.jsx";
import RoutineList from "./screens/RoutineList.jsx";
import RoutineDetail from "./screens/RoutineDetail.jsx";
import RoutineEditor from "./screens/RoutineEditor.jsx";
import WorkoutLog from "./screens/WorkoutLog.jsx";
import Search from "./screens/Search.jsx";
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

  // Search text and the home chip, kept here so they survive opening an
  // exercise and coming back.
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("todos");

  // The side menu. Closed again on every page change (a menu link, the
  // phone's back button...), using React's "adjust state while rendering".
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRoute, setMenuRoute] = useState(route);
  if (menuRoute !== route) {
    setMenuRoute(route);
    setMenuOpen(false);
  }
  const openMenu = () => setMenuOpen(true);

  // From 900px the side nav replaces the menu and styles.css hides it. An
  // open menu would stay modal while hidden and freeze the page (a tablet
  // turned sideways, a window made wider), so close it when that happens.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    function onChange(event) {
      if (event.matches) setMenuOpen(false);
    }
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const [gymMode, setGymMode] = useState(loadGymMode);
  function changeGymMode(on) {
    setGymMode(on);
    saveGymMode(on);
  }

  // On every page change: list pages go back to where you had scrolled,
  // detail pages start at the top.
  useLayoutEffect(() => {
    const hash = window.location.hash || "#/";
    const isList = route.name === "home" || route.name === "routines" || route.name === "search";
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
    screen = <RoutineList onMenuClick={openMenu} />;
  } else if (route.name === "search") {
    screen = <Search query={query} onQueryChange={setQuery} />;
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
      <ExerciseList group={group} onGroupChange={setGroup} onMenuClick={openMenu} />
    );
  }

  // Exercise pages belong to the first tab, routine pages to the second;
  // the search page to neither.
  let activeTab = route.name.startsWith("routine") ? "routines" : "exercises";
  if (route.name === "search") activeTab = null;

  return (
    <div className="app">
      <SideNav activeTab={activeTab} gymMode={gymMode} onGymModeChange={changeGymMode} />
      <main>{screen}</main>
      <TabBar active={activeTab} />
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        gymMode={gymMode}
        onGymModeChange={changeGymMode}
      />
    </div>
  );
}
