import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Library build published to npm. Entries:
//   index    → Vue component + helpers (browser)
//   vite     → scoreEngineAssets() plugin (Node)
//   samples  → demo MNX fixtures (browser)
// `vue` and the Viritura packages stay external so consumers dedupe them.
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        vite: fileURLToPath(new URL('./src/vite-plugin.ts', import.meta.url)),
        samples: fileURLToPath(new URL('./src/samples/index.ts', import.meta.url)),
      },
      formats: ['es'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', '@viritura/score-engine', '@viritura/score-viewer', 'vite', /^node:/],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name][extname]',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
})
