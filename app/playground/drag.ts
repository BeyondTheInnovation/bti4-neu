"use client"

import * as React from "react"

type Point = { x: number; y: number; start: boolean; el: Element }

/* Pointer position inside the element, normalized to 0..1 on both axes. */
function useDrag<E extends Element>(onPoint: (p: Point) => void) {
  const ref = React.useRef<E>(null)
  const active = React.useRef<number | null>(null)

  const read = (e: React.PointerEvent, start: boolean) => {
    const el = ref.current!
    const b = el.getBoundingClientRect()
    onPoint({
      el,
      x: clamp((e.clientX - b.left) / b.width, 0, 1),
      y: clamp((e.clientY - b.top) / b.height, 0, 1),
      start,
    })
  }

  return {
    ref,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        if (active.current !== null || e.button !== 0) return
        active.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        e.preventDefault()
        const el = ref.current as HTMLElement | null
        const target = el?.matches("[role=slider]")
          ? el
          : el?.querySelector<HTMLElement>("[role=slider]")
        target?.focus({
          preventScroll: true,
          focusVisible: false,
        } as FocusOptions)
        read(e, true)
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (active.current === e.pointerId) read(e, false)
      },
      onPointerUp: (e: React.PointerEvent) => {
        if (active.current === e.pointerId) active.current = null
      },
      onPointerCancel: () => {
        active.current = null
      },
    },
  }
}

/* Arrow and page keys for a role="slider". Returns the next value or null. */
function stepKey(
  e: React.KeyboardEvent,
  value: number,
  {
    min,
    max,
    step,
    big = step * 10,
  }: { min: number; max: number; step: number; big?: number }
) {
  const map: Record<string, number> = {
    ArrowRight: step,
    ArrowUp: step,
    ArrowLeft: -step,
    ArrowDown: -step,
    PageUp: big,
    PageDown: -big,
  }
  let next: number | null = null
  if (e.key in map) next = value + map[e.key] * (e.shiftKey ? 10 : 1)
  if (e.key === "Home") next = min
  if (e.key === "End") next = max
  if (next === null) return null
  e.preventDefault()
  return round(clamp(next, min, max), step)
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function round(v: number, step: number) {
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 1)
  return Number((Math.round(v / step) * step).toFixed(digits))
}

export { clamp, round, stepKey, useDrag }
