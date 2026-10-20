/*
 * storage.js
 *
 * The ONLY file that touches the browser's storage. Everything personal
 * (your routines, your workout log) is kept here as one JSON object:
 *
 *   { version: 1, routines: [...], sessions: [...] }
 *
 * Why one place: today the data lives on this device (localStorage). The day
 * the app gets accounts and a database, only the files in src/store/ change;
 * the screens keep calling the same functions.
 *
 * How screens get updates: they subscribe (see useStore.js). Every write
 * notifies the subscribers, so the UI refreshes on its own.
 *
 * If storage is blocked (some private windows), the app keeps working with
 * an in-memory copy; isPersistent() tells the UI so it can warn the user.
 */

const KEY = "gym-cheatsheet:v1";
export const DATA_VERSION = 1;

const empty = () => ({ version: DATA_VERSION, routines: [], sessions: [] });

let data = null; // in-memory copy, loaded on first use
let persistent = true; // false when the browser refuses to save
let askedToPersist = false;
const listeners = new Set();

/* ---- Loading ---- */

// Upgrades data saved by an older version of the app. Only version 1 exists
// for now; future changes to the shape go here.
function migrate(raw) {
  if (!raw || typeof raw !== "object") return empty();
  return {
    version: DATA_VERSION,
    routines: Array.isArray(raw.routines) ? raw.routines : [],
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
  };
}

function load() {
  if (data) return data;
  try {
    const raw = window.localStorage.getItem(KEY);
    data = raw ? migrate(JSON.parse(raw)) : empty();
    // Probe once: some browsers allow reading but throw on writing.
    window.localStorage.setItem(`${KEY}:probe`, "1");
    window.localStorage.removeItem(`${KEY}:probe`);
  } catch {
    persistent = false;
    data = data ?? empty();
  }
  return data;
}

/* ---- Reading and writing ---- */

// Current snapshot. The same object is returned until something is written,
// which is what React's useSyncExternalStore needs.
export function readData() {
  return load();
}

// Applies a change and saves. `change` receives the current data and returns
// the new data (never modify the old object in place).
export function updateData(change) {
  data = change(load());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    persistent = false;
  }
  requestPersistence();
  listeners.forEach((listener) => listener());
  return data;
}

export function isPersistent() {
  load();
  return persistent;
}

// Asks the browser to keep this site's data even when space runs low.
// It is only a request; the browser may say no. Done once, on first save.
function requestPersistence() {
  if (askedToPersist) return;
  askedToPersist = true;
  try {
    navigator.storage?.persist?.();
  } catch {
    // not supported: nothing to do
  }
}

/* ---- Subscriptions ---- */

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// If the app is open in two tabs, a save in one refreshes the other.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    try {
      data = event.newValue ? migrate(JSON.parse(event.newValue)) : empty();
    } catch {
      return;
    }
    listeners.forEach((listener) => listener());
  });
}

/* ---- Backup ---- */

// The whole personal data as a JSON text, for the "Exportar" button.
export function exportData() {
  return JSON.stringify({ ...load(), exportedAt: new Date().toISOString() }, null, 2);
}

/*
 * Merges a backup into the current data. Items are matched by id; when both
 * sides have the same item, the most recently updated one wins. Returns how
 * many routines and sessions came in. Throws if the file is not a backup.
 */
export function importData(text) {
  const incoming = JSON.parse(text);
  if (!incoming || !Array.isArray(incoming.routines) || !Array.isArray(incoming.sessions)) {
    throw new Error("El archivo no es una copia de seguridad de esta app.");
  }
  const merge = (current, extra) => {
    const byId = new Map(current.map((item) => [item.id, item]));
    for (const item of extra) {
      if (!item?.id) continue;
      const mine = byId.get(item.id);
      if (!mine || (item.updatedAt ?? "") > (mine.updatedAt ?? "")) byId.set(item.id, item);
    }
    return [...byId.values()];
  };
  updateData((d) => ({
    ...d,
    routines: merge(d.routines, incoming.routines),
    sessions: merge(d.sessions, incoming.sessions),
  }));
  return { routines: incoming.routines.length, sessions: incoming.sessions.length };
}

/* ---- Small shared helpers ---- */

// Unique id for new items. Same format a database would use (UUID).
export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const now = () => new Date().toISOString();

// Placeholder owner until there are accounts. With a backend this becomes
// the signed-in user's id.
export const LOCAL_OWNER = "local";
