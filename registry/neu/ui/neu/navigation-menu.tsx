"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenuViewportContext = React.createContext(true)

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      <NavigationMenuViewportContext.Provider value={viewport}>
        {children}
      </NavigationMenuViewportContext.Provider>
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/* The list is the raised bar; the control-scale retune sits here so the flat
   trigger chips inherit the same ramp. */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group neu flex flex-1 list-none items-center justify-center gap-1 p-1 [--neu-depth:0.33]",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

/* A flat chip on the raised bar: hover is a bg tint only, the pair stays
   hidden until press or open, and .neu-state-sink holds it sunken while
   its panel is open. */
const navigationMenuTriggerStyle = cva(
  "group neu neu-active-sink neu-state-sink inline-flex h-9 w-max items-center justify-center rounded-[calc(var(--neu-radius)*0.5)] px-4 py-2 text-sm font-medium select-none [--neu-alpha:0] hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)] active:[--neu-alpha:inherit] disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:[--neu-alpha:inherit] data-[state=open]:[--neu-alpha:inherit]"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        navigationMenuTriggerStyle(),
        "group relative after:absolute after:inset-x-4 after:bottom-0.5 after:h-0.5 after:rounded-full data-[state=open]:after:bg-(--neu-ring)",
        className
      )}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ms-1 size-3 transition duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

/* Inside the viewport the panel is the viewport; without one the content
   carries the overlay sheet itself. */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  const viewport = React.useContext(NavigationMenuViewportContext)
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "neu-ground start-0 top-0 p-2 pe-2.5 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out motion-reduce:data-[motion^=from-]:animate-none motion-reduce:data-[motion^=to-]:animate-none md:absolute",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-[calc(var(--neu-radius)*0.75)]",
        !viewport && "neu-overlay neu-overlay-motion",
        className
      )}
      {...props}
    />
  )
}

/* The panel is the shared overlay sheet, so it matches every other popup. */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute start-0 top-full isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "neu-ground neu-overlay neu-overlay-motion relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] overflow-hidden rounded-[calc(var(--neu-radius)*0.75)] md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-[calc(var(--neu-radius)*0.5)] p-2 text-sm transition-colors hover:bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)] focus:bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)] focus-visible:outline-solid focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring,currentColor)] data-[active=true]:bg-[color-mix(in_oklab,var(--neu-text)_8%,transparent)] aria-[current=page]:bg-[color-mix(in_oklab,var(--neu-text)_8%,transparent)] motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-(--neu-text-muted)",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in motion-reduce:data-[state=hidden]:animate-none motion-reduce:data-[state=visible]:animate-none",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-(--neu-surface)" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
