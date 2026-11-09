'use client'

import { useId } from 'react'

/**
 * Ids for a labelled form field. useId keeps ids unique when the same field name renders
 * twice on a page (e.g. a form in a dialog plus a page hidden by <Activity>).
 * describedBy lets screen readers read the description and error after the label.
 */
export function useFieldIds(prefix: string, name: string, opts: { description?: unknown; invalid?: boolean }) {
  const uid = useId()
  const fieldId = `${prefix}-${name}-${uid}`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const describedBy =
    [opts.description ? descriptionId : null, opts.invalid ? errorId : null].filter(Boolean).join(' ') || undefined
  return {
    fieldId,
    labelId: `${fieldId}-label`,
    valueId: `${fieldId}-value`,
    descriptionId,
    errorId,
    describedBy,
  }
}
