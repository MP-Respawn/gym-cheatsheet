/*
 * navLinks.js
 *
 * The main pages, shared by the phone menu (MenuDrawer) and the desktop
 * side nav (SideNav): where each goes, its label, which bottom tab it
 * belongs to, and a line icon (one SVG path).
 */
export const LINKS = [
  { href: "#/", label: "Ejercicios", tab: "exercises", icon: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" },
  { href: "#/rutinas", label: "Rutinas", tab: "routines", icon: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" },
  { href: "#/rutina/nueva", label: "Nueva rutina", tab: null, icon: "M12 5v14M5 12h14" },
];

