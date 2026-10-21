"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { capFaceClasses, capLiftSmClasses } from "@/registry/neu/ui/neu/knob"

type KeyRect = { left: number; top: number; width: number; height: number }

/* Trays pad their keys by 4px (p-1), so a key's corner sits 4px inside the
   tray's: concentric at any --neu-radius, square at 0. */
const keyRadiusClasses = "rounded-[max(0px,calc(var(--neu-radius)-4px))]"

/**
 * Measures the element inside the container that matches `selector` and
 * follows it through resizes and state changes. `rect` stays null until the
 * first client measure, while disabled, and when nothing matches, so callers
 * can let the selected item sink itself as the fallback.
 */
function useSlidingKey<T extends HTMLElement>(
  selector: string,
  enabled: boolean,
  forwardedRef?: React.Ref<T>
) {
  const nodeRef = React.useRef<T | null>(null)
  const [rect, setRect] = React.useState<KeyRect | null>(null)

  React.useImperativeHandle(forwardedRef, () => nodeRef.current as T)

  React.useLayoutEffect(() => {
    const container = nodeRef.current
    if (!container || !enabled) {
      setRect(null)
      return
    }
    function measure() {
      const target = container?.querySelector<HTMLElement>(selector)
      setRect(
        target
          ? {
              left: target.offsetLeft,
              top: target.offsetTop,
              width: target.offsetWidth,
              height: target.offsetHeight,
            }
          : null
      )
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(container)
    const mutation = new MutationObserver(measure)
    mutation.observe(container, {
      attributeFilter: ["data-state"],
      subtree: true,
    })
    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [selector, enabled])

  return { ref: nodeRef, rect }
}

/** The raised cap that slides between the items of a carved tray. */
function SlidingKey({
  rect,
  className,
}: {
  rect: KeyRect | null
  className?: string
}) {
  if (!rect) return null
  return (
    <span
      aria-hidden
      data-slot="sliding-key"
      className={cn(
        capFaceClasses,
        capLiftSmClasses,
        keyRadiusClasses,
        "pointer-events-none absolute top-0 left-0 [transition:translate_240ms_cubic-bezier(0.23,1,0.32,1),width_240ms_cubic-bezier(0.23,1,0.32,1),height_240ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transition:none]",
        className
      )}
      style={{
        translate: `${rect.left}px ${rect.top}px`,
        width: rect.width,
        height: rect.height,
      }}
    />
  )
}

export { SlidingKey, keyRadiusClasses, useSlidingKey, type KeyRect }
