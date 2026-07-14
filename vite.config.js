import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/biz-map/', // GitHub Pages 專案站台路徑：cchris320.github.io/biz-map/
  plugins: [react()],
})
