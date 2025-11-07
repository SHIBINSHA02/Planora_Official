// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Your existing plugins configuration is kept exactly as it was.
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  // --- ADD THIS ENTIRE BLOCK ---
  // This configures the Vite development server.
  server: {
    // This sets up the proxy.
    proxy: {
      
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosts
        secure: false,      // Can be useful for http targets
      }
    }
  }
})