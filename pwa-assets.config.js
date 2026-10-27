/*
 * pwa-assets.config.js
 *
 * Makes the app's icons (favicon, the ones phones use when the app is
 * installed, Apple's) from public/icon.svg. Run `npm run icons` after
 * changing the SVG; the PNGs land next to it in public/.
 * The padded versions (Android's "maskable", Apple's) get the app's dark
 * background instead of the default white; the plain ones have no margin.
 */
import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

const dark = { resizeOptions: { background: "#0D1117" } };

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The SVG already fills the square with its own background: no margin.
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, ...dark },
    apple: { ...minimal2023Preset.apple, ...dark },
  },
  images: ["public/icon.svg"],
});
