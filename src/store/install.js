/*
 * install.js
 *
 * Can this app be added to the phone's home screen, and how. One of:
 *   "installed"  already opened as the installed app (full screen)
 *   "prompt"     Chrome/Android offered to install it: install() shows the
 *                browser's own "Instalar" dialog
 *   "ios"        iPhone/iPad: no button exists, the person does it from
 *                Safari's Compartir menu (InstallHint.jsx explains how)
 *   "none"       neither (a desktop browser that does not offer it...)
 * Screens read it with useInstall() (useStore.js).
 */
let offered = null; // Chrome's install offer, kept for our button
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // no mini-bar of its own: our button shows it
    offered = event;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    offered = null;
    notify();
  });
}

const standalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

// iPads say "Macintosh" now; the touch screen gives them away.
const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

export function installState() {
  if (standalone()) return "installed";
  if (offered) return "prompt";
  if (isIos()) return "ios";
  return "none";
}

export function subscribeInstall(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Shows the browser's install dialog (only in the "prompt" state).
export async function install() {
  if (!offered) return;
  const event = offered;
  offered = null; // it can only be shown once
  notify();
  await event.prompt();
}
