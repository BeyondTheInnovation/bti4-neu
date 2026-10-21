"use client"

import * as React from "react"
import { Pipette } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/neu/ui/neu/button"
import { Input } from "@/registry/neu/ui/neu/input"
import { RadioGroup, RadioGroupItem } from "@/registry/neu/ui/neu/radio-group"

import { type Swatches, isHex, surfaceTone } from "./color"
import { Card } from "./parts"
import { PALETTE } from "./theme"

function toHex(value: string) {
  const hex = value.startsWith("#") ? value : `#${value}`
  if (!isHex(hex)) return null
  const full = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (c) => c + c) : hex
  return full.toLowerCase()
}

function SurfaceInstrument({
  surfaceHex,
  sw,
  onChange,
}: {
  surfaceHex: string
  sw: Swatches
  onChange: (hex: string) => void
}) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const tone = surfaceTone(surfaceHex)
  const custom = !PALETTE.some((p) => p.hex === surfaceHex.toLowerCase())

  return (
    <Card title="Surface" wide value={`L ${sw.l.toFixed(2)} · ${tone}`}>
      <div className="flex flex-col gap-2.5">
        <Input
          aria-label="Surface hex"
          spellCheck={false}
          className="h-9 font-mono text-sm uppercase"
          value={draft ?? surfaceHex}
          onChange={(e) => {
            const v = e.target.value.trim()
            setDraft(v)
            const hex = toHex(v)
            if (hex && v.replace("#", "").length === 6) onChange(hex)
          }}
          onBlur={() => {
            const hex = draft && toHex(draft)
            if (hex) onChange(hex)
            setDraft(null)
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <RadioGroup
            aria-label="Surface palette"
            className="flex flex-wrap gap-2"
            value={custom ? "" : surfaceHex.toLowerCase()}
            onValueChange={(hex) => {
              setDraft(null)
              onChange(hex)
            }}
          >
            {PALETTE.map((p) => (
              <RadioGroupItem
                key={p.name}
                value={p.hex}
                aria-label={p.name}
                title={p.name}
                style={{ "--neu-surface": p.hex } as React.CSSProperties}
              />
            ))}
          </RadioGroup>
          <Button
            asChild
            variant="secondary"
            size="icon-xs"
            className={cn(
              "relative size-6.5 rounded-full has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-(length:--neu-ring-width) has-[:focus-visible]:outline-offset-(--neu-ring-offset) has-[:focus-visible]:outline-[color:var(--neu-ring)]",
              custom ? "text-(--neu-knob-ink)" : "text-(--neu-text-muted)"
            )}
          >
            <label title="Pick any color">
              <Pipette aria-hidden />
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                value={surfaceHex}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Pick any surface color"
              />
            </label>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export { SurfaceInstrument }
