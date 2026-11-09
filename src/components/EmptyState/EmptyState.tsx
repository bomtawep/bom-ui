'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** e.g. a "Create" button. */
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('bom-empty-state', className)} {...props}>
      {icon && (
        <div className="bom-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="bom-empty-state__title">{title}</p>
      {description && <p className="bom-empty-state__description">{description}</p>}
      {action && <div className="bom-empty-state__action">{action}</div>}
    </div>
  )
})

EmptyState.displayName = 'EmptyState'
