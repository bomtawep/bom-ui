import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

describe('Avatar', () => {
  it('shows the fallback while the image has not loaded', () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarImage src="/me.png" alt="Me" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText('AB')).toHaveAttribute('data-slot', 'avatar-fallback')
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', 'lg')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    await expectNoA11yViolations(container)
  })
})
