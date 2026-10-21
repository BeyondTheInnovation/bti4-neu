import * as React from "react"
import { Slot as SlotPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Chip-scale retune: at badge size the default 12px ramp has no flank, so
   distance/blur shrink locally, same rule as the checkbox. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap select-none [--neu-depth:0.25] focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring,currentColor)] aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "neu",
        secondary: "neu-pressed",
        destructive: "neu bg-destructive text-(--neu-surface)",
        outline:
          "neu border border-(--neu-text-muted) [--neu-alpha:0] [a&]:hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)]",
        ghost:
          "neu [--neu-alpha:0] [a&]:hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)]",
        link: "text-[var(--neu-knob-ink,currentColor)] underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
