import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

describe('Tooltip', () => {
  it('shows on keyboard focus and hides with Escape', async () => {
    render(
      <Tooltip>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipContent className="extra">Save the file</TooltipContent>
      </Tooltip>,
    )
    await userEvent.tab()
    const tip = await screen.findByRole('tooltip')
    expect(tip).toHaveTextContent('Save the file')
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Save the file')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('applies the bom class to the content', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>t</TooltipTrigger>
          <TooltipContent ref={ref} className="extra">
            tip
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(ref.current).toHaveClass('bom-tooltip', 'extra')
  })

  it('has displayNames', () => {
    expect(Tooltip.displayName).toBe('Tooltip')
    expect(TooltipProvider.displayName).toBe('TooltipProvider')
    expect(TooltipTrigger.displayName).toBe('TooltipTrigger')
    expect(TooltipContent.displayName).toBe('TooltipContent')
  })
})
