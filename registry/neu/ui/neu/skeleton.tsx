import * as React from "react"

import { cn } from "@/lib/utils"

/* Shallow carved well with a travelling raised bar carrying the real shadow
   pair, so the shimmer derives from the surface with no hardcoded grays.
   Keyframe percentages are relative to the bar, so every skeleton animates in
   lockstep; --neu-dir signs the run for RTL. React dedupes the <style> via
   href + precedence. Reduced motion hides the bar, leaving the still well. */
const waveKeyframes =
  "@keyframes neu-skeleton-wave{from{translate:calc(-150% * var(--neu-dir)) 0}to{translate:calc(450% * var(--neu-dir)) 0}}"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "neu-pressed relative overflow-hidden rounded-[calc(var(--neu-radius)/2)] [--neu-depth:0.25]",
        className
      )}
      {...props}
    >
      <style href="neu-skeleton-wave" precedence="medium">
        {waveKeyframes}
      </style>
      <div
        aria-hidden
        className="neu pointer-events-none absolute inset-y-0 start-0 w-2/5 rounded-full [--neu-depth:0.17] [animation:neu-skeleton-wave_2s_ease-in-out_infinite] motion-reduce:hidden"
      />
    </div>
  )
}

export { Skeleton }
