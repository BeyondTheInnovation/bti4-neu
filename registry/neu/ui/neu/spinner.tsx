import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/* The wrapper spins, not the svg: Chrome runs transform animations on svg
   elements on the main thread, but composites them on an HTML box. */
function Spinner({
  className,
  "aria-label": label = "Loading",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label={label}
      className="inline-flex shrink-0 animate-spin motion-reduce:[animation-duration:3s]"
    >
      <Loader2Icon
        aria-hidden
        className={cn("size-4 text-(--neu-text-muted)", className)}
        {...props}
      />
    </span>
  )
}

export { Spinner }
