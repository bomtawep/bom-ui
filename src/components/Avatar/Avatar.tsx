'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Avatar as AvatarPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize
}

export const Avatar = forwardRef<ComponentRef<typeof AvatarPrimitive.Root>, AvatarProps>(function Avatar(
  { size = 'md', className, ...props },
  ref,
) {
  return <AvatarPrimitive.Root ref={ref} className={cn('bom-avatar', `bom-avatar--${size}`, className)} {...props} />
})

Avatar.displayName = 'Avatar'

export type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>

export const AvatarImage = forwardRef<ComponentRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  function AvatarImage({ className, ...props }, ref) {
    return <AvatarPrimitive.Image ref={ref} className={cn('bom-avatar__image', className)} {...props} />
  },
)

AvatarImage.displayName = 'AvatarImage'

export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>

export const AvatarFallback = forwardRef<ComponentRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  function AvatarFallback({ className, ...props }, ref) {
    return <AvatarPrimitive.Fallback ref={ref} className={cn('bom-avatar__fallback', className)} {...props} />
  },
)

AvatarFallback.displayName = 'AvatarFallback'
