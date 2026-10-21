"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch"

import { cn } from "@/lib/utils"

const NAV = [
  {
    href: "/components",
    label: "Components",
    isActive: (path: string) => path.startsWith("/components"),
  },
  {
    href: "/playground",
    label: "Playground",
    isActive: (path: string) => path.startsWith("/playground"),
  },
]

/**
 * The one top bar every page renders. Docs pass `menu` (the sidebar drawer
 * trigger), which takes over the links on small screens since the drawer
 * lists them. `skipTo` is the id the skip link jumps to.
 */
export function SiteHeader({
  className,
  menu,
  skipTo = "#content",
}: {
  className?: string
  menu?: ReactNode
  skipTo?: `#${string}`
}) {
  const pathname = usePathname()

  return (
    <header
      className={cn(
        "z-40 border-b bg-fd-background/80 text-fd-foreground backdrop-blur-sm",
        className
      )}
    >
      <a
        href={skipTo}
        className="sr-only rounded-lg border bg-fd-popover text-sm font-medium shadow-md focus-visible:not-sr-only focus-visible:absolute focus-visible:start-3 focus-visible:top-2 focus-visible:z-50 focus-visible:px-3 focus-visible:py-2"
      >
        Skip to content
      </a>
      <div className="flex h-14 items-center gap-6 px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          neu
        </Link>
        <nav
          aria-label="Main"
          className={cn("flex items-center gap-5", menu && "max-md:hidden")}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={item.isActive(pathname)}
              aria-current={item.isActive(pathname) ? "page" : undefined}
              className="py-3 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <FullSearchTrigger
            hideIfDisabled
            className="w-60 rounded-xl ps-2.5 max-md:hidden"
          />
          <SearchTrigger hideIfDisabled className="p-2 md:hidden" />
          <ThemeSwitch className={cn(menu && "max-sm:hidden")} />
          {menu}
        </div>
      </div>
    </header>
  )
}
