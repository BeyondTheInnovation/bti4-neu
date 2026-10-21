"use client"

import { Switch } from "@/registry/neu/ui/neu/switch"

export function NeuSwitchDemo() {
  return (
    <div className="neu-ground flex flex-col gap-4 rounded-(--neu-radius) p-8">
      <label className="flex items-center gap-3 text-sm">
        <Switch />
        Off
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Switch defaultChecked />
        On
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Switch size="sm" />
        Small
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Switch size="lg" defaultChecked />
        Large
      </label>
      <label className="flex items-center gap-3 text-sm opacity-50">
        <Switch disabled />
        Disabled
      </label>
      <label className="flex items-center gap-3 text-sm opacity-50">
        <Switch disabled defaultChecked />
        Disabled on
      </label>
    </div>
  )
}
