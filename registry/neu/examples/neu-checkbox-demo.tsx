"use client"

import { Checkbox } from "@/registry/neu/ui/neu/checkbox"

export function NeuCheckboxDemo() {
  return (
    <div className="neu-ground flex flex-col gap-4 rounded-(--neu-radius) p-8">
      <label className="flex items-center gap-3 text-sm">
        <Checkbox />
        Accept terms and conditions
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Checkbox defaultChecked />
        Starts checked, the tick floats in the well
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Checkbox tick="always" />
        Ghost tick previews the mark
      </label>
      <label className="flex items-center gap-3 text-sm opacity-50">
        <Checkbox disabled />
        Disabled
      </label>
    </div>
  )
}
