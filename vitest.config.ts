import { defineConfig } from 'vitest/config'

// Unit tests cover pure MNX helpers and sample data; they do not start Vite,
// so they must not load the playground config (which copies engine assets into
// public/score-engine as a side effect).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
})
