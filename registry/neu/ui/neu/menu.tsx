/* One look for the dropdown menu, context menu and menubar, which wrap
   different Radix primitives. */

/* A floating sheet that casts one dark shadow (.neu-overlay); .neu-ground
   re-derives the text tokens because the portal renders outside the page's
   ground wrapper. Each menu adds its own size, overflow and origin. */
const menuSurfaceClasses =
  "neu-ground neu-overlay neu-overlay-motion z-50 rounded-[calc(var(--neu-radius)*0.75)] p-1"

const menuRowClasses =
  "relative flex cursor-default items-center gap-2 rounded-[calc(var(--neu-radius)*0.5)] py-1.5 text-sm outline-hidden select-none focus:bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)] focus:[box-shadow:inset_0_0_0_2px_var(--neu-ring)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const menuItemClasses = `${menuRowClasses} px-2 data-[inset]:ps-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] data-[variant=destructive]:focus:text-destructive [&_svg:not([class*='text-'])]:text-(--neu-text-muted) data-[variant=destructive]:*:[svg]:text-destructive!`

/* Checkbox and radio items keep a start gutter for the indicator. */
const menuCheckItemClasses = `${menuRowClasses} ps-8 pe-2`

const menuIndicatorClasses =
  "pointer-events-none absolute start-2 flex size-3.5 items-center justify-center"

const menuSubTriggerClasses = `${menuRowClasses} px-2 data-[inset]:ps-8 data-[state=open]:bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)] [&_svg:not([class*='text-'])]:text-(--neu-text-muted)`

const menuLabelClasses =
  "px-2 py-1.5 text-xs font-medium text-(--neu-text-muted) data-[inset]:ps-8"

const menuSeparatorClasses =
  "pointer-events-none -mx-1 my-1 h-px bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)]"

const menuShortcutClasses =
  "ms-auto text-xs tracking-widest text-(--neu-text-muted)"

export {
  menuCheckItemClasses,
  menuIndicatorClasses,
  menuItemClasses,
  menuLabelClasses,
  menuSeparatorClasses,
  menuShortcutClasses,
  menuSubTriggerClasses,
  menuSurfaceClasses,
}
