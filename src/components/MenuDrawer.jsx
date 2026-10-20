/*
 * MenuDrawer.jsx
 *
 * The side menu the hamburger button opens. It slides in from the left over
 * the page and holds:
 *   - links to the main pages (Ejercicios, Rutinas, Nueva rutina)
 *   - the Modo gym switch
 *   - "Tus datos": download or restore a backup of your routines and history
 *
 * Built on the browser's own <dialog>: showModal() keeps keyboard focus
 * inside, Escape closes it, and focus goes back to the hamburger afterwards.
 * Tapping the dark area beside the panel closes it too. App.jsx owns `open`
 * and closes the menu whenever the page changes.
 */
import { useEffect, useRef, useState } from "react";
import { exportData, importData } from "../store/storage.js";
import { useIsPersistent } from "../store/useStore.js";
import { Brand } from "./AppHeader.jsx";

// Each menu link: where it goes, its label, which tab it belongs to, and a line icon.
const LINKS = [
  { href: "#/", label: "Ejercicios", tab: "exercises", icon: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" },
  { href: "#/rutinas", label: "Rutinas", tab: "routines", icon: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" },
  { href: "#/rutina/nueva", label: "Nueva rutina", tab: null, icon: "M12 5v14M5 12h14" },
];

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Downloads all your personal data as a .json file.
function downloadBackup() {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `respawn-fitness-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function MenuDrawer({ open, onClose, activeTab, gymMode, onGymModeChange }) {
  const dialog = useRef(null);
  const fileInput = useRef(null);
  const persistent = useIsPersistent();
  const [backupMessage, setBackupMessage] = useState("");

  // Open or close the native dialog to match `open`.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The dialog's "close" event fires however it closed (Escape, a link, the
  // X, a page change): forget the backup message and keep App.jsx in sync.
  function onDialogClose() {
    setBackupMessage("");
    onClose();
  }

  // A tap on the dark backdrop lands on the <dialog> itself (the panel
  // inside covers everything else), so that closes the menu.
  function onDialogClick(event) {
    if (event.target === dialog.current) onClose();
  }

  // Reads the chosen backup file and merges it into your data.
  async function restore(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow choosing the same file again
    if (!file) return;
    try {
      const result = importData(await file.text());
      setBackupMessage(`Listo: ${result.routines} rutinas y ${result.sessions} entrenamientos importados.`);
    } catch (error) {
      setBackupMessage(error.message || "No se pudo leer el archivo.");
    }
  }

  return (
    <dialog ref={dialog} className="drawer" aria-label="Menú" onClose={onDialogClose} onClick={onDialogClick}>
      <div className="drawer-panel">
        <div className="drawer-head">
          <Brand />
          <button type="button" className="menu-button" aria-label="Cerrar menú" onClick={onClose} autoFocus>
            <Icon d="M6 6l12 12M18 6L6 18" />
          </button>
        </div>

        <nav className="drawer-body" aria-label="Menú principal">
          {LINKS.map((link) => {
            const current = link.tab !== null && link.tab === activeTab;
            return (
              <a
                key={link.href}
                href={link.href}
                className={current ? "drawer-link active" : "drawer-link"}
                aria-current={current ? "page" : undefined}
                onClick={onClose}
              >
                <Icon d={link.icon} />
                {link.label}
              </a>
            );
          })}

          <h2 className="drawer-section">Entrenamiento</h2>
          <button
            type="button"
            role="switch"
            aria-checked={gymMode}
            className={gymMode ? "drawer-link drawer-switch on" : "drawer-link drawer-switch"}
            onClick={() => onGymModeChange(!gymMode)}
          >
            <Icon d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
            <span className="drawer-switch-text">
              Modo gym
              <span className="drawer-switch-hint">Letras grandes, solo lo esencial</span>
            </span>
            <span className="gym-toggle-track" aria-hidden="true">
              <span className="gym-toggle-thumb" />
            </span>
          </button>

          <h2 className="drawer-section">Tus datos</h2>
          <button type="button" className="drawer-link" onClick={downloadBackup}>
            <Icon d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            Exportar copia
          </button>
          <button type="button" className="drawer-link" onClick={() => fileInput.current?.click()}>
            <Icon d="M12 15V4M7 9l5-5 5 5M5 20h14" />
            Importar copia
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={restore} />
          {backupMessage && (
            <p className="drawer-note" role="status">
              {backupMessage}
            </p>
          )}
        </nav>

        <div className="drawer-foot">
          {persistent ? (
            <p>
              Tus rutinas y tu historial se guardan en este teléfono. Agregá la app a la pantalla de inicio para que el
              navegador no los borre, y bajate una copia de vez en cuando.
            </p>
          ) : (
            <p className="warning">
              Este navegador no permite guardar datos (¿ventana privada?): lo que cargues se pierde al cerrar.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
