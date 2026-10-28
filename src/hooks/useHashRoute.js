/*
 * useHashRoute.js
 *
 * Tiny router without a library. The app's "pages" live after the # in the
 * URL, which works on any static host (Vercel included) with zero config:
 *
 *   #/                  -> home, exercise list
 *   #/?d=yoga           -> home filtered to one discipline (any page can
 *                          carry a ?query; it comes back in route.query)
 *   #/buscar            -> search exercises and routines
 *   #/ejercicio/<id>    -> one exercise
 *   #/rutinas           -> routine list
 *   #/rutina/<id>       -> one day of a routine (assigned to you, or a
 *                          catalog sequence such as a vuelta)
 *   #/programa/<id>     -> a routine with several days: one lane per day
 *   #/rutina/<id>/entrenar -> log weights while doing a routine
 *   #/invitacion/<token>   -> a trainer's invitation link
 *
 * Trainer pages (their own routines are listed in #/rutinas):
 *   #/clientes          -> your clients
 *   #/cliente/<id>      -> one client: routines, history, invitation
 *   #/nueva-rutina      -> build a new routine (?cliente=<id>: and give it
 *                          to that client; ?desde=<id>: start as a copy;
 *                          ?asistente=1: straight into the assistant)
 *   #/editar-rutina/<id> -> edit one of your routines
 *   #/asignar/<id>      -> give a routine to clients, or change their numbers
 *                          (?cliente=<id> ticks one)
 *   #/pedidos           -> ask for a new exercise, see the answers
 *                          (?nombre=<text> fills the name); the inbox for
 *                          whoever answers them
 * The old #/plantillas pages lead to #/rutinas.
 *
 * Superadmin page:
 *   #/entrenadores      -> the coaches: invite, turn off, who curates
 *
 * #/invitacion/<token>?rol=entrenador is a coach's invitation (the wording
 * changes; the database knows what the link is for).
 *
 * The hook returns { name, id, query } for the current page and re-renders
 * the component whenever the hash changes (a tapped link, the back button...).
 */
import { useEffect, useState } from "react";

// Turns "#/ejercicio/peso-muerto" into { name: "exercise", id: "peso-muerto" }
// and "#/?d=yoga" into { name: "home", query: { d: "yoga" } }.
export function parseHash(hash) {
  const [path, search = ""] = hash.replace(/^#\/?/, "").split("?");
  const query = Object.fromEntries(new URLSearchParams(search));
  return { ...parsePath(path), query };
}

function parsePath(path) {
  const parts = path.split("/").filter(Boolean);
  const [first, second, third] = parts.map(decodeURIComponent);

  if (first === "ejercicio" && second) return { name: "exercise", id: second };
  if (first === "invitacion" && second) return { name: "invite", id: second };
  // Workout log for any routine: #/rutina/<id>/entrenar
  if (first === "rutina" && second && third === "entrenar") return { name: "routine-train", id: second };
  if (first === "rutina" && second) return { name: "routine", id: second };
  // A routine with several days: its page with one lane per day
  if (first === "programa" && second) return { name: "program", id: second };
  if (first === "rutinas") return { name: "routines" };
  // The trainer's pages
  if (first === "clientes") return { name: "clients" };
  if (first === "cliente" && second) return { name: "client", id: second };
  if (first === "nueva-rutina") return { name: "routine-new" };
  if (first === "editar-rutina" && second) return { name: "routine-edit", id: second };
  if (first === "plantillas" || first === "plantilla") return { name: "routines" };
  if (first === "pedidos") return { name: "requests" };
  if (first === "entrenadores") return { name: "coaches" };
  if (first === "asignar" && second) return { name: "assign", id: second };
  if (first === "buscar") return { name: "search" };
  return { name: "home" };
}

// The home list for a discipline: "#/?d=yoga", or "#/" for all of them.
export function homeHref(discipline) {
  return discipline && discipline !== "todo" ? `#/?d=${encodeURIComponent(discipline)}` : "#/";
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
