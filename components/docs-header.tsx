"use client"

import * as React from "react"
import { useNotebookLayout } from "fumadocs-ui/layouts/notebook"
import { useSidebar } from "fumadocs-ui/components/sidebar/base"
import { buttonVariants } from "fumadocs-ui/components/ui/button"
import { PanelLeft } from "lucide-react"

import { SiteHeader } from "@/components/site-header"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0
  )
}

/**
 * Fumadocs' mobile drawer has no keyboard handling, so this gives it the
 * dialog behaviour: focus moves in, Tab stays inside, Escape closes, and
 * focus returns to the menu button.
 */
function useDrawerFocus(trigger: React.RefObject<HTMLButtonElement | null>) {
  const { open, setOpen, mode } = useSidebar()
  const active = open && mode === "drawer"

  React.useEffect(() => {
    if (!active) return
    const menuButton = trigger.current
    let drawer: HTMLElement | null = null
    const frame = requestAnimationFrame(() => {
      drawer = document.getElementById("nd-sidebar-mobile")
      if (drawer) focusables(drawer)[0]?.focus()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key !== "Tab" || !drawer) return
      const items = focusables(drawer)
      const first = items[0]
      const last = items.at(-1)
      if (!first || !last) return
      const inside = drawer.contains(document.activeElement)
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("keydown", onKeyDown)
      const focused = document.activeElement
      if (!focused || focused === document.body || drawer?.contains(focused)) {
        menuButton?.focus()
      }
    }
  }, [active, setOpen, trigger])
}

export function DocsHeader() {
  const { slots } = useNotebookLayout()
  const Trigger = slots.sidebar.trigger
  const trigger = React.useRef<HTMLButtonElement>(null)
  useDrawerFocus(trigger)

  return (
    <SiteHeader
      skipTo="#nd-page"
      className="sticky top-(--fd-docs-row-1) [grid-area:header] layout:[--fd-header-height:--spacing(14)]"
      menu={
        <Trigger
          ref={trigger}
          aria-label="Open navigation"
          className={buttonVariants({
            color: "ghost",
            size: "icon-sm",
            className: "-me-1.5 p-2 md:hidden",
          })}
        >
          <PanelLeft />
        </Trigger>
      }
    />
  )
}
