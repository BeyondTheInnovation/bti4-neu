import type { Metadata } from "next"
import Image from "next/image"

import { SiteShell } from "@/components/site-shell"

type Reference = {
  name: string
  url?: string
  took: string
  image?: { src: string; width: number; height: number }
}

const origins: Reference[] = [
  {
    name: "Jhey Tompkins, neumorphic pen",
    url: "https://codepen.io/jh3y/pen/yLNeMao",
    took: "The CSS structure the whole build started from, ancestor of the token system.",
  },
  {
    name: "neumorphism.io",
    url: "https://github.com/adamgiebl/neumorphism",
    took: "The parameter vocabulary: distance, blur, shape, intensity.",
  },
  {
    name: "Berwel components",
    took: "The first neumorphic shadcn components; their carved holes, clay beads and traveling knobs got ported in.",
  },
  {
    name: "shadcn libraries directory",
    url: "https://ui.shadcn.com/docs/directory",
    took: "The registry survey that confirmed the neumorphism niche was open.",
  },
  {
    name: "Devon Govett, transparent foreground",
    url: "https://codepen.io/devongovett/pen/01a01b37-313f-72d7-849a-147f6126ad94",
    took: "CSS-only WCAG contrast solve, shipped verbatim as the --neu-text derivation.",
    image: { src: "/inspo/govett-contrast.png", width: 1440, height: 1000 },
  },
  {
    name: "squircle.art",
    url: "https://www.squircle.art/",
    took: "Reference output for corner-shape: squircle; became the --neu-corner token.",
    image: { src: "/inspo/squircle-art.png", width: 1440, height: 1000 },
  },
  {
    name: "Adam Kuhn, editable neumorphic text",
    url: "https://codepen.io/cobra_winfrey/pen/NWqxqpz",
    took: "Two-shadow text emboss with letter color = surface; became .neu-text-emboss.",
    image: {
      src: "/inspo/kuhn-neumorphic-text.png",
      width: 1280,
      height: 577,
    },
  },
  {
    name: "Arlan emboss creator",
    url: "https://www.arlan.me/vault/emboss",
    took: "The realism ceiling; its nine named bevel presets shaped our depth presets.",
    image: { src: "/inspo/arlan-emboss.png", width: 1280, height: 577 },
  },
]

const gallery: Reference[] = [
  {
    name: "Spasoje Perovic",
    url: "https://www.spasoje.dev/",
    took: "Monochrome watchmaker portfolio: 6-layer realism ramps, pillow stacks, a working clock.",
    image: { src: "/inspo/spasoje-dev.png", width: 1600, height: 1000 },
  },
  {
    name: "SND",
    url: "https://snd.dev/",
    took: "Every surface is a pressable key; taught us asymmetric press and release easing.",
    image: { src: "/inspo/snd-dev.png", width: 1600, height: 1000 },
  },
  {
    name: "Motion GPU",
    url: "https://motion-gpu.dev/",
    took: "oklch-tokenized dark soft UI with hue-tinted shadows; source of the glint edge.",
    image: { src: "/inspo/motion-gpu.png", width: 1600, height: 1000 },
  },
  {
    name: "Sam Xie",
    url: "https://samxie.net/",
    took: "One shadow grammar crossfading between themes via alpha-0 shadow slots.",
    image: { src: "/inspo/samxie.png", width: 1280, height: 577 },
  },
  {
    name: "DM1 The Drum Machine",
    url: "https://the-drum-machine.webflow.io/",
    took: "A whole drum machine in HTML/CSS; state changes append an accent glow layer.",
    image: { src: "/inspo/drum-machine.png", width: 1280, height: 577 },
  },
  {
    name: "Neumorphic UI player",
    url: "https://neumorphic-ui.webflow.io/",
    took: "Vinyl player with the recessed backlit-LCD screen recipe.",
    image: {
      src: "/inspo/neumorphic-ui-webflow.png",
      width: 1280,
      height: 577,
    },
  },
  {
    name: "Solomid.Tech",
    url: "https://solomidtech.webflow.io/",
    took: "Textbook light-mode production neumorphism; engraved 1px divider grooves.",
    image: { src: "/inspo/solomid.png", width: 1280, height: 577 },
  },
]

function CardMedia({ reference }: { reference: Reference }) {
  if (reference.image) {
    return (
      <Image
        src={reference.image.src}
        alt={`${reference.name} screenshot`}
        width={reference.image.width}
        height={reference.image.height}
        className="aspect-video w-full rounded-[calc(var(--neu-radius)-0.5rem)] object-cover object-top"
      />
    )
  }
  return (
    <div className="neu-pressed flex aspect-video w-full items-center justify-center [--neu-radius:0.5rem]">
      <span
        aria-hidden
        className="text-6xl font-bold tracking-tight text-(--neu-text-muted)"
      >
        {reference.name[0]}
      </span>
    </div>
  )
}

function CardBody({ reference }: { reference: Reference }) {
  return (
    <>
      <CardMedia reference={reference} />
      <div className="flex flex-col gap-1 px-2 pt-3 pb-2">
        <h3 className="flex items-baseline gap-1.5 text-sm font-semibold">
          {reference.name}
          {reference.url && (
            <span aria-hidden className="text-xs text-(--neu-text-muted)">
              &#8599;
            </span>
          )}
        </h3>
        <p className="text-sm text-(--neu-text-muted)">{reference.took}</p>
      </div>
    </>
  )
}

function InspoCard({ reference }: { reference: Reference }) {
  if (!reference.url) {
    return (
      <div className="neu p-2">
        <CardBody reference={reference} />
      </div>
    )
  }
  return (
    <a
      href={reference.url}
      target="_blank"
      rel="noreferrer"
      className="neu neu-active-sink block p-2 focus-visible:outline-(length:--neu-ring-width) focus-visible:outline-offset-(--neu-ring-offset) focus-visible:outline-[color:var(--neu-ring,currentColor)]"
    >
      <CardBody reference={reference} />
    </a>
  )
}

function Section({
  title,
  intro,
  references,
}: {
  title: string
  intro: string
  references: Reference[]
}) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm text-(--neu-text-muted)">{intro}</p>
      </header>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {references.map((reference) => (
          <InspoCard key={reference.name} reference={reference} />
        ))}
      </div>
    </section>
  )
}

const description = "The sites, pens and references neu was built from."

export const metadata: Metadata = {
  title: "Inspiration",
  description,
  openGraph: {
    title: "Inspiration · neu",
    description,
    url: "/inspiration",
    images: "/opengraph-image",
  },
}

export default function InspirationPage() {
  return (
    <SiteShell>
      <div className="px-8 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-14">
          <header className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">Inspiration</h1>
            <p className="max-w-2xl text-sm text-(--neu-text-muted)">
              The sites, pens and references this library was built from. Every
              card links out; the one-liner is what the token system took from
              it.
            </p>
          </header>
          <Section
            title="Origins"
            intro="The references the build actually started from, and what each one contributed."
            references={origins}
          />
          <Section
            title="Gallery"
            intro="Standout neumorphic sites and pens from the research pass; each taught the shadow grammar something."
            references={gallery}
          />
        </div>
      </div>
    </SiteShell>
  )
}
