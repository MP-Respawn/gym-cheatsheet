import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The whole app (catalog, 160+ animations, screens) ships as one file of
    // about 500 kB, 140 kB once compressed: fine for a phone. Vite warns from
    // 500 kB; the limit is raised so the build stays quiet until it really grows.
    chunkSizeWarningLimit: 700,
  },
})
