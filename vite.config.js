import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /*
     * The installable app (PWA). The build writes:
     *   - manifest.webmanifest: name, icons and colors the phone uses when
     *     the app is added to the home screen (it opens full screen);
     *   - sw.js, the service worker: keeps the whole app (code, styles,
     *     fonts, icons) on the phone, so it opens without signal.
     * Data is not its business: the routines and the log are kept by
     * src/store/storage.js, and requests to Supabase always go to the
     * network (only the app's own files are kept).
     * A new version downloads in the background and waits: UpdateBanner.jsx
     * offers "Actualizar", and otherwise it starts the next time the app opens.
     */
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // UpdateBanner.jsx registers it (useRegisterSW)
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        name: 'Respawn Fitness',
        short_name: 'Respawn',
        description: 'Tus rutinas, el catálogo de ejercicios y tu registro de entrenamientos.',
        lang: 'es-AR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0D1117',
        theme_color: '#0D1117',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // The INCA theme's fonts are not kept up front (most people never use
        // that theme): they are kept the first time they are downloaded.
        globIgnores: ['**/archivo-*.woff2', '**/ibm-plex-mono-*.woff2'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/(archivo|ibm-plex-mono)-.*\.woff2$/,
            handler: 'CacheFirst',
            options: { cacheName: 'theme-fonts', expiration: { maxEntries: 20 } },
          },
        ],
        // Any page opened without signal is the app itself (the router lives after the #).
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
