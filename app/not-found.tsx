import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { Button } from "@/registry/neu/ui/neu/button"

export const metadata = {
  title: "Page not found",
}

const EMBOSS = {
  "--neu-distance": "6px",
  "--neu-blur": "10px",
  "--neu-alpha": "1",
} as CSSProperties

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <div className="neu-pressed flex w-full max-w-md items-center justify-center rounded-[calc(var(--neu-radius)*2)] py-10 sm:py-14">
          <span
            aria-hidden
            className="neu-text-emboss text-8xl font-extrabold tracking-tighter sm:text-[9rem] sm:leading-none"
            style={EMBOSS}
          >
            404
          </span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="max-w-md text-(--neu-text-muted)">
            The link may be old, or the page moved. Head back to the docs, or
            find the component you were after in the gallery.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft />
              Back to docs
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/components">Browse components</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  )
}
