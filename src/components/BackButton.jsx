/*
 * BackButton.jsx
 *
 * The "Volver" arrow at the top of detail pages. If you got here by moving
 * around inside the app, it behaves like the phone's back button. If you
 * opened this page directly (a bookmark, a shared link), there is nothing to
 * go back to, so it jumps to `fallback` instead (the list page).
 *
 * `confirmMessage`: when set (e.g. the editor has unsaved changes), asks
 * first and only leaves if you accept.
 */
import { hasInAppHistory } from "../hooks/useHashRoute.js";

export default function BackButton({ fallback = "#/", confirmMessage = null }) {
  function goBack() {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    if (hasInAppHistory()) {
      window.history.back();
    } else {
      window.location.hash = fallback;
    }
  }

  return (
    <button type="button" className="back-button" onClick={goBack}>
      {/* Left-pointing chevron drawn with SVG, no icon font needed */}
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Volver
    </button>
  );
}
