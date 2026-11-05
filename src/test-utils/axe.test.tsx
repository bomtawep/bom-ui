import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from './axe'

describe('expectNoA11yViolations', () => {
  it('passes for an accessible fragment', async () => {
    const { container } = render(<button type="button">Save</button>)
    await expectNoA11yViolations(container)
  })

  it('fails for a button without an accessible name', async () => {
    const { container } = render(<button type="button" />)
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/button-name/)
  })
})
