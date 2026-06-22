import { defineConfig } from 'vitest/config'

// Standalone config used by scripts/verify-assignments.ts to run each
// assignment's tests in isolation, mirroring Sandpack's testing-library setup.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
  },
})
