import { zodResolver } from '@hookform/resolvers/zod'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useForm, type DefaultValues, type FieldValues, type Resolver, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import { FormProvider } from '../components/HookForm/FormProvider'

/**
 * Renders fields inside a real react-hook-form + zod form. `form.methods` is filled after render
 * so tests can call setValue / reset / getValues. Submit with the "submit" button; parsed values
 * land in `form.submitted`.
 */
export function renderForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  defaultValues: DefaultValues<T>,
  fields: ReactNode,
) {
  const form: { methods: UseFormReturn<T> | null; submitted: T[] } = { methods: null, submitted: [] }
  function Harness() {
    const methods = useForm<T>({
      // zod's input/output generics are wider than the form type; the runtime behaviour is what we test
      resolver: zodResolver(schema as never) as unknown as Resolver<T>,
      defaultValues,
    })
    form.methods = methods
    return (
      <FormProvider methods={methods} onSubmit={methods.handleSubmit((v) => void form.submitted.push(v))}>
        {fields}
        <button type="submit">submit</button>
      </FormProvider>
    )
  }
  return { ...render(<Harness />), form }
}
