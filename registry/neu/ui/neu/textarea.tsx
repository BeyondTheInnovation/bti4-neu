import * as React from "react"

import { cn } from "@/lib/utils"

/* Same carved well as the input; distance/blur retuned to control scale. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "neu-pressed neu-field neu-concave field-sizing-content flex min-h-16 w-full px-3.5 py-2 text-base [--neu-depth:0.33] selection:bg-(--neu-ring) selection:text-(--neu-surface) placeholder:text-(--neu-text-muted) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
