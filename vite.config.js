import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
