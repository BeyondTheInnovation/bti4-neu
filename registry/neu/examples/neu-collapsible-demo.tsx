"use client"

import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/neu/ui/neu/collapsible"

export function NeuCollapsibleDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <Collapsible className="flex w-full max-w-sm flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <ChevronsUpDownIcon />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="neu-pressed rounded-(--neu-radius) px-4 py-2 text-sm [--neu-depth:0.25]">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="neu-pressed rounded-(--neu-radius) px-4 py-2 text-sm [--neu-depth:0.25]">
            @radix-ui/colors
          </div>
          <div className="neu-pressed rounded-(--neu-radius) px-4 py-2 text-sm [--neu-depth:0.25]">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
