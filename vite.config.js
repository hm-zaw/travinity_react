import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['clsx', 'tailwind-merge'],
  },
  css: {
    devSourcemap: true, 
  },
  postcss: {
    map: {
      inline: false, 
    },
  },
})
