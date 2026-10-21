"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"

/** Example name (file stem in registry/neu/examples) to its component. Each
 * demo is its own chunk, so a page downloads only the demos it renders. */
export const EXAMPLES: Record<string, ComponentType> = {
  "neu-accordion-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-accordion-demo").then(
      (m) => m.NeuAccordionDemo
    )
  ),
  "neu-alert-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-alert-demo").then((m) => m.NeuAlertDemo)
  ),
  "neu-alert-dialog-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-alert-dialog-demo").then(
      (m) => m.NeuAlertDialogDemo
    )
  ),
  "neu-aspect-ratio-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-aspect-ratio-demo").then(
      (m) => m.NeuAspectRatioDemo
    )
  ),
  "neu-avatar-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-avatar-demo").then(
      (m) => m.NeuAvatarDemo
    )
  ),
  "neu-badge-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-badge-demo").then((m) => m.NeuBadgeDemo)
  ),
  "neu-breadcrumb-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-breadcrumb-demo").then(
      (m) => m.NeuBreadcrumbDemo
    )
  ),
  "neu-button-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-button-demo").then(
      (m) => m.NeuButtonDemo
    )
  ),
  "neu-calendar-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-calendar-demo").then(
      (m) => m.NeuCalendarDemo
    )
  ),
  "neu-card-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-card-demo").then((m) => m.NeuCardDemo)
  ),
  "neu-carousel-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-carousel-demo").then(
      (m) => m.NeuCarouselDemo
    )
  ),
  "neu-checkbox-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-checkbox-demo").then(
      (m) => m.NeuCheckboxDemo
    )
  ),
  "neu-collapsible-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-collapsible-demo").then(
      (m) => m.NeuCollapsibleDemo
    )
  ),
  "neu-combobox-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-combobox-demo").then(
      (m) => m.NeuComboboxDemo
    )
  ),
  "neu-command-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-command-demo").then(
      (m) => m.NeuCommandDemo
    )
  ),
  "neu-context-menu-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-context-menu-demo").then(
      (m) => m.NeuContextMenuDemo
    )
  ),
  "neu-data-table-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-data-table-demo").then(
      (m) => m.NeuDataTableDemo
    )
  ),
  "neu-date-picker-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-date-picker-demo").then(
      (m) => m.NeuDatePickerDemo
    )
  ),
  "neu-dialog-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-dialog-demo").then(
      (m) => m.NeuDialogDemo
    )
  ),
  "neu-drawer-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-drawer-demo").then(
      (m) => m.NeuDrawerDemo
    )
  ),
  "neu-dropdown-menu-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-dropdown-menu-demo").then(
      (m) => m.NeuDropdownMenuDemo
    )
  ),
  "neu-form-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-form-demo").then((m) => m.NeuFormDemo)
  ),
  "neu-hover-card-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-hover-card-demo").then(
      (m) => m.NeuHoverCardDemo
    )
  ),
  "neu-input-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-input-demo").then((m) => m.NeuInputDemo)
  ),
  "neu-input-otp-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-input-otp-demo").then(
      (m) => m.NeuInputOtpDemo
    )
  ),
  "neu-label-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-label-demo").then((m) => m.NeuLabelDemo)
  ),
  "neu-menubar-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-menubar-demo").then(
      (m) => m.NeuMenubarDemo
    )
  ),
  "neu-navigation-menu-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-navigation-menu-demo").then(
      (m) => m.NeuNavigationMenuDemo
    )
  ),
  "neu-pagination-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-pagination-demo").then(
      (m) => m.NeuPaginationDemo
    )
  ),
  "neu-popover-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-popover-demo").then(
      (m) => m.NeuPopoverDemo
    )
  ),
  "neu-progress-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-progress-demo").then(
      (m) => m.NeuProgressDemo
    )
  ),
  "neu-radio-group-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-radio-group-demo").then(
      (m) => m.NeuRadioGroupDemo
    )
  ),
  "neu-resizable-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-resizable-demo").then(
      (m) => m.NeuResizableDemo
    )
  ),
  "neu-scroll-area-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-scroll-area-demo").then(
      (m) => m.NeuScrollAreaDemo
    )
  ),
  "neu-select-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-select-demo").then(
      (m) => m.NeuSelectDemo
    )
  ),
  "neu-separator-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-separator-demo").then(
      (m) => m.NeuSeparatorDemo
    )
  ),
  "neu-sheet-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-sheet-demo").then((m) => m.NeuSheetDemo)
  ),
  "neu-sidebar-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-sidebar-demo").then(
      (m) => m.NeuSidebarDemo
    )
  ),
  "neu-skeleton-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-skeleton-demo").then(
      (m) => m.NeuSkeletonDemo
    )
  ),
  "neu-slider-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-slider-demo").then(
      (m) => m.NeuSliderDemo
    )
  ),
  "neu-sonner-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-sonner-demo").then(
      (m) => m.NeuSonnerDemo
    )
  ),
  "neu-spinner-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-spinner-demo").then(
      (m) => m.NeuSpinnerDemo
    )
  ),
  "neu-switch-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-switch-demo").then(
      (m) => m.NeuSwitchDemo
    )
  ),
  "neu-table-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-table-demo").then((m) => m.NeuTableDemo)
  ),
  "neu-tabs-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-tabs-demo").then((m) => m.NeuTabsDemo)
  ),
  "neu-textarea-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-textarea-demo").then(
      (m) => m.NeuTextareaDemo
    )
  ),
  "neu-toggle-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-toggle-demo").then(
      (m) => m.NeuToggleDemo
    )
  ),
  "neu-toggle-group-demo": dynamic(() =>
    import("@/registry/neu/examples/neu-toggle-group-demo").then(
      (m) => m.NeuToggleGroupDemo
    )
  ),
  "neu-tooltip-demo": dynamic(
    () => import("@/registry/neu/examples/neu-tooltip-demo")
  ),
}

export function Example({ name }: { name: string }) {
  const Component = EXAMPLES[name]
  return Component ? <Component /> : null
}
