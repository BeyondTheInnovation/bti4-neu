import type { ReactNode } from "react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="neu-ground flex min-h-svh flex-col">
      <SiteHeader className="sticky top-0" />
      <main id="content" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter className="mx-auto max-w-[1400px] px-4" />
    </div>
  )
}
