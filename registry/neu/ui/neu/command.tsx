"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/neu/ui/neu/dialog"

/* cmdk calls scrollIntoView on the selected item and its group heading, which
   also scrolls the window (on mount too). Items scroll their list instead. */
function scrollWithinList(node: HTMLElement) {
  const list = node.closest<HTMLElement>("[cmdk-list]")
  if (!list) return
  const item = node.getBoundingClientRect()
  const view = list.getBoundingClientRect()
  if (item.top < view.top) list.scrollTop -= view.top - item.top
  else if (item.bottom > view.bottom)
    list.scrollTop += item.bottom - view.bottom
}

function scopeScroll(node: HTMLElement | null) {
  if (node) node.scrollIntoView = () => scrollWithinList(node)
}

function withScopedScroll<T extends HTMLElement>(
  ref: React.Ref<T> | undefined,
  scope: (node: T | null) => void
) {
  return (node: T | null) => {
    scope(node)
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }
}

/* Standalone the root is a raised panel; inside a dialog or popover the host
   clips its outer shadows and shares its surface, so nothing to neutralize. */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "neu flex h-full w-full flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-(--neu-text-muted) [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="neu-pressed neu-field neu-concave mx-2 mt-2 flex h-9 shrink-0 items-center gap-2 px-3 [--neu-depth:0.33] focus-within:outline-solid focus-within:outline-(length:--neu-ring-width) focus-within:outline-offset-(--neu-ring-offset) focus-within:outline-[color:var(--neu-ring)]"
    >
      <SearchIcon className="size-4 shrink-0 text-(--neu-text-muted)" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-(--neu-text-muted) disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      ref={withScopedScroll(ref, (node) =>
        scopeScroll(
          node?.querySelector<HTMLElement>("[cmdk-group-heading]") ?? null
        )
      )}
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-(--neu-text-muted)",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      aria-hidden="true"
      className={cn(
        "-mx-1 h-px bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)]",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={withScopedScroll(ref, scopeScroll)}
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[calc(var(--neu-radius)*0.5)] px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)] data-[selected=true]:[box-shadow:inset_0_0_0_2px_var(--neu-ring)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-(--neu-text-muted)",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-(--neu-text-muted)",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
