"use client"

import { Textarea } from "@/registry/neu/ui/neu/textarea"

export function NeuTextareaDemo() {
  return (
    <div className="neu-ground flex w-full max-w-sm flex-col gap-4 rounded-(--neu-radius) p-8">
      <Textarea placeholder="Type your message here." />
      <Textarea aria-invalid placeholder="Invalid" />
      <Textarea disabled placeholder="Disabled" />
    </div>
  )
}
