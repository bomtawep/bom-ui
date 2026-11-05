import { copyFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  // Directives are stripped during bundling; re-add so App Router treats the bundle as client code.
  banner: { js: "'use client'" },
  // Ship plain CSS for consumers to import once: `import '@bomtawep/ui/styles.css'`.
  onSuccess: async () => {
    await copyFile('src/styles/styles.css', 'dist/styles.css')
  },
})
