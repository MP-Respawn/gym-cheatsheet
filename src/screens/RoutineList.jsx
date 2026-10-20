/*
 * RoutineList.jsx: routine list (#/rutinas)
 *
 * Top: "Mis rutinas", the ones you built (saved on this device), with a
 * button to create a new one. Below: the trainer's routines, grouped under
 * "Bloque A" and "Bloque B". At the bottom, "Tus datos": backup tools.
 */
import { useRef, useState } from "react";
import { ROUTINES } from "../data/routines.js";
import { exportData, importData } from "../store/storage.js";
import { useIsPersistent, useMyRoutines } from "../store/useStore.js";

// Right-pointing chevron, hints that the card opens.
function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoutineCard({ routine }) {
  return (
    <a className="card routine-card" href={`#/rutina/${routine.id}`}>
      <div className="card-text">
        <span className="card-title">{routine.name}</span>
        {routine.focus && <span className="card-meta">{routine.focus}</span>}
        <span className="card-desc">{routine.steps.length} pasos</span>
      </div>
      <Chevron />
    </a>
  );
}

// Downloads all your personal data as a .json file.
function downloadBackup() {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `machete-gimnasio-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function RoutineList() {
  const mine = useMyRoutines();
  const persistent = useIsPersistent();
  const fileInput = useRef(null);
  const [backupMessage, setBackupMessage] = useState("");

  // Unique block names, keeping their first-appearance order ("Bloque A", "Bloque B").
  const blocks = [...new Set(ROUTINES.map((r) => r.block))];

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
    <div className="screen">
      <div className="top-bar">
        <h1 className="top-title">Rutinas</h1>
      </div>

      <div className="content">
        {/* Your own routines */}
        <section className="list-section">
          <h2 className="section-title">Mis rutinas</h2>
          <div className="card-list">
            {mine.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
            <a className="add-button" href="#/rutina/nueva">
              + Nueva rutina
            </a>
          </div>
        </section>

        {/* The trainer's routines */}
        {blocks.map((block) => (
          <section key={block} className="list-section">
            <h2 className="section-title">{block}</h2>
            <div className="card-list">
              {ROUTINES.filter((r) => r.block === block).map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </section>
        ))}

        {/* Backup: your data only lives on this device for now */}
        <section className="list-section data-section">
          <h2 className="section-title">Tus datos</h2>
          {persistent ? (
            <p className="hint">
              Tus rutinas y tu historial se guardan en este teléfono. Agregá la app a la pantalla de inicio para que el
              navegador no los borre, y bajate una copia de vez en cuando.
            </p>
          ) : (
            <p className="hint warning">
              Este navegador no permite guardar datos (¿ventana privada?): lo que cargues se pierde al cerrar.
            </p>
          )}
          <div className="data-buttons">
            <button type="button" className="secondary-button" onClick={downloadBackup}>
              Exportar copia
            </button>
            <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
              Importar copia
            </button>
            <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={restore} />
          </div>
          {backupMessage && <p className="hint">{backupMessage}</p>}
        </section>
      </div>
    </div>
  );
}
