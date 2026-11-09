"use client"

import * as React from "react"
import { cn } from "cn"
import { ExternalLinkIcon, FileWarningIcon, RefreshCwIcon } from "lucide-react"

import { useBomUI } from "../BomUIProvider/BomUIProvider"
import { Button } from "../Button/Button"
import { Skeleton } from "../Skeleton/Skeleton"

/**
 * Default loader: fetch → Blob. On an HTTP error it throws with the message from a JSON body
 * (`error.message` or `message`) when there is one, so the preview shows a readable error
 * instead of raw JSON inside the iframe.
 */
async function defaultPdfFetcher(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string }; message?: string } | null
    throw new Error(body?.error?.message ?? body?.message ?? res.statusText)
  }
  return res.blob()
}

const defaultErrorMessage = (error: unknown): React.ReactNode => (error instanceof Error ? error.message : String(error))

type State = { key: string; blobURL?: string; error?: unknown }

/** bom-ui extra: loads a PDF as a Blob, then shows it in an iframe (errors shown as text, not raw responses). */
function PdfPreview({
  url,
  title,
  fetcher = defaultPdfFetcher,
  getErrorMessage = defaultErrorMessage,
  height = "70vh",
  actions = true,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  url: string
  /** iframe title (its accessible name). */
  title: string
  fetcher?: (url: string) => Promise<Blob>
  getErrorMessage?: (error: unknown) => React.ReactNode
  /** CSS height of the preview. Default '70vh'. */
  height?: string
  /** Show the regenerate / open-in-new-tab buttons. Default true. */
  actions?: boolean
}) {
  const { messages } = useBomUI()
  const [nonce, setNonce] = React.useState(0)
  const key = `${url}#${nonce}`
  const [state, setState] = React.useState<State>({ key: "" })
  // keep the latest fetcher without reloading when an inline function changes identity
  const fetcherRef = React.useRef(fetcher)
  React.useEffect(() => {
    fetcherRef.current = fetcher
  })

  React.useEffect(() => {
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
      data-slot="pdf-preview"
      className={cn("flex flex-col gap-2", className)}
      style={{ ...style, ["--pdf-height" as string]: height }}
      {...props}
    >
      {actions && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setNonce((n) => n + 1)} disabled={loading}>
            <RefreshCwIcon />
            {messages.pdfRegenerate}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLinkIcon />
              {messages.pdfOpenNewTab}
            </a>
          </Button>
        </div>
      )}
      {loading ? (
        <Skeleton className="h-(--pdf-height) w-full" />
      ) : state.error !== undefined ? (
        <div
          role="alert"
          className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center text-sm text-muted-foreground"
        >
          <FileWarningIcon className="size-8" />
          <p>{messages.pdfFailed}</p>
          <p>{getErrorMessage(state.error)}</p>
        </div>
      ) : (
        <iframe src={state.blobURL} title={title} className="h-(--pdf-height) w-full rounded-md border" />
      )}
    </div>
  )
}

export { defaultPdfFetcher, PdfPreview }

export type PdfPreviewProps = React.ComponentProps<typeof PdfPreview>
