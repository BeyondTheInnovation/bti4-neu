export type Category =
  | "Actions"
  | "Forms"
  | "Data display"
  | "Feedback"
  | "Overlays"
  | "Navigation"
  | "Layout"

export type CatalogEntry = {
  /** Docs slug under /components, matches the registry item name. */
  slug: string
  title: string
  category: Category
  /** registry/neu/examples/<example>.tsx, absent for style-only items. */
  example?: string
  /** Rendered edge to edge in the gallery instead of a fixed-height tile. */
  wide?: boolean
  /** Contains fixed-position chrome, so previews trap it in a sized frame. */
  framed?: boolean
}

export const CATALOG: CatalogEntry[] = [
  {
    slug: "neu-button",
    title: "Button",
    category: "Actions",
    example: "neu-button-demo",
  },
  {
    slug: "neu-toggle",
    title: "Toggle",
    category: "Actions",
    example: "neu-toggle-demo",
  },
  {
    slug: "neu-toggle-group",
    title: "Toggle Group",
    category: "Actions",
    example: "neu-toggle-group-demo",
  },

  {
    slug: "neu-input",
    title: "Input",
    category: "Forms",
    example: "neu-input-demo",
  },
  {
    slug: "neu-textarea",
    title: "Textarea",
    category: "Forms",
    example: "neu-textarea-demo",
  },
  {
    slug: "neu-select",
    title: "Select",
    category: "Forms",
    example: "neu-select-demo",
  },
  {
    slug: "neu-checkbox",
    title: "Checkbox",
    category: "Forms",
    example: "neu-checkbox-demo",
  },
  {
    slug: "neu-radio-group",
    title: "Radio Group",
    category: "Forms",
    example: "neu-radio-group-demo",
  },
  {
    slug: "neu-switch",
    title: "Switch",
    category: "Forms",
    example: "neu-switch-demo",
  },
  {
    slug: "neu-slider",
    title: "Slider",
    category: "Forms",
    example: "neu-slider-demo",
  },
  { slug: "neu-knob", title: "Knob", category: "Forms" },
  {
    slug: "neu-label",
    title: "Label",
    category: "Forms",
    example: "neu-label-demo",
  },
  {
    slug: "neu-input-otp",
    title: "Input OTP",
    category: "Forms",
    example: "neu-input-otp-demo",
  },
  {
    slug: "neu-form",
    title: "Form",
    category: "Forms",
    example: "neu-form-demo",
  },
  {
    slug: "neu-combobox",
    title: "Combobox",
    category: "Forms",
    example: "neu-combobox-demo",
  },
  {
    slug: "neu-date-picker",
    title: "Date Picker",
    category: "Forms",
    example: "neu-date-picker-demo",
  },
  {
    slug: "neu-calendar",
    title: "Calendar",
    category: "Forms",
    example: "neu-calendar-demo",
  },

  {
    slug: "neu-card",
    title: "Card",
    category: "Data display",
    example: "neu-card-demo",
  },
  {
    slug: "neu-badge",
    title: "Badge",
    category: "Data display",
    example: "neu-badge-demo",
  },
  {
    slug: "neu-avatar",
    title: "Avatar",
    category: "Data display",
    example: "neu-avatar-demo",
  },
  {
    slug: "neu-table",
    title: "Table",
    category: "Data display",
    example: "neu-table-demo",
    wide: true,
  },
  {
    slug: "neu-data-table",
    title: "Data Table",
    category: "Data display",
    example: "neu-data-table-demo",
    wide: true,
  },
  {
    slug: "neu-carousel",
    title: "Carousel",
    category: "Data display",
    example: "neu-carousel-demo",
  },
  {
    slug: "neu-aspect-ratio",
    title: "Aspect Ratio",
    category: "Data display",
    example: "neu-aspect-ratio-demo",
  },

  {
    slug: "neu-alert",
    title: "Alert",
    category: "Feedback",
    example: "neu-alert-demo",
  },
  {
    slug: "neu-progress",
    title: "Progress",
    category: "Feedback",
    example: "neu-progress-demo",
  },
  {
    slug: "neu-skeleton",
    title: "Skeleton",
    category: "Feedback",
    example: "neu-skeleton-demo",
  },
  {
    slug: "neu-spinner",
    title: "Spinner",
    category: "Feedback",
    example: "neu-spinner-demo",
  },
  {
    slug: "neu-sonner",
    title: "Sonner",
    category: "Feedback",
    example: "neu-sonner-demo",
  },

  {
    slug: "neu-dialog",
    title: "Dialog",
    category: "Overlays",
    example: "neu-dialog-demo",
  },
  {
    slug: "neu-alert-dialog",
    title: "Alert Dialog",
    category: "Overlays",
    example: "neu-alert-dialog-demo",
  },
  {
    slug: "neu-drawer",
    title: "Drawer",
    category: "Overlays",
    example: "neu-drawer-demo",
  },
  {
    slug: "neu-sheet",
    title: "Sheet",
    category: "Overlays",
    example: "neu-sheet-demo",
  },
  {
    slug: "neu-popover",
    title: "Popover",
    category: "Overlays",
    example: "neu-popover-demo",
  },
  {
    slug: "neu-hover-card",
    title: "Hover Card",
    category: "Overlays",
    example: "neu-hover-card-demo",
  },
  {
    slug: "neu-tooltip",
    title: "Tooltip",
    category: "Overlays",
    example: "neu-tooltip-demo",
  },
  {
    slug: "neu-dropdown-menu",
    title: "Dropdown Menu",
    category: "Overlays",
    example: "neu-dropdown-menu-demo",
  },
  {
    slug: "neu-context-menu",
    title: "Context Menu",
    category: "Overlays",
    example: "neu-context-menu-demo",
  },
  {
    slug: "neu-menubar",
    title: "Menubar",
    category: "Overlays",
    example: "neu-menubar-demo",
  },
  {
    slug: "neu-command",
    title: "Command",
    category: "Overlays",
    example: "neu-command-demo",
  },

  {
    slug: "neu-tabs",
    title: "Tabs",
    category: "Navigation",
    example: "neu-tabs-demo",
  },
  {
    slug: "neu-breadcrumb",
    title: "Breadcrumb",
    category: "Navigation",
    example: "neu-breadcrumb-demo",
  },
  {
    slug: "neu-pagination",
    title: "Pagination",
    category: "Navigation",
    example: "neu-pagination-demo",
  },
  {
    slug: "neu-navigation-menu",
    title: "Navigation Menu",
    category: "Navigation",
    example: "neu-navigation-menu-demo",
  },
  {
    slug: "neu-sidebar",
    title: "Sidebar",
    category: "Navigation",
    example: "neu-sidebar-demo",
    wide: true,
    framed: true,
  },

  {
    slug: "neu-accordion",
    title: "Accordion",
    category: "Layout",
    example: "neu-accordion-demo",
  },
  {
    slug: "neu-collapsible",
    title: "Collapsible",
    category: "Layout",
    example: "neu-collapsible-demo",
  },
  {
    slug: "neu-separator",
    title: "Separator",
    category: "Layout",
    example: "neu-separator-demo",
  },
  {
    slug: "neu-resizable",
    title: "Resizable",
    category: "Layout",
    example: "neu-resizable-demo",
  },
  {
    slug: "neu-scroll-area",
    title: "Scroll Area",
    category: "Layout",
    example: "neu-scroll-area-demo",
  },
]

export function catalogEntry(slug: string) {
  return CATALOG.find((entry) => entry.slug === slug)
}
