import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup aria-label="Text alignment">
      <Button variant="secondary">Left</Button>
      <Button variant="secondary">Center</Button>
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Zoom">
      <Button variant="secondary">+</Button>
      <Button variant="secondary">−</Button>
    </ButtonGroup>
  ),
}

export const WithTextAndSeparator: Story = {
  render: () => (
    <ButtonGroup aria-label="Copy">
      <ButtonGroupText>v2.18.4</ButtonGroupText>
      <Button>Copy</Button>
      <ButtonGroupSeparator />
      <Button>Share</Button>
    </ButtonGroup>
  ),
}
