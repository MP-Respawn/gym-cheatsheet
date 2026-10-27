/*
 * MenuDrawer.jsx
 *
 * The side menu the hamburger button opens on phones. It slides in from the
 * left over the page and holds:
 *   - links to the main pages (Ejercicios, Rutinas; 

 *     trainers)
 *   - the Modo gym switch
 *   - "Tu cuenta": who is signed in, and "Cerrar sesión"
 *
 * Built on the browser's own <dialog>: showModal() keeps keyboard focus
 * inside, Escape closes it, and focus goes back to the hamburger afterwards.
 * Tapping the dark area beside the panel closes it too. App.jsx owns `open`
 * and closes the menu whenever the page changes.
 *
 * On wide screens the same content lives in SideNav.jsx; the links, switch
 * and account pieces are shared through navShared.jsx.
 */
import { useEffect, useRef } from "react";
import { useRoles } from "../store/useStore.js";
import { Brand } from "./AppHeader.jsx";
import { linksFor } from "./navLinks.js";
import { AccountControls, GymSwitch, Icon, SyncNote, ThemeSwitch } from "./navShared.jsx";

export default function MenuDrawer({ exercisesHref = "#/", open, onClose, activeTab, gymMode, onGymModeChange }) {
  const dialog = useRef(null);
  const roles = useRoles();

  // Open or close the native dialog to match `open`.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The dialog's "close" event fires however it closed (Escape, a link, the
  // X, a page change): keep App.jsx in sync.
  function onDialogClose() {
    onClose();
  }

  // A tap on the dark backdrop lands on the <dialog> itself (the panel
  // inside covers everything else), so that closes the menu.
  function onDialogClick(event) {
    if (event.target === dialog.current) onClose();
  }

  return (
    <dialog ref={dialog} className="drawer" aria-label="Menú" onClose={onDialogClose} onClick={onDialogClick}>
      <div className="drawer-panel">
        <div className="drawer-head">
          <Brand />
          <button type="button" className="menu-button" aria-label="Cerrar menú" onClick={onClose} autoFocus>
            <Icon d="M6 6l12 12M18 6L6 18" size={22} />
          </button>
        </div>

        <nav className="drawer-body" aria-label="Menú principal">
          {linksFor(roles).map((link) => {
            const current = link.tab !== null && link.tab === activeTab;
            return (
              <a
                key={link.href}
                href={link.tab === "exercises" ? exercisesHref : link.href}
                className={current ? "drawer-link active" : "drawer-link"}
                aria-current={current ? "page" : undefined}
                onClick={onClose}
              >
                <Icon d={link.icon} size={20} />
                {link.label}
              </a>
            );
          })}

          <h2 className="drawer-section">Entrenamiento</h2>
          <GymSwitch on={gymMode} onChange={onGymModeChange} className="drawer-link drawer-switch" hint />

          <h2 className="drawer-section">Tema</h2>
          <ThemeSwitch />

          <h2 className="drawer-section">Tu cuenta</h2>
          <AccountControls linkClass="drawer-link" noteClass="drawer-note" />
        </nav>

        <div className="drawer-foot">
          <SyncNote />
        </div>
      </div>
    </dialog>
  );
}
