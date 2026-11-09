import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  // Tailwind only for Storybook — vite.config.ts is shared with Vitest, which needs no CSS.
  viteFinal: (cfg) => ({ ...cfg, plugins: [...(cfg.plugins ?? []), tailwindcss()] }),
}

export default config
