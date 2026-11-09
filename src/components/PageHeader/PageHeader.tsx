import type * as React from "react"
import { cn } from "cn"

/** bom-ui extra: page title + description + actions (wraps on narrow screens). */
function PageHeader({
  title,
  description,
  actions,
  headingLevel = 1,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons on the right. */
  actions?: React.ReactNode
  /** Heading level for the title. Default 1. */
  headingLevel?: 1 | 2
}) {
  const Heading = headingLevel === 2 ? "h2" : "h1"
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
      {...props}
    >
      <div className="space-y-1">
        <Heading data-slot="page-header-title" className="text-2xl font-semibold tracking-tight">
          {title}
        </Heading>
        {description && (
          <p data-slot="page-header-description" className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div data-slot="page-header-actions" className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

export { PageHeader }

export type PageHeaderProps = React.ComponentProps<typeof PageHeader>
