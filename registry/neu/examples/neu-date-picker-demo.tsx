"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/neu/ui/neu/button"
import { Calendar } from "@/registry/neu/ui/neu/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/neu/ui/neu/popover"

export function NeuDatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-start font-normal",
            !date && "text-(--neu-text-muted)"
          )}
        >
          <CalendarIcon />
          {date ? (
            date.toLocaleDateString("en-US", { dateStyle: "long" })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  )
}
