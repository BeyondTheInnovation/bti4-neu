"use client"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/neu/ui/neu/popover"

export function NeuPopoverDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverHeader>
            <PopoverTitle>Floating panel</PopoverTitle>
            <PopoverDescription>
              The popover re-grounds itself outside the page wrapper.
            </PopoverDescription>
          </PopoverHeader>
          <p className="text-sm">
            Surface, border and text all derive from the one surface token.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
