"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import s from "./ask-claude.module.css"
import {
  type ElementSource,
  formatSourceLocation,
  getElementSource,
} from "./get-element-source"

const STORAGE_KEY = "ask-claude"

interface Selection {
  rect: DOMRect
  source: ElementSource | null
  tag: string
  classes: string
}

export function AskClaude() {
  const [active, setActive] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "on"
  )
  const exit = useCallback(() => setActive(false), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "o" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setActive((on) => !on)
      }
    }

    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, active ? "on" : "off")
  }, [active])

  return active ? <Inspector onExit={exit} /> : null
}

function Inspector({ onExit }: { onExit: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [prompt, setPrompt] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function isOwnUI(target: EventTarget | null) {
      return target instanceof Node && rootRef.current?.contains(target)
    }

    function onMouseMove(event: MouseEvent) {
      if (selection || isOwnUI(event.target)) return
      if (event.target instanceof Element) {
        setHoverRect(event.target.getBoundingClientRect())
      }
    }

    // Radix triggers open on pointerdown, so a click alone is too late.
    function onPress(event: Event) {
      if (isOwnUI(event.target)) return
      event.preventDefault()
      event.stopPropagation()
    }

    function onClick(event: MouseEvent) {
      if (isOwnUI(event.target)) return
      if (!(event.target instanceof Element)) return
      event.preventDefault()
      event.stopPropagation()

      const element = event.target
      setSelection({
        rect: element.getBoundingClientRect(),
        source: getElementSource(element),
        tag: element.tagName.toLowerCase(),
        classes: Array.from(element.classList).slice(0, 3).join(" "),
      })
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      if (!selection) return onExit()
      setSelection(null)
      setPrompt("")
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("pointerdown", onPress, true)
    document.addEventListener("mousedown", onPress, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("pointerdown", onPress, true)
      document.removeEventListener("mousedown", onPress, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [selection, onExit])

  async function copyPrompt() {
    if (!selection) return
    const location = formatSourceLocation(selection.source)
    const tag = selection.classes
      ? `<${selection.tag} class="${selection.classes}">`
      : `<${selection.tag}>`
    await navigator.clipboard.writeText(`${location}\n${tag}\n\n${prompt}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function cancel() {
    setSelection(null)
    setPrompt("")
  }

  return (
    <div ref={rootRef}>
      {hoverRect && !selection && (
        <div
          className={s.highlight}
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      )}
      {selection && (
        <>
          <div
            className={s.selected}
            style={{
              top: selection.rect.top,
              left: selection.rect.left,
              width: selection.rect.width,
              height: selection.rect.height,
            }}
          />
          <div
            className={s.popover}
            style={{
              top: Math.min(
                selection.rect.bottom + 8,
                window.innerHeight - 220
              ),
              left: Math.max(
                8,
                Math.min(selection.rect.left, window.innerWidth - 340)
              ),
            }}
          >
            <p className={s.meta}>
              {formatSourceLocation(selection.source)} {`<${selection.tag}>`}
            </p>
            <textarea
              autoFocus
              className={s.textarea}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  copyPrompt()
                }
              }}
              placeholder="What should change here? (Enter to copy, Shift+Enter for a new line)"
              value={prompt}
            />
            <div className={s.actions}>
              <button onClick={cancel} type="button">
                Cancel
              </button>
              <button className={s.primary} onClick={copyPrompt} type="button">
                {copied ? "Copied!" : "Copy prompt"}
              </button>
            </div>
          </div>
        </>
      )}
      <div className={s.badge}>
        Ask Claude: click an element. <kbd>Esc</kbd> to exit
      </div>
    </div>
  )
}
