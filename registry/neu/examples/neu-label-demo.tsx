"use client"

import { Checkbox } from "@/registry/neu/ui/neu/checkbox"
import { Input } from "@/registry/neu/ui/neu/input"
import { Label } from "@/registry/neu/ui/neu/label"

export function NeuLabelDemo() {
  return (
    <div className="neu-ground flex w-full max-w-sm flex-col gap-6 rounded-(--neu-radius) p-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-demo-email">Email</Label>
        <Input id="label-demo-email" type="email" placeholder="Email" />
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </div>
      <div className="flex flex-col-reverse gap-2">
        <Input
          id="label-demo-disabled"
          className="peer"
          disabled
          placeholder="Disabled"
        />
        <Label htmlFor="label-demo-disabled">Disabled field</Label>
      </div>
    </div>
  )
}
