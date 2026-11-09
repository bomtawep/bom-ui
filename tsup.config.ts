import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

// Tailwind source CSS for consumers to compile (they need Tailwind CSS v4):
//   dist/theme.css  = shadcn theme + `@source` for the components
//   dist/source.css = `@source` only, for apps that already have their own shadcn theme
async function writeCss() {
  const source = '\n/* Let Tailwind find the classes used by @bomtawep/ui */\n@source "./";\n'
  await copyFile('src/styles/shadcn-tailwind.css', 'dist/shadcn-tailwind.css')
  await writeFile('dist/theme.css', (await readFile('src/styles/theme.css', 'utf8')) + source)
  await writeFile('dist/source.css', source.trimStart())
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'react-hook-form', 'tailwindcss'],
  // Directives are stripped during bundling; re-add so App Router treats the bundle as client code.
  banner: { js: "'use client'" },
  onSuccess: writeCss,
})
