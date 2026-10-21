import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { BTI_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/playground", label: "Playground" },
  { href: "/inspiration", label: "Inspiration" },
]

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full text-sm text-(--neu-text-muted)", className)}>
      <div className="neu-line w-full" aria-hidden />
      <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-semibold tracking-tight text-(--neu-text)">
            neu
          </span>
          <span>Neumorphic components for shadcn. MIT License.</span>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline-offset-4 transition-colors hover:text-(--neu-text) hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={BTI_URL}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-(--neu-text)"
          >
            <Image
              src="/bti-mark.svg"
              alt=""
              width={16}
              height={16}
              className="mr-1 size-4"
            />
            Crafted by
            <span className="font-medium text-(--neu-text) group-hover:underline">
              Beyond The Innovation
            </span>
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
