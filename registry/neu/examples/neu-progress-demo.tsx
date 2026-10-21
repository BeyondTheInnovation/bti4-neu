"use client"

import * as React from "react"

import { Progress } from "@/registry/neu/ui/neu/progress"

export function NeuProgressDemo() {
  const [value, setValue] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setValue(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="neu-ground flex flex-col gap-6 rounded-(--neu-radius) p-8">
      <Progress value={value} aria-label="Upload progress" />
      <Progress value={0} aria-label="Not started" />
      <Progress value={100} aria-label="Complete" />
    </div>
  )
}
