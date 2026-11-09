'use client'

import { forwardRef, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { ExternalLinkIcon, FileWarningIcon, RefreshIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { Skeleton } from '../Skeleton/Skeleton'

/**
 * Default loader: fetch → Blob. On an HTTP error it throws with the message from a JSON body
 * (`error.message` or `message`) when there is one, so the preview shows a readable error
 * instead of raw JSON inside the iframe.
 */
export async function defaultPdfFetcher(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string }; message?: string } | null
    throw new Error(body?.error?.message ?? body?.message ?? res.statusText)
  }
  return res.blob()
}

const defaultErrorMessage = (error: unknown): ReactNode => (error instanceof Error ? error.message : String(error))

export interface PdfPreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  url: string
  /** iframe title (its accessible name). */
  title: string
  fetcher?: (url: string) => Promise<Blob>
  getErrorMessage?: (error: unknown) => ReactNode
  /** CSS height of the preview. Default '70vh'. */
  height?: string
  /** Show the regenerate / open-in-new-tab buttons. Default true. */
  actions?: boolean
}

type State = { key: string; blobURL?: string; error?: unknown }

/** Loads a PDF as a Blob first, then shows it in an iframe (errors are shown as text, not raw responses). */
export const PdfPreview = forwardRef<HTMLDivElement, PdfPreviewProps>(function PdfPreview(
  {
    url,
    title,
    fetcher = defaultPdfFetcher,
    getErrorMessage = defaultErrorMessage,
    height = '70vh',
    actions = true,
    className,
    style,
    ...props
  },
  ref,
) {
  const { messages } = useBomUI()
  const [nonce, setNonce] = useState(0)
  const key = `${url}#${nonce}`
  const [state, setState] = useState<State>({ key: '' })
  // keep the latest fetcher without reloading when an inline function changes identity
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false
    let blobURL: string | undefined
    fetcherRef
      .current(url)
      .then((blob) => {
        blobURL = URL.createObjectURL(blob)
        if (!cancelled) setState({ key, blobURL })
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ key, error })
      })
    return () => {
      cancelled = true
      if (blobURL) URL.revokeObjectURL(blobURL)
    }
  }, [url, key])

  const loading = state.key !== key

  return (
    <div
      ref={ref}
      className={cn('bom-pdf-preview', className)}
      style={{ '--bom-pdf-height': height, ...style } as CSSProperties}
      {...props}
    >
      {actions && (
        <div className="bom-pdf-preview__actions">
          <Button variant="secondary" size="sm" onClick={() => setNonce((n) => n + 1)} disabled={loading}>
            <RefreshIcon />
            {messages.pdfRegenerate}
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLinkIcon />
              {messages.pdfOpenNewTab}
            </a>
          </Button>
        </div>
      )}
      {loading ? (
        <Skeleton className="bom-pdf-preview__skeleton" />
      ) : state.error !== undefined ? (
        <div role="alert" className="bom-pdf-preview__error">
          <FileWarningIcon />
          <p>{messages.pdfFailed}</p>
          <p>{getErrorMessage(state.error)}</p>
        </div>
      ) : (
        <iframe src={state.blobURL} title={title} className="bom-pdf-preview__frame" />
      )}
    </div>
  )
})

PdfPreview.displayName = 'PdfPreview'
