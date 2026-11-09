import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Skeleton style={{ width: 48, height: 48, borderRadius: '9999px' }} />
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Skeleton style={{ width: 240, height: 16 }} />
        <Skeleton style={{ width: 180, height: 16 }} />
      </div>
    </div>
  ),
}
