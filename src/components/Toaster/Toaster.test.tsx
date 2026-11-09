import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Toaster, toast } from './index'

afterEach(() => {
  act(() => {
    toast.dismiss()
  })
  document.documentElement.classList.remove('dark')
})

describe('Toaster', () => {
  it('shows a toast fired with toast()', async () => {
    render(<Toaster />)
    act(() => {
      toast.success('Saved')
    })
    expect(await screen.findByText('Saved')).toBeInTheDocument()
  })

  it('follows class="dark" on <html>', async () => {
    document.documentElement.classList.add('dark')
    render(<Toaster />)
    act(() => {
      toast('x')
    })
    await screen.findByText('x')
    expect(document.querySelector('[data-sonner-toaster]')).toHaveAttribute('data-sonner-theme', 'dark')
  })
})
