"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/neu/ui/neu/select"

export function NeuSelectDemo() {
  return (
    <div className="neu-ground flex flex-col gap-4 rounded-(--neu-radius) p-8">
      <Select>
        <SelectTrigger aria-label="Fruit" className="w-45">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
            <SelectItem value="grape" disabled>
              Grape
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select defaultValue="paused">
        <SelectTrigger aria-label="Status" size="sm" className="w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="stopped">Stopped</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled>
        <SelectTrigger aria-label="Disabled select" className="w-45">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
