"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/neu/ui/neu/button"

/* No background of its own: the calendar sits on whatever surface hosts it
   (a raised card, a popover). Day cells share the control-scale retune. */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-3 [--cell-size:--spacing(8)] [--neu-depth:0.33]",
        String.raw`**:[.rdp-button\_next>svg]:scale-x-(--neu-dir)`,
        String.raw`**:[.rdp-button\_previous>svg]:scale-x-(--neu-dir)`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-[calc(var(--neu-radius)*0.5)] border border-[color-mix(in_oklab,var(--neu-text)_12%,transparent)] has-focus:outline-(length:--neu-ring-width) has-focus:outline-offset-(--neu-ring-offset) has-focus:outline-(--neu-ring)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-(--neu-surface) opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-[calc(var(--neu-radius)*0.5)] ps-2 pe-1 text-sm [&>svg]:size-3.5 [&>svg]:text-(--neu-text-muted)",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-[calc(var(--neu-radius)*0.5)] text-[0.8rem] font-normal text-(--neu-text-muted) select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-(--neu-text-muted) select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-[calc(var(--neu-radius)*0.5)]",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-[calc(var(--neu-radius)*0.5)]"
            : "[&:first-child[data-selected=true]_button]:rounded-s-[calc(var(--neu-radius)*0.5)]",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-s-[calc(var(--neu-radius)*0.5)] bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)]",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-[color-mix(in_oklab,var(--neu-text)_8%,transparent)]",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-e-[calc(var(--neu-radius)*0.5)] bg-[color-mix(in_oklab,var(--neu-text)_10%,transparent)]",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-[calc(var(--neu-radius)*0.5)] bg-[color-mix(in_oklab,var(--neu-ring)_15%,transparent)] data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-(--neu-text-muted) aria-selected:text-(--neu-text-muted)",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-(--neu-text-muted) opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

/* A selected day or range endpoint carves in via .neu-pressed, which outranks
   the ghost variant's raised stack by rule order, and takes the accent fill so
   selection never rests on the shadow alone. */
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const { dayPickerProps } = useDayPicker()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const sunken =
    (modifiers.selected && !modifiers.range_middle) ||
    modifiers.range_start ||
    modifiers.range_end

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(
        (locale ?? dayPickerProps.locale)?.code
      )}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-[calc(var(--neu-radius)*0.5)] bg-transparent leading-none font-normal [--neu-glint:0] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[range-end=true]:rounded-[calc(var(--neu-radius)*0.5)] data-[range-end=true]:rounded-e-[calc(var(--neu-radius)*0.5)] data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-start=true]:rounded-[calc(var(--neu-radius)*0.5)] data-[range-start=true]:rounded-s-[calc(var(--neu-radius)*0.5)] [&>span]:text-xs [&>span]:opacity-70",
        sunken &&
          "neu-pressed bg-(--neu-knob-ink) text-(--neu-surface) [--neu-alpha:1] [--neu-glint:inherit] contrast-more:bg-(--neu-text) contrast-more:[--neu-alpha:0] forced-colors:forced-color-adjust-none forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        modifiers.range_middle &&
          "forced-colors:forced-color-adjust-none forced-colors:text-[Highlight] forced-colors:underline",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
