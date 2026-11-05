/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'

// Same files tsup concatenates into dist/styles.css.
import.meta.glob('../src/components/*/*.css', { eager: true })

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme (sets <html data-theme>)',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme as string
      return (
        <div
          style={{
            background: 'var(--bom-color-bg)',
            color: 'var(--bom-color-fg)',
            fontFamily: 'var(--bom-font-sans)',
            padding: '1.5rem',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
