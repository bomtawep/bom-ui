'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type CardSize = 'sm' | 'md'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner spacing. Default 'md'. */
  size?: CardSize
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ size = 'md', className, ...props }, ref) {
  return <div ref={ref} className={cn('bom-card', `bom-card--${size}`, className)} {...props} />
})

Card.displayName = 'Card'

type DivProps = HTMLAttributes<HTMLDivElement>

function part(name: string, cls: string) {
  const Part = forwardRef<HTMLDivElement, DivProps>(function CardPart({ className, ...props }, ref) {
    return <div ref={ref} className={cn(cls, className)} {...props} />
  })
  Part.displayName = name
  return Part
}

export type CardHeaderProps = DivProps
export type CardTitleProps = DivProps
export type CardDescriptionProps = DivProps
export type CardActionProps = DivProps
export type CardContentProps = DivProps
export type CardFooterProps = DivProps

export const CardHeader = part('CardHeader', 'bom-card__header')
export const CardTitle = part('CardTitle', 'bom-card__title')
export const CardDescription = part('CardDescription', 'bom-card__description')
export const CardAction = part('CardAction', 'bom-card__action')
export const CardContent = part('CardContent', 'bom-card__content')
export const CardFooter = part('CardFooter', 'bom-card__footer')
