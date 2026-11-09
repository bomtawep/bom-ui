import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Separator } from './Separator'

describe('Separator', () => {
  it('is decorative by default and a separator when not', () => {
    const { container } = render(
      <>
        <Separator />
        <Separator decorative={false} orientation="vertical" />
      </>,
    )
    expect(container.querySelector('[data-slot="separator"]')).toHaveAttribute('role', 'none')
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Separator decorative={false} />)
    await expectNoA11yViolations(container)
  })
})
