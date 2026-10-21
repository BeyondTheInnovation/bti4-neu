"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { knobFaceClasses, knobLiftSmClasses } from "@/registry/neu/ui/neu/knob"

/* A carved groove filled with the accent up to the value. The thumb is a
   raised surface bead with an accent pip; 18px, and the ::after pad brings
   the hit area to 28px. */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  thumbLabels,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** One accessible name per thumb; overrides aria-label for that thumb. */
  thumbLabels?: string[]
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="neu-pressed neu-concave relative grow rounded-full [--neu-depth:0.25] [--neu-radius:999px] data-[orientation=horizontal]:h-3.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute rounded-full bg-(--neu-ring) data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={
            thumbLabels?.[index] ?? thumbLabel(ariaLabel, index, _values.length)
          }
          aria-labelledby={thumbLabels?.[index] ? undefined : ariaLabelledBy}
          className={cn(
            knobFaceClasses,
            knobLiftSmClasses,
            "relative block size-4.5 before:absolute before:top-1/2 before:left-1/2 before:size-1.5 before:-translate-1/2 before:rounded-full before:bg-(--neu-ring) after:absolute after:-inset-[5px] after:rounded-full after:content-[''] data-[disabled]:pointer-events-none"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

function thumbLabel(label: string | undefined, index: number, count: number) {
  if (!label || count === 1) return label
  if (count === 2) return `${label}, ${index === 0 ? "minimum" : "maximum"}`
  return `${label}, ${index + 1} of ${count}`
}

export { Slider }
