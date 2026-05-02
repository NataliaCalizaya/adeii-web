import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Esto hace que las rutas de los assets (CSS, JS) sean relativas y funcionen en cualquier lugar
})