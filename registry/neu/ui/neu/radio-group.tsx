"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { capFaceClasses, capLiftSmClasses } from "@/registry/neu/ui/neu/knob"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

/* A carved hole that never moves; checking raises the switch's cap out of
   it, retinted to the accent. The indicator stays mounted so the old cap
   sinks (140ms) while the new one rises (280ms): the sink is quicker, so
   two radios never read as both checked. */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "neu-pressed neu-field neu-concave peer relative grid aspect-square size-6.5 shrink-0 cursor-pointer place-content-center rounded-full [--neu-depth:0.25] [--neu-radius:999px] after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        forceMount
        className={cn(
          capFaceClasses,
          capLiftSmClasses,
          "neu-rise block size-4 [--neu-knob:var(--neu-ring)]"
        )}
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
