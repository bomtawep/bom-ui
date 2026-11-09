'use client'

import { useBomUI } from '../BomUIProvider/BomUIProvider'

/**
 * Visible "*" hidden from screen readers (the control announces required itself).
 * `announce` adds "(required)" for screen readers on controls that cannot announce it, e.g. a button.
 */
export function RequiredMark({ announce = false }: { announce?: boolean }) {
  const { messages } = useBomUI()
  return (
    <>
      <span aria-hidden="true" className="bom-field__required">
        *
      </span>
      {announce && <span className="bom-sr-only">({messages.required})</span>}
    </>
  )
}
