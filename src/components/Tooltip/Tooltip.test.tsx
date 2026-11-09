import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

describe('Tooltip', () => {
  it('shows on keyboard focus and hides with Escape', async () => {
    // like shadcn, a TooltipProvider is needed once near the app root
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Save</TooltipTrigger>
          <TooltipContent>Save the file</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await userEvent.tab()
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Save the file')
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Save the file')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
