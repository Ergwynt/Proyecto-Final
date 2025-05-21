import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias estándar usando path.resolve
    },
  },
})
// export default defineConfig({
//   plugins: [
//     vue(),
//     process.env.NODE_ENV === 'development' && vueDevTools(),  // Solo activar en desarrollo
//   ],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })
