import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ExampleFrame } from "@/components/example-frame"
import { CATALOG, type CatalogEntry } from "@/lib/catalog"
import { cn } from "@/lib/utils"
import {
  knobAccentClasses,
  knobFaceClasses,
  knobLiftClasses,
} from "@/registry/neu/ui/neu/knob"

function KnobPreview() {
  return (
    <div className="flex items-center gap-6">
      <span
        className={cn(
          knobFaceClasses,
          knobLiftClasses,
          "block size-6 rounded-full"
        )}
      />
      <span
        className={cn(
          knobFaceClasses,
          knobLiftClasses,
          "block size-10 rounded-full"
        )}
      />
      <span
        className={cn(
          knobAccentClasses,
          knobLiftClasses,
          "block size-6 rounded-full"
        )}
      />
    </div>
  )
}

function Tile({ entry }: { entry: CatalogEntry }) {
  // Off-screen tiles skip style and layout, so a theme token change only
  // recalculates the visible ones. 320px is the median tile height.
  return (
    <article
      id={entry.slug}
      className={cn(
        "flex min-w-0 scroll-mt-24 flex-col gap-5 [contain-intrinsic-size:auto_320px] [content-visibility:auto]",
        entry.wide && "col-span-full"
      )}
    >
      <Link
        href={`/components/${entry.slug}`}
        className="group inline-flex w-fit items-center gap-1.5 text-lg font-semibold tracking-tight no-underline underline-offset-4 hover:underline"
      >
        {entry.title}
        <ArrowRight
          aria-hidden
          className="size-4 text-(--neu-text-muted) opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </Link>
      {entry.example ? (
        <ExampleFrame
          name={entry.example}
          className={cn("flex-1", !entry.framed && "min-h-48")}
        />
      ) : (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <KnobPreview />
        </div>
      )}
    </article>
  )
}

export function ComponentGrid({
  category,
}: {
  category: CatalogEntry["category"]
}) {
  return (
    <div className="not-prose mt-8 mb-16 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-x-12 gap-y-16">
      {CATALOG.filter((entry) => entry.category === category).map((entry) => (
        <Tile key={entry.slug} entry={entry} />
      ))}
    </div>
  )
}
