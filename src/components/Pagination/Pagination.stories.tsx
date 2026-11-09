import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { page: 1, pageCount: 20, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {
  render: (args) => {
    const [page, setPage] = useState(5)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}

export const Simple: Story = {
  render: (args) => {
    const [page, setPage] = useState(1)
    return (
      <Pagination {...args} variant="simple" page={page} pageCount={12} total={115} pageSize={10} onPageChange={setPage} />
    )
  },
}
