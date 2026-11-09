'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

/** Loading placeholder. Hidden from screen readers — announce loading elsewhere (e.g. aria-busy). */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ className, ...props }, ref) {
  return <div ref={ref} aria-hidden="true" className={cn('bom-skeleton', className)} {...props} />
})

Skeleton.displayName = 'Skeleton'
