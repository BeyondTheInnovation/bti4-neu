"use client"

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@/registry/neu/ui/neu/toggle"

export function NeuToggleDemo() {
  return (
    <div className="neu-ground flex flex-wrap items-center gap-4 rounded-(--neu-radius) p-8">
      <Toggle aria-label="Toggle bold">
        <BoldIcon />
      </Toggle>
      <Toggle defaultPressed aria-label="Toggle italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle underline">
        <UnderlineIcon />
      </Toggle>
      <Toggle size="sm">
        <ItalicIcon />
        Italic
      </Toggle>
      <Toggle size="lg" aria-label="Toggle bold">
        <BoldIcon />
        Bold
      </Toggle>
      <Toggle disabled aria-label="Toggle underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  )
}
