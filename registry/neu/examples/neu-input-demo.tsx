"use client"

import { Input } from "@/registry/neu/ui/neu/input"

export function NeuInputDemo() {
  return (
    <div className="neu-ground flex w-full max-w-sm flex-col gap-4 rounded-(--neu-radius) p-8">
      <Input type="email" placeholder="Email" aria-label="Email" />
      <Input type="text" defaultValue="A filled well" aria-label="Filled" />
      <Input aria-invalid placeholder="Invalid" aria-label="Invalid" />
      <Input disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  )
}
