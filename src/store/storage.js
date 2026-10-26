/*
 * storage.js
 *
 * The ONLY file that touches the browser's storage. What this phone keeps
 * for the signed-in person is one JSON object:
 *
 *   { version: 2, sessions: [...], assigned: { clients, programs, fetchedAt } | null }
 *
 *   sessions  the workout log (see workouts.js). Kept here first, so a
 *             workout survives a dropped connection; remote.js uploads it.
 *   assigned  the last copy downloaded of this person's routines (see
 *             remote.js / assigned.js), so they open without signal.
 *
 * Each account gets its own box (the key ends with the user id), so two
 * people sharing a phone never see each other's data. setStorageUser()
 * switches the box when someone signs in or out.
 *
 * How screens get updates: they subscribe (see useStore.js). Every write
 * notifies the subscribers, so the UI refreshes on its own.
 *
 * If storage is blocked (some private windows), the app keeps working with
 * an in-memory copy; isPersistent() tells the UI so it can warn the user.
 */

import { RENAMED_IDS } from "../data/renamedIds.js";

const KEY_PREFIX = "gym-cheatsheet:v2:";
export const DATA_VERSION = 2;

const empty = () => ({ version: DATA_VERSION, sessions: [], assigned: null });

let key = null; // storage key of the signed-in account; null = nobody
let data = null; // in-memory copy, loaded on first use
let persistent = true; // false when the browser refuses to save
let askedToPersist = false;
const listeners = new Set();

/* ---- Which account ---- */

// Switches to the box of this user (or to none, for null) and refreshes the UI.
export function setStorageUser(userId) {
  const next = userId ? `${KEY_PREFIX}${userId}` : null;
  if (next === key) return;
  key = next;
  data = null;
  listeners.forEach((listener) => listener());
}

/* ---- Loading ---- */

// The current id for an exercise id that may have been renamed.
export const currentId = (id) => RENAMED_IDS[id] ?? id;

// Points logged workouts at the current exercise ids (renamedIds.js), so
// history saved under an old id keeps showing up. Safe to run on every load.
function renameOldIds(sessions) {
  return sessions.map((s) => ({
    ...s,
    entries: (s.entries ?? []).map((e) => ({ ...e, exerciseId: currentId(e.exerciseId) })),
  }));
}

// Upgrades data saved by an older version of the app; future changes to the
// shape go here.
function migrate(raw) {
  if (!raw || typeof raw !== "object") return empty();
  return {
    version: DATA_VERSION,
    sessions: renameOldIds(Array.isArray(raw.sessions) ? raw.sessions : []),
    assigned: raw.assigned && typeof raw.assigned === "object" ? raw.assigned : null,
  };
}

function load() {
  if (data) return data;
  if (!key) return (data = empty());
  try {
    const raw = window.localStorage.getItem(key);
    data = raw ? migrate(JSON.parse(raw)) : empty();
    // Probe once: some browsers allow reading but throw on writing.
    window.localStorage.setItem(`${key}:probe`, "1");
    window.localStorage.removeItem(`${key}:probe`);
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
  if (key) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch {
      persistent = false;
    }
    requestPersistence();
  }
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
    if (!key || event.key !== key) return;
    try {
      data = event.newValue ? migrate(JSON.parse(event.newValue)) : empty();
    } catch {
      return;
    }
    listeners.forEach((listener) => listener());
  });
}

/* ---- Small shared helpers ---- */

// Unique id for new items, in the format the database uses (UUID v4).
export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const now = () => new Date().toISOString();
