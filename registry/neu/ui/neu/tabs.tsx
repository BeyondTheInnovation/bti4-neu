"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  keyRadiusClasses,
  SlidingKey,
  useSlidingKey,
} from "@/registry/neu/ui/neu/sliding-key"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center p-1 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default:
          "neu-pressed neu-concave gap-0.5 [--neu-depth:0.25] group-data-[orientation=horizontal]/tabs:h-11",
        line: "gap-1 rounded-none bg-transparent group-data-[orientation=horizontal]/tabs:h-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* The same carved tray and sliding cap as ToggleGroup: idle triggers are
   flat, and the active one raises itself only until the cap is measured
   (data-key=item). */
function TabsList({
  className,
  variant = "default",
  children,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const { ref: listRef, rect } = useSlidingKey<HTMLDivElement>(
    "[data-slot=tabs-trigger][data-state=active]",
    variant !== "line",
    ref
  )

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-key={rect ? "sliding" : "item"}
      ref={listRef}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      <SlidingKey rect={rect} />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        keyRadiusClasses,
        "neu-state-cap relative inline-flex h-full flex-1 items-center justify-center gap-1.5 border border-transparent px-4 text-sm font-medium whitespace-nowrap select-none text-(--neu-text-muted) [transition:color_var(--neu-ease-release)] outline-none hover:text-(--neu-text) focus-visible:z-10 focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring)] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-(--neu-knob-ink) motion-reduce:[transition:none] group-data-[orientation=vertical]/tabs:h-9 group-data-[orientation=vertical]/tabs:flex-none group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[state=inactive]:[background:none] data-[state=inactive]:[box-shadow:none] group-data-[key=sliding]/tabs-list:[background:none] group-data-[key=sliding]/tabs-list:[box-shadow:none] group-data-[variant=line]/tabs-list:[background:none] group-data-[variant=line]/tabs-list:[box-shadow:none] group-data-[variant=line]/tabs-list:data-[state=active]:text-(--neu-text)",
        "after:absolute after:bg-current after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-end-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100 motion-reduce:after:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-[calc(var(--neu-radius)*0.5)] outline-none focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring)]",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
