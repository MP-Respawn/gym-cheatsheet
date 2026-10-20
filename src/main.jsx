/*
 * main.jsx
 *
 * Entry point: loads the global styles and mounts <App /> inside the
 * <div id="root"> from index.html. StrictMode only adds extra checks while
 * developing; it changes nothing in the final build.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
