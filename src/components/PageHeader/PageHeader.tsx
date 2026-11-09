'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  /** Buttons on the right (wraps below the title on narrow screens). */
  actions?: ReactNode
  /** Heading level for the title. Default 1. */
  headingLevel?: 1 | 2
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, description, actions, headingLevel = 1, className, ...props },
  ref,
) {
  const Heading = headingLevel === 2 ? 'h2' : 'h1'
  return (
    <div ref={ref} className={cn('bom-page-header', className)} {...props}>
      <div className="bom-page-header__text">
        <Heading className="bom-page-header__title">{title}</Heading>
        {description && <p className="bom-page-header__description">{description}</p>}
      </div>
      {actions && <div className="bom-page-header__actions">{actions}</div>}
    </div>
  )
})

PageHeader.displayName = 'PageHeader'
