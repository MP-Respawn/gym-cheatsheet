/*
 * navShared.jsx
 *
 * Pieces shared by the two navigations: the phone side menu (MenuDrawer)
 * and the desktop side nav (SideNav). Both show the same links, the Modo
 * gym switch and the backup tools, just laid out differently.
 *
 *   Icon            a line icon drawn from one SVG path (RPWN style: 1.8 stroke)
 *   GymSwitch       the Modo gym on/off switch
 *   BackupControls  "Exportar copia" / "Importar copia" + the result message
 */
import { useRef } from "react";
import { exportData, importData } from "../store/storage.js";

export function Icon({ d, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/*
 * The Modo gym switch. `className` is the row style of whichever nav holds
 * it ("drawer-link drawer-switch" or "sidenav-link sidenav-switch").
 * `hint` adds the small explanation under the label (phone menu only).
 */
export function GymSwitch({ on, onChange, className, hint = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={on ? `${className} on` : className}
      onClick={() => onChange(!on)}
    >
      <Icon d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
      <span className={hint ? "drawer-switch-text" : "sidenav-switch-text"}>
        Modo gym
        {hint && <span className="drawer-switch-hint">Letras grandes, solo lo esencial</span>}
      </span>
      <span className="gym-toggle-track" aria-hidden="true">
        <span className="gym-toggle-thumb" />
      </span>
    </button>
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

/*
 * Export / import buttons plus the "Listo: ..." message after an import.
 * `linkClass` styles each button like a nav row; `noteClass` styles the
 * message. `message` and `onMessage` live in the parent so it can clear
 * the text when the menu closes.
 */
export function BackupControls({ linkClass, noteClass, message, onMessage }) {
  const fileInput = useRef(null);

  // Reads the chosen backup file and merges it into your data.
  async function restore(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow choosing the same file again
    if (!file) return;
    try {
      const result = importData(await file.text());
      onMessage(`Listo: ${result.routines} rutinas y ${result.sessions} entrenamientos importados.`);
    } catch (error) {
      onMessage(error.message || "No se pudo leer el archivo.");
    }
  }

  return (
    <>
      <button type="button" className={linkClass} onClick={downloadBackup}>
        <Icon d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        Exportar copia
      </button>
      <button type="button" className={linkClass} onClick={() => fileInput.current?.click()}>
        <Icon d="M12 15V4M7 9l5-5 5 5M5 20h14" />
        Importar copia
      </button>
      <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={restore} />
      {message && (
        <p className={noteClass} role="status">
          {message}
        </p>
      )}
    </>
  );
}

/*
 * The note at the bottom of both navs: where your data lives, or a warning
 * when the browser refuses to save (private window).
 */
export function StorageNote({ persistent }) {
  if (!persistent) {
    return (
      <p className="warning">
        Este navegador no permite guardar datos (¿ventana privada?): lo que cargues se pierde al cerrar.
      </p>
    );
  }
  return (
    <p>
      Tus rutinas y tu historial se guardan en este dispositivo. Agregá la app a la pantalla de inicio para que el
      navegador no los borre, y bajate una copia de vez en cuando.
    </p>
  );
}
