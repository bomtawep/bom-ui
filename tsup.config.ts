import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

// dist/styles.css = tokens + src/components/<Name>/<Name>.css (alphabetical).
// Consumers import it once: `import '@bomtawep/ui/styles.css'`.
async function bundleCss() {
  const entries = await readdir('src/components', { withFileTypes: true })
  const names = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  const parts = [await readFile('src/styles/tokens.css', 'utf8')]
  for (const name of names) {
    const file = `src/components/${name}/${name}.css`
    if (existsSync(file)) parts.push(await readFile(file, 'utf8'))
  }
  await writeFile('dist/styles.css', parts.join('\n'))
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  // Directives are stripped during bundling; re-add so App Router treats the bundle as client code.
  banner: { js: "'use client'" },
  onSuccess: bundleCss,
})
