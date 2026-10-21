"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* A key. Off it stands raised (default) or sits flat in an engraved rim
   (outline); on, it is pressed into the surface and filled with the accent
   ink, so the state reads without the shadow. The theme's .neu-state-sink
   holds the pressed depth. */
const toggleVariants = cva(
  "neu neu-convex neu-active-sink neu-state-sink group/toggle inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap select-none text-(--neu-text-muted) [--neu-depth:0.33] [transition:box-shadow_var(--neu-ease-release),color_var(--neu-ease-release)] hover:not-data-[state=on]:text-(--neu-text) active:[transition:box-shadow_var(--neu-ease-press)] data-[state=on]:bg-(--neu-knob-ink) data-[state=on]:bg-none data-[state=on]:text-(--neu-surface) motion-reduce:[transition:none] disabled:pointer-events-none disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "neu-engrave",
      },
      size: {
        default: "h-9 min-w-9 px-2.5",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* A flat chip that becomes the raised cap when on: the keys of a toggle
   group, which sets their radius. The transparent border keeps the cap's
   rim from shifting layout. */
const toggleChipVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-2 border border-transparent text-sm font-medium whitespace-nowrap select-none text-(--neu-text-muted) outline-none [transition:color_var(--neu-ease-release)] neu-state-cap hover:not-data-[state=on]:text-(--neu-text) hover:not-data-[state=on]:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)] focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring)] data-[state=on]:text-(--neu-knob-ink) disabled:pointer-events-none disabled:opacity-50 aria-invalid:outline-solid aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-(--neu-text-muted) data-[state=on]:border-transparent",
      },
      size: {
        default: "h-9 min-w-9 px-2.5",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleChipVariants, toggleVariants }
