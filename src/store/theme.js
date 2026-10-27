/*
 * theme.js
 *
 * The app's look, chosen in the menu and kept on this phone:
 *   "oscuro"  Respawn dark (the original)
 *   "claro"   Respawn light: white cards with thin outlines
 *   "inca"    INCA MMA's brand (bone, grey and gold; Archivo + IBM Plex Mono)
 * Each theme is a set of values for the color and font variables at the top
 * of styles.css, switched by data-theme on <html> (none = oscuro).
 * index.html applies the saved one before the first paint, so the app never
 * flashes dark first; this file does it again when the person changes it.
 * Screens read it with useTheme() (useStore.js).
 */
export const THEMES = [
  { key: "oscuro", label: "Oscuro", barColor: "#0d1117", scheme: "dark" },
  { key: "claro", label: "Claro", barColor: "#f6f8fa", scheme: "light" },
  { key: "inca", label: "INCA", barColor: "#f4f1ea", scheme: "light" },
];

const KEY = "theme"; // same key as the script in index.html
const listeners = new Set();

function saved() {
  try {
    const value = window.localStorage.getItem(KEY);
    return THEMES.some((t) => t.key === value) ? value : "oscuro";
  } catch {
    return "oscuro";
  }
}

let current = typeof window === "undefined" ? "oscuro" : saved();

// Puts the theme on the page: the attribute, the phone's bar color, and
// whether form controls (date pickers, scrollbars) are drawn light or dark.
function apply(key) {
  const theme = THEMES.find((t) => t.key === key);
  const root = document.documentElement;
  if (key === "oscuro") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", key);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.barColor);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme.scheme);
}

export const getTheme = () => current;

export function setTheme(key) {
  if (!THEMES.some((t) => t.key === key) || key === current) return;
  current = key;
  apply(key);
  try {
    window.localStorage.setItem(KEY, key);
  } catch {
    // Storage blocked: the theme applies now, and the next visit starts dark.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
