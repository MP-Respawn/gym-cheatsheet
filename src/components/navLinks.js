/*
 * navLinks.js
 *
 * The main pages, shared by the phone menu (MenuDrawer), the desktop side
 * nav (SideNav) and the bottom tab bar (TabBar): where each goes, its
 * label, which tab it is, and a line icon (one SVG path).
 * `trainer: true` pages only show for trainers (see linksFor).
 */
export const LINKS = [
  { href: "#/", label: "Ejercicios", tab: "exercises", icon: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" },
  { href: "#/rutinas", label: "Rutinas", tab: "routines", icon: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" },
  {
    href: "#/clientes",
    label: "Clientes",
    tab: "clients",
    trainer: true,
    // Two people
    icon: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6",
  },
];

// The links this person sees: everyone's, plus the trainer's for trainers.
export function linksFor(isTrainer) {
  return LINKS.filter((link) => isTrainer || !link.trainer);
}
