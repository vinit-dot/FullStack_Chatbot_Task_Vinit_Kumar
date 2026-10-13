import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In development, requests to /api are forwarded to the Express server,
// so the browser never has to deal with CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
