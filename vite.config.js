import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The whole app (catalog, 160+ animations, screens, the Supabase client)
    // ships as one file of about 720 kB, 200 kB once compressed: fine for a
    // phone. Vite warns from 500 kB; the limit is raised so the build stays
    // quiet until it really grows.
    chunkSizeWarningLimit: 850,
  },
})
