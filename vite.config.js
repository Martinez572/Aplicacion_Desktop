import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración para evitar conflictos de archivos bloqueados con Rust/Tauri
  server: {
    watch: {
      ignored: ["**/src-tauri/target/**"],
    },
  },
})