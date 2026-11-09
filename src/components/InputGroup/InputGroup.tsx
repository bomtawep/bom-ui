'use client'

import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from '../../lib/cn'
import { Button, type ButtonProps } from '../Button/Button'
import { Input, type InputProps } from '../Input/Input'
import { Textarea, type TextareaProps } from '../Textarea/Textarea'

export type InputGroupProps = HTMLAttributes<HTMLDivElement>

/** One bordered box holding an input/textarea plus addons (text, icons, buttons). */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup({ className, ...props }, ref) {
  return <div ref={ref} role="group" className={cn('bom-input-group', className)} {...props} />
})

InputGroup.displayName = 'InputGroup'

export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end'

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  align?: InputGroupAddonAlign
}

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(function InputGroupAddon(
  { align = 'inline-start', className, onClick, ...props },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || (e.target as HTMLElement).closest('button')) return
    // Clicking the addon's text focuses the control, like clicking a label
    e.currentTarget.parentElement?.querySelector<HTMLElement>('input, textarea')?.focus()
  }
  return (
    <div
      ref={ref}
      role="group"
      data-align={align}
      className={cn('bom-input-group__addon', `bom-input-group__addon--${align}`, className)}
      onClick={handleClick}
      {...props}
    />
  )
})

InputGroupAddon.displayName = 'InputGroupAddon'

export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm'

export interface InputGroupButtonProps extends Omit<ButtonProps, 'size'> {
  size?: InputGroupButtonSize
}

export const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(function InputGroupButton(
  { variant = 'ghost', size = 'xs', className, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size="sm"
      data-size={size}
      className={cn('bom-input-group__button', `bom-input-group__button--${size}`, className)}
      {...props}
    />
  )
})

InputGroupButton.displayName = 'InputGroupButton'

export type InputGroupTextProps = HTMLAttributes<HTMLSpanElement>

export const InputGroupText = forwardRef<HTMLSpanElement, InputGroupTextProps>(function InputGroupText(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cn('bom-input-group__text', className)} {...props} />
})

InputGroupText.displayName = 'InputGroupText'

export type InputGroupInputProps = InputProps

export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(function InputGroupInput(
  { className, ...props },
  ref,
) {
  return <Input ref={ref} className={cn('bom-input-group__control', className)} {...props} />
})

InputGroupInput.displayName = 'InputGroupInput'

export type InputGroupTextareaProps = TextareaProps

export const InputGroupTextarea = forwardRef<HTMLTextAreaElement, InputGroupTextareaProps>(function InputGroupTextarea(
  { className, ...props },
  ref,
) {
  return <Textarea ref={ref} className={cn('bom-input-group__control', className)} {...props} />
})

InputGroupTextarea.displayName = 'InputGroupTextarea'
