/*
 * Notices.jsx
 *
 * Small pills at the bottom of the screen, above the tab bar (and above a
 * screen's action bar, like the workout's "Terminar"):
 *   - "Sin conexión": the last download failed for lack of signal, so the
 *     app shows the copy kept on the phone. Workouts still get logged and
 *     go up when the signal comes back.
 *   - "Hay una versión nueva": Vercel published a new version and the
 *     service worker already downloaded it. "Actualizar" reloads into it;
 *     otherwise it starts the next time the app is opened. Never reloads by
 *     itself (it could be in the middle of a workout).
 *
 * This is also where the service worker gets registered (useRegisterSW,
 * from vite-plugin-pwa; see vite.config.js). Coming back to the app checks
 * for a new version, at most every 10 minutes.
 */
import { useRegisterSW } from "virtual:pwa-register/react";
import { useRemoteStatus } from "../store/useStore.js";

const CHECK_EVERY = 10 * 60 * 1000;

function watchForUpdates(_url, registration) {
  if (!registration) return;
  let last = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || Date.now() - last < CHECK_EVERY) return;
    last = Date.now();
    registration.update().catch(() => {}); // no signal: try next time
  });
}

export default function Notices() {
  const { offline } = useRemoteStatus();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisteredSW: watchForUpdates });

  if (!offline && !needRefresh) return null;
  return (
    <div className="notices" role="status">
      {offline && <p className="notice">Sin conexión: estás viendo lo último que se bajó.</p>}
      {needRefresh && (
        <p className="notice">
          Hay una versión nueva.
          <button type="button" className="notice-action" onClick={() => updateServiceWorker(true)}>
            Actualizar
          </button>
        </p>
      )}
    </div>
  );
}
