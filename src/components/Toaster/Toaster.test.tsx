import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Toaster, toast } from './index'

afterEach(() => {
  act(() => {
    toast.dismiss()
  })
  delete document.documentElement.dataset.theme
})

describe('Toaster', () => {
  it('shows a toast fired with toast()', async () => {
    render(<Toaster />)
    act(() => {
      toast('Saved')
    })
    const el = await screen.findByText('Saved')
    expect(el.closest('.bom-toast')).toBeInTheDocument()
  })

  it('maps toast types to bom classes', async () => {
    render(<Toaster />)
    act(() => {
      toast.error('Oops')
    })
    expect((await screen.findByText('Oops')).closest('.bom-toast--danger')).toBeInTheDocument()
  })

  it('follows <html data-theme>', async () => {
    document.documentElement.dataset.theme = 'dark'
    const { container } = render(<Toaster />)
    act(() => {
      toast('x')
    })
    await screen.findByText('x')
    const toaster = (container.ownerDocument.querySelector('[data-sonner-toaster]') as HTMLElement)!
    expect(toaster).toHaveAttribute('data-sonner-theme', 'dark')
    expect(toaster).toHaveClass('bom-toaster')
  })

  it('has a displayName', () => {
    expect(Toaster.displayName).toBe('Toaster')
  })
})
