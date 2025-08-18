import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  plugins: [react()],
  // ב־EC2 נשאר '/', לבניית GitHub Pages נציב GH_PAGES=1 ונקבל /Vacations/
  base: process.env.GH_PAGES === '1' ? '/Vacations/' : '/',
  server: { open: true },
  preview: { host: '0.0.0.0', port: 4173 }
}))
