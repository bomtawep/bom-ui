'use client'

import { forwardRef, useContext, type ComponentPropsWithoutRef, type ComponentRef, type HTMLAttributes } from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { cn } from '../../lib/cn'
import { MinusIcon } from '../../lib/icons'

export type InputOTPProps = ComponentPropsWithoutRef<typeof OTPInput> & {
  containerClassName?: string
}

/** One-time code input (from `input-otp`). Compose with InputOTPGroup / InputOTPSlot. */
export const InputOTP = forwardRef<ComponentRef<typeof OTPInput>, InputOTPProps>(function InputOTP(
  { className, containerClassName, ...props },
  ref,
) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn('bom-input-otp', containerClassName)}
      className={cn('bom-input-otp__input', className)}
      spellCheck={false}
      {...props}
    />
  )
}) as typeof OTPInput & { displayName?: string }

InputOTP.displayName = 'InputOTP'

export type InputOTPGroupProps = HTMLAttributes<HTMLDivElement>

export const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(function InputOTPGroup(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-input-otp__group', className)} {...props} />
})

InputOTPGroup.displayName = 'InputOTPGroup'

export interface InputOTPSlotProps extends HTMLAttributes<HTMLDivElement> {
  index: number
}

export const InputOTPSlot = forwardRef<HTMLDivElement, InputOTPSlotProps>(function InputOTPSlot(
  { index, className, ...props },
  ref,
) {
  const context = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {}
  return (
    <div ref={ref} data-active={isActive} className={cn('bom-input-otp__slot', className)} {...props}>
      {char}
      {hasFakeCaret && (
        <div className="bom-input-otp__caret-wrap">
          <div className="bom-input-otp__caret" />
        </div>
      )}
    </div>
  )
})

InputOTPSlot.displayName = 'InputOTPSlot'

export type InputOTPSeparatorProps = HTMLAttributes<HTMLDivElement>

export const InputOTPSeparator = forwardRef<HTMLDivElement, InputOTPSeparatorProps>(function InputOTPSeparator(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} role="separator" className={cn('bom-input-otp__separator', className)} {...props}>
      <MinusIcon />
    </div>
  )
})

InputOTPSeparator.displayName = 'InputOTPSeparator'
