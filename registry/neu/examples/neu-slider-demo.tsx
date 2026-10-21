"use client"

import { Slider } from "@/registry/neu/ui/neu/slider"

export function NeuSliderDemo() {
  return (
    <div className="neu-ground flex flex-col gap-8 rounded-(--neu-radius) p-8">
      <Slider defaultValue={[33]} aria-label="Volume" />
      <Slider defaultValue={[20, 60]} aria-label="Price" />
      <Slider defaultValue={[50]} disabled aria-label="Locked" />
      <div className="h-44">
        <Slider defaultValue={[66]} orientation="vertical" aria-label="Level" />
      </div>
    </div>
  )
}
