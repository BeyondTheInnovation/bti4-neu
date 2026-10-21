import { CATALOG } from "@/lib/catalog"
import { Example } from "@/lib/examples"
import { cn } from "@/lib/utils"

/* framed: a transform makes this box the containing block for the sidebar's
   fixed chrome, and the svh heights are pinned to the frame instead. */
const FRAMED =
  "h-[30rem] overflow-hidden [transform:translateZ(0)] [&_[data-slot=sidebar-wrapper]]:min-h-full [&_[data-slot=sidebar-container]]:h-full"

export function ExampleFrame({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const entry = CATALOG.find((item) => item.example === name)
  if (!entry) return null

  return (
    <div
      className={cn(
        "neu-ground flex w-full items-center justify-center [&>.neu-ground]:w-full",
        entry.wide && "[&>*]:w-full",
        entry.framed ? FRAMED : "p-2",
        className
      )}
    >
      <Example name={name} />
    </div>
  )
}
