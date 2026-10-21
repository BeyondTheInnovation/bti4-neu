"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  keyRadiusClasses,
  SlidingKey,
  useSlidingKey,
} from "@/registry/neu/ui/neu/sliding-key"
import { toggleChipVariants } from "@/registry/neu/ui/neu/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleChipVariants> & {
    spacing?: number
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
})

/* A carved well; the pressed item is the knob raised out of it. In
   single mode the knob is one element that slides to the pressed item. Until
   it is measured on the client, and whenever several items can be on, each
   pressed item paints its own knob (data-key=item), so no render shows an
   empty well. */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleChipVariants> & {
    spacing?: number
  }) {
  const { ref: groupRef, rect: key } = useSlidingKey<HTMLDivElement>(
    "[data-slot=toggle-group-item][data-state=on]",
    props.type === "single",
    ref
  )

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={props.orientation}
      data-key={key ? "sliding" : "item"}
      ref={groupRef}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "neu-pressed neu-concave group/toggle-group relative flex w-fit items-center gap-[max(--spacing(0.5),--spacing(var(--gap)))] p-1 [--neu-depth:0.25] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className
      )}
      {...props}
    >
      <SlidingKey rect={key} />
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleChipVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleChipVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        keyRadiusClasses,
        "relative shrink-0 focus:z-10 focus-visible:z-10 group-data-[key=sliding]/toggle-group:[background:none] group-data-[key=sliding]/toggle-group:[box-shadow:none]",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
