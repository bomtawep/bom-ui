import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { defaultPdfFetcher, PdfPreview } from './PdfPreview'

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:pdf')
  URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PdfPreview', () => {
  it('loads the PDF through the fetcher and shows it in an iframe', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Blob(['%PDF']))
    render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={fetcher} />)
    expect(await screen.findByTitle('Invoice')).toHaveAttribute('src', 'blob:pdf')
    expect(fetcher).toHaveBeenCalledWith('/doc.pdf')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('shows the error message when loading fails, and retries', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('Chrome not ready')).mockResolvedValue(new Blob(['%PDF']))
    render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={fetcher} />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('สร้าง PDF ไม่สำเร็จ')
    expect(alert).toHaveTextContent('Chrome not ready')
    await userEvent.click(screen.getByRole('button', { name: 'สร้างใหม่' }))
    expect(await screen.findByTitle('Invoice')).toBeInTheDocument()
  })

  it('revokes the blob URL on unmount', async () => {
    const { unmount } = render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={() => Promise.resolve(new Blob())} />)
    await screen.findByTitle('Invoice')
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pdf')
  })

  it('links to the PDF in a new tab and hides actions when asked', () => {
    const { rerender } = render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={() => new Promise(() => {})} />)
    expect(screen.getByRole('link', { name: 'เปิดแท็บใหม่' })).toHaveAttribute('href', '/doc.pdf')
    expect(screen.getByRole('button', { name: 'สร้างใหม่' })).toBeDisabled()
    rerender(<PdfPreview url="/doc.pdf" title="Invoice" actions={false} fetcher={() => new Promise(() => {})} />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('defaultPdfFetcher throws the JSON error message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Service Unavailable',
        json: () => Promise.resolve({ error: { message: 'Chrome not ready' } }),
      }),
    )
    await expect(defaultPdfFetcher('/x.pdf')).rejects.toThrow('Chrome not ready')
  })

  it('defaultPdfFetcher falls back to statusText', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, statusText: 'Bad Gateway', json: () => Promise.reject(new Error('no json')) }),
    )
    await expect(defaultPdfFetcher('/x.pdf')).rejects.toThrow('Bad Gateway')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={() => Promise.resolve(new Blob())} />)
    await screen.findByTitle('Invoice')
    await expectNoA11yViolations(container)
  })
})
