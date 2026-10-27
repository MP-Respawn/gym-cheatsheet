/*
 * main.jsx
 *
 * Entry point: loads the fonts and the global styles and mounts <App />
 * (and the notices) inside the <div id="root"> from index.html. StrictMode only adds extra
 * checks while developing; it changes nothing in the final build.
 *
 * The fonts (RPWN Studio type: Space Grotesk for the name and titles, DM Sans
 * for everything else) ship with the app instead of coming from Google, so
 * they work without signal. Only the "latin" files: they cover Spanish.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
// The INCA theme's fonts: Archivo with its width axis (titles go expanded)
// and IBM Plex Mono for labels. The browser only downloads them once that
// theme is in use.
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./styles.css";
import App from "./App.jsx";
import Notices from "./components/Notices.jsx";

// Notices also registers the service worker: next to App, so it runs on
// every screen, the sign-in one included (the app is saved from the first visit).
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Notices />
  </StrictMode>,
);
