"use client"

import { RadioGroup, RadioGroupItem } from "@/registry/neu/ui/neu/radio-group"

export function NeuRadioGroupDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <RadioGroup defaultValue="comfortable">
        <label className="flex items-center gap-3 text-sm">
          <RadioGroupItem value="default" />
          Default
        </label>
        <label className="flex items-center gap-3 text-sm">
          <RadioGroupItem value="comfortable" />
          Comfortable, the cap rises from the hole
        </label>
        <label className="flex items-center gap-3 text-sm">
          <RadioGroupItem value="compact" />
          Compact
        </label>
        <label className="flex items-center gap-3 text-sm opacity-50">
          <RadioGroupItem value="disabled" disabled />
          Disabled
        </label>
      </RadioGroup>
    </div>
  )
}
