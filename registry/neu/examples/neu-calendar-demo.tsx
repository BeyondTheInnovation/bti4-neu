"use client"

import * as React from "react"

import { Calendar } from "@/registry/neu/ui/neu/calendar"

export function NeuCalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 5, 12)
  )

  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 5, 12)}
        className="neu mx-auto"
      />
    </div>
  )
}
