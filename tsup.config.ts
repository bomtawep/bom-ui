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
    const dir = `src/components/${name}`
    const cssFiles = (await readdir(dir)).filter((f) => f.endsWith('.css'))
    for (const file of cssFiles) {
      if (file !== `${name}.css`) {
        throw new Error(`${dir}/${file}: component CSS must be named ${name}.css to be bundled into dist/styles.css`)
      }
    }
    if (cssFiles.includes(`${name}.css`)) parts.push(await readFile(`${dir}/${name}.css`, 'utf8'))
  }
  await writeFile('dist/styles.css', parts.join('\n'))
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'react-hook-form'],
  // Directives are stripped during bundling; re-add so App Router treats the bundle as client code.
  banner: { js: "'use client'" },
  onSuccess: bundleCss,
})
