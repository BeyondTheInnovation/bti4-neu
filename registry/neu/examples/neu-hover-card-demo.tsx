"use client"

import { CalendarIcon } from "lucide-react"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/neu/ui/neu/hover-card"

export function NeuHoverCardDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React framework, created and maintained by @vercel.
            </p>
            <div className="flex items-center gap-2 text-xs text-(--neu-text-muted)">
              <CalendarIcon className="size-3.5" />
              Joined December 2021
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
