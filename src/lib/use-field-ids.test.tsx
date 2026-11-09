import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFieldIds } from './use-field-ids'

describe('useFieldIds', () => {
  it('builds ids from prefix + name and joins describedBy', () => {
    const { result } = renderHook(() => useFieldIds('rhf-input', 'email', { description: 'x', invalid: true }))
    const ids = result.current
    expect(ids.fieldId).toMatch(/^rhf-input-email-/)
    expect(ids.descriptionId).toBe(`${ids.fieldId}-description`)
    expect(ids.errorId).toBe(`${ids.fieldId}-error`)
    expect(ids.labelId).toBe(`${ids.fieldId}-label`)
    expect(ids.describedBy).toBe(`${ids.descriptionId} ${ids.errorId}`)
  })

  it('omits describedBy when there is neither description nor error', () => {
    const { result } = renderHook(() => useFieldIds('rhf-input', 'email', {}))
    expect(result.current.describedBy).toBeUndefined()
  })

  it('gives two fields with the same name different ids', () => {
    const a = renderHook(() => useFieldIds('p', 'n', {})).result.current.fieldId
    const b = renderHook(() => useFieldIds('p', 'n', {})).result.current.fieldId
    expect(a).not.toBe(b)
  })
})
