import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://raphaelbp12.github.io/youtube-playlist/
  base: '/youtube-playlist/',
  plugins: [react()],
})
