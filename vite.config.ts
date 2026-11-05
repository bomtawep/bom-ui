import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Shared by Vitest (the `test` block) and Storybook (auto-loads vite.config.ts).
// Not used by tsup — the library build is configured in tsup.config.ts.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
