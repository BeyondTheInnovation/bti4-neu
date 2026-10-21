"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* The slider minus interaction: the same groove and raised accent rod. The
   rod grows by width rather than sliding under a clip, so it keeps its lift
   and rounded ends and fills from the inline start in RTL too. */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "neu-pressed neu-concave relative h-3.5 w-full rounded-full [--neu-depth:0.25] [--neu-radius:999px]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="neu h-full rounded-full bg-(--neu-ring) [--neu-depth:0.125] [--neu-radius:999px] [transition:width_var(--neu-ease-release)] motion-reduce:[transition:none]"
        style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
