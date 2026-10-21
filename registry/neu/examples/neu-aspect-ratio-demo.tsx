"use client"

import { AspectRatio } from "@/registry/neu/ui/neu/aspect-ratio"

export function NeuAspectRatioDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <AspectRatio
        ratio={16 / 9}
        className="neu overflow-hidden rounded-(--neu-radius)"
      >
        <div className="size-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--neu-text)_12%,var(--neu-surface)),var(--neu-surface))]" />
      </AspectRatio>
    </div>
  )
}
