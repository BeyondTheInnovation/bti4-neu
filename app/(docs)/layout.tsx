import { DocsLayout } from "fumadocs-ui/layouts/notebook"
import type { ReactNode } from "react"
import { DocsHeader } from "@/components/docs-header"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
  const options = baseOptions()

  return (
    <DocsLayout
      tree={source.pageTree}
      {...options}
      nav={{ ...options.nav, mode: "top" }}
      sidebar={{ collapsible: false }}
      tabs={false}
      slots={{ header: DocsHeader }}
    >
      {children}
    </DocsLayout>
  )
}
