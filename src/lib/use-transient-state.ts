'use client'

import { useLayoutEffect, useState } from 'react'

/**
 * State that resets to its initial value when the component is hidden by <Activity>
 * (Next.js cacheComponents keeps hidden pages mounted). Used for popovers that must
 * not stay open after navigating away and back.
 */
export function useTransientState<T>(initial: T) {
  const [initialValue] = useState(initial)
  const [value, setValue] = useState(initialValue)
  useLayoutEffect(() => () => setValue(initialValue), [initialValue])
  return [value, setValue] as const
}
