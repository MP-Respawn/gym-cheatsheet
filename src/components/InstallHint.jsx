/*
 * InstallHint.jsx
 *
 * A card at the top of Rutinas inviting to add the app to the home screen,
 * where it opens full screen and works without signal:
 *   - Chrome/Android: "Instalar" opens the browser's own dialog;
 *   - iPhone: there is no button for it, so it explains the two taps in
 *     Safari (Compartir, then "Agregar a inicio").
 * Nothing once installed, or in browsers that cannot install. The X hides
 * it for good on this phone (a per-phone preference: if storage is blocked
 * it just shows again next time).
 */
import { useState } from "react";
import { install } from "../store/install.js";
import { useInstall } from "../store/useStore.js";
import { Icon } from "./navShared.jsx";

const DISMISSED_KEY = "install-hint-dismissed";

function wasDismissed() {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InstallHint() {
  const state = useInstall();
  const [dismissed, setDismissed] = useState(wasDismissed);

  if (dismissed || (state !== "prompt" && state !== "ios")) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Storage blocked: it hides for now and may show again next time.
    }
  }

  return (
    <section className="panel install-hint" aria-label="Instalar la app">
      <button type="button" className="icon-button" aria-label="No mostrar más" onClick={dismiss}>
        <Icon d="M6 6l12 12M18 6L6 18" size={20} />
      </button>
      <h2 className="block-title">Tené la app en tu pantalla de inicio</h2>
      {state === "prompt" ? (
        <>
          <p className="hint">Se abre a pantalla completa y funciona sin señal en el gimnasio.</p>
          <button type="button" className="primary-button" onClick={() => install()}>
            Instalar
          </button>
        </>
      ) : (
        <p className="hint">
          En Safari tocá <strong>Compartir</strong> (el cuadrado con la flecha) y después{" "}
          <strong>Agregar a inicio</strong>. Se abre a pantalla completa y funciona sin señal en el gimnasio.
        </p>
      )}
    </section>
  );
}
