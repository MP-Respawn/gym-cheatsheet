/*
 * useHashRoute.js
 *
 * Tiny router without a library. The app's "pages" live after the # in the
 * URL, which works on any static host (Vercel included) with zero config:
 *
 *   #/                  -> home, exercise list
 *   #/ejercicio/<id>    -> one exercise
 *   #/rutinas           -> routine list
 *   #/rutina/<id>       -> one routine
 *
 * The hook returns { name, id } for the current page and re-renders the
 * component whenever the hash changes (a tapped link, the back button...).
 */
import { useEffect, useState } from "react";

// Turns "#/ejercicio/peso-muerto" into { name: "exercise", id: "peso-muerto" }.
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [first, second] = parts.map(decodeURIComponent);

  if (first === "ejercicio" && second) return { name: "exercise", id: second };
  if (first === "rutina" && second) return { name: "routine", id: second };
  if (first === "rutinas") return { name: "routines" };
  return { name: "home" };
}

/*
 * Remembers how far down you had scrolled on each page, so going back to a
 * long list puts you where you were. Filled right before the hash changes.
 */
export const savedScroll = {};

// True once the user has moved between pages inside the app. The back button
// uses it to decide between "browser back" and "jump to the list".
let movedInsideApp = false;
export function hasInAppHistory() {
  return movedInsideApp;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    function onHashChange(event) {
      // Save the scroll position of the page we are leaving.
      const oldHash = new URL(event.oldURL).hash || "#/";
      savedScroll[oldHash] = window.scrollY;
      movedInsideApp = true;
      setRoute(parseHash(window.location.hash));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}
