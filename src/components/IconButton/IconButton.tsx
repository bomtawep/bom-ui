import type * as React from "react"

import { Button } from "../Button/Button"

type IconSize = "xs" | "sm" | "default" | "lg"

const sizes = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const

/**
 * bom-ui extra: an icon-only Button. `aria-label` is required in the type because there is no
 * visible text to name it. Same as `<Button size="icon" aria-label="…">`.
 */
function IconButton({
  size = "default",
  variant = "ghost",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "aria-label" | "loading"> & {
  size?: IconSize
  "aria-label": string
}) {
  return <Button size={sizes[size]} variant={variant} {...props} />
}

export { IconButton }

export type IconButtonProps = React.ComponentProps<typeof IconButton>
