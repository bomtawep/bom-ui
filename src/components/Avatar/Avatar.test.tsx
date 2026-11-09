import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

describe('Avatar', () => {
  it('shows the fallback while the image has not loaded', () => {
    const { container } = render(
      <Avatar className="extra">
        <AvatarImage src="/me.png" alt="Me" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText('AB')).toHaveClass('bom-avatar__fallback')
    expect(container.firstElementChild).toHaveClass('bom-avatar', 'bom-avatar--md', 'extra')
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    const { container } = render(
      <Avatar size={size}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    expect(container.firstElementChild).toHaveClass(`bom-avatar--${size}`)
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLSpanElement>()
    const fbRef = createRef<HTMLSpanElement>()
    render(
      <Avatar ref={ref}>
        <AvatarFallback ref={fbRef}>AB</AvatarFallback>
      </Avatar>,
    )
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(fbRef.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('has displayNames', () => {
    expect(Avatar.displayName).toBe('Avatar')
    expect(AvatarImage.displayName).toBe('AvatarImage')
    expect(AvatarFallback.displayName).toBe('AvatarFallback')
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
