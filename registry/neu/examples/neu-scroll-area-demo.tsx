"use client"

import * as React from "react"

import { ScrollArea } from "@/registry/neu/ui/neu/scroll-area"
import { Separator } from "@/registry/neu/ui/neu/separator"

const tags = Array.from({ length: 30 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function NeuScrollAreaDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <ScrollArea className="neu-pressed h-72 w-48 rounded-(--neu-radius)">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
