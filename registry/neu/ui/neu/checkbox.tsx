"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon, MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* A square well, the radio's hole made square; checking lifts an accent
   tick off its floor. The indicator stays mounted so the tick sinks on
   uncheck instead of vanishing. 26px floor: on a smaller well the inset
   ramp has no flank to fall off and the carved read collapses. The corner
   caps at 8px so a large theme radius never turns it into a radio. */
function Checkbox({
  className,
  tick = "on-check",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  tick?: "on-check" | "always"
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-tick={tick}
      className={cn(
        "neu-pressed neu-field neu-concave peer relative grid size-6.5 shrink-0 cursor-pointer place-content-center rounded-[min(calc(var(--neu-radius)/2),8px)] [--neu-depth:0.25] after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        forceMount
        className={cn(
          "group/checkbox-indicator neu-rise neu-glyph-lift grid place-content-center text-(--neu-ring)",
          tick === "always" &&
            "data-[state=unchecked]:text-(--neu-text-muted) data-[state=unchecked]:opacity-30"
        )}
      >
        <CheckIcon
          className="size-4 group-data-[state=indeterminate]/checkbox-indicator:hidden"
          strokeWidth={3.5}
        />
        <MinusIcon
          className="hidden size-4 group-data-[state=indeterminate]/checkbox-indicator:block"
          strokeWidth={3.5}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
