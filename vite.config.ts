import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { scoreEngineAssets } from './src/vite-plugin.ts'

export default defineConfig({
  plugins: [vue(), scoreEngineAssets()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
  },
  build: { outDir: 'dist-playground' },
  preview: {
    port: 4180,
    strictPort: true,
  },
})
