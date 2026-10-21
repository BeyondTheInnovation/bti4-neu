import type { Metadata } from "next"

import { SiteShell } from "@/components/site-shell"

import { Playground } from "./playground"

const description =
  "Build your own neu theme: tune every token live and copy the CSS."

export const metadata: Metadata = {
  title: "Playground",
  description,
  openGraph: {
    title: "Playground · neu",
    description,
    url: "/playground",
    images: "/opengraph-image",
  },
}

export default function PlaygroundPage() {
  return (
    <SiteShell>
      <Playground />
    </SiteShell>
  )
}
