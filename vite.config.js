import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api-proxy': {
        target: 'http://136.118.48.181:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '')
      }
    }
  }
})
