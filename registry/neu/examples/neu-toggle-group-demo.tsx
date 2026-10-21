"use client"

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/neu/ui/neu/toggle-group"

export function NeuToggleGroupDemo() {
  return (
    <div className="neu-ground flex flex-wrap items-center gap-4 rounded-(--neu-radius) p-8">
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="week">
        <ToggleGroupItem value="day" className="px-4">
          Day
        </ToggleGroupItem>
        <ToggleGroupItem value="week" className="px-4">
          Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" className="px-4">
          Month
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
