import * as React from "react"

import { cn } from "@/lib/utils"

/* A field is a well carved into the surface, so the inset pair is always on.
   Distance/blur retuned to control scale, per the theme's local-override rule. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "neu-pressed neu-field neu-concave h-9 w-full min-w-0 px-3.5 py-1 text-base [--neu-depth:0.33] selection:bg-(--neu-ring) selection:text-(--neu-surface) file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-current placeholder:text-(--neu-text-muted) disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
