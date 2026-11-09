import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './Calendar'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
  },
}

export const DropdownCaption: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={new Date(1950, 0)}
        endMonth={new Date()}
        selected={date}
        onSelect={setDate}
      />
    )
  },
}

export const DisabledFuture: Story = {
  render: () => <Calendar mode="single" disabled={{ after: new Date() }} />,
}
