/*
 * navLinks.js
 *
 * The main pages, shared by the phone menu (MenuDrawer), the desktop side
 * nav (SideNav) and the bottom tab bar (TabBar): where each goes, its
 * label, which tab it is, and a line icon (one SVG path).
 * `trainer: true` pages only show for coaches, `superadmin: true` only for
 * you (see linksFor).
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
  {
    href: "#/pedidos",
    label: "Pedidos",
    tab: "requests",
    trainer: true,
    // Envelope
    icon: "M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7",
  },
  {
    href: "#/entrenadores",
    label: "Coaches",
    tab: "coaches",
    superadmin: true,
    // Shield with a check
    icon: "M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6zM8.5 12l2.5 2.5 4.5-5",
  },
];

// The links this person sees: everyone's, plus the coach's for coaches and yours for you.
export function linksFor({ isTrainer, isSuperadmin }) {
  return LINKS.filter((link) => (link.superadmin ? isSuperadmin : !link.trainer || isTrainer));
}
