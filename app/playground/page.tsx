import type { Metadata } from "next"

import { SiteShell } from "@/components/site-shell"

import { Playground } from "./playground"

const description =
  "Build your own neu theme in the playground. Tune every neumorphic token live, preview the result on real components and copy the CSS into your project."

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
