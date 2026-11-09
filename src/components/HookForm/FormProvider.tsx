'use client'

import type { FormEventHandler, FormHTMLAttributes, ReactNode } from 'react'
import { FormProvider as RHFFormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form'

export interface FormProviderProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  methods: UseFormReturn<TFieldValues>
  /** Usually `methods.handleSubmit(onValid)`. */
  onSubmit?: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

/**
 * react-hook-form context + a <form noValidate> (the schema reports errors, not the browser).
 * Same name as react-hook-form's export — alias one of them if you import both in a file.
 */
export function FormProvider<TFieldValues extends FieldValues>({
  methods,
  onSubmit,
  children,
  ...formProps
}: FormProviderProps<TFieldValues>) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate {...formProps}>
        {children}
      </form>
    </RHFFormProvider>
  )
}
