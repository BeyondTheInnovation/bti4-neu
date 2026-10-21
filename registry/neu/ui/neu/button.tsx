import * as React from "react"
import { Slot as SlotPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* No shadow-*, ring-* or transition-* utilities on neu elements: they set
   box-shadow/transition from the utilities layer and clobber the theme's
   derived stacks and asymmetric easing. Focus and invalid use outline.
   surface "auto" makes raised keys convex so Curvature reaches them, and
   leaves ghost, outline and link flat: they have no raised face to curve. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "neu neu-active-sink",
        destructive: "neu neu-active-sink text-destructive",
        outline:
          "neu neu-engrave neu-active-sink hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)]",
        secondary: "neu neu-active-sink [--neu-depth:0.42] [--neu-shade:0.05]",
        ghost:
          "neu neu-active-sink [--neu-alpha:0] hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)] active:[--neu-alpha:inherit]",
        link: "text-[var(--neu-knob-ink,currentColor)] underline-offset-4 hover:underline focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring,currentColor)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-7 gap-1 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      surface: {
        auto: "",
        flat: "",
        convex: "neu-convex",
        concave: "neu-concave",
        realism: "neu-realism",
      },
    },
    compoundVariants: [
      {
        variant: ["default", "destructive", "secondary"],
        surface: "auto",
        class: "neu-convex",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      surface: "auto",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  surface = "auto",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-surface={surface}
      className={cn(buttonVariants({ variant, size, surface, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
