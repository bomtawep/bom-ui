export type ClassValue = string | false | null | undefined

/** Joins truthy class names. Internal helper — not exported from the package. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
