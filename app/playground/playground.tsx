"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowUpRight, Check, Copy, RotateCcw } from "lucide-react"

import { CATALOG, type CatalogEntry } from "@/lib/catalog"
import { EXAMPLES } from "@/lib/examples"
import { DARK_SURFACE, LIGHT_SURFACE, themeCss } from "@/lib/site-theme"
import {
  resetSiteTheme,
  updateSiteTheme,
  useSiteTheme,
} from "@/lib/use-site-theme"
import { Button } from "@/registry/neu/ui/neu/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/neu/ui/neu/dialog"

import { oklchToRgb, rgbToHex, surfaceTone, swatches } from "./color"
import {
  AlphaInstrument,
  CurvatureInstrument,
  GlintInstrument,
  ShadeInstrument,
} from "./instruments"
import { Hero } from "./scene"
import { SurfaceInstrument } from "./surface"
import { CHROME_STYLE, type ModelName, type SetTheme, shapeOf } from "./theme"
import "./playground.css"

const PREVIEW = [
  "neu-button",
  "neu-input",
  "neu-switch",
  "neu-checkbox",
  "neu-radio-group",
  "neu-slider",
  "neu-toggle-group",
  "neu-tabs",
  "neu-card",
  "neu-progress",
  "neu-alert",
  "neu-badge",
  "neu-select",
  "neu-pagination",
  "neu-accordion",
  "neu-avatar",
  "neu-textarea",
  "neu-table",
]
  .map((slug) => CATALOG.find((c) => c.slug === slug))
  .filter(
    (c): c is CatalogEntry & { example: string } =>
      !!c?.example && c.example in EXAMPLES
  )

const Gallery = React.memo(function Gallery() {
  return (
    <div className="columns-1 gap-8 xl:columns-2">
      {PREVIEW.map((entry) => {
        const Example = EXAMPLES[entry.example]
        // Off-screen demos skip the restyle every token drag triggers.
        return (
          <figure
            key={entry.slug}
            className="mb-8 flex break-inside-avoid flex-col gap-3 [contain-intrinsic-size:auto_320px] [content-visibility:auto]"
          >
            <figcaption>
              <Link
                href={`/components/${entry.slug}`}
                className="ill-doc-link text-sm font-semibold"
              >
                {entry.title}
                <span className="sr-only"> docs</span>
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </figcaption>
            <div className="min-w-0 overflow-x-auto p-2">
              <Example />
            </div>
          </figure>
        )
      })}
    </div>
  )
})

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="ill-group">{title}</h2>
        <span className="neu-line flex-1" aria-hidden />
      </div>
      <div className="grid grid-cols-2 gap-3.5">{children}</div>
    </div>
  )
}

const subscribeNever = () => () => {}

export function Playground() {
  const siteTheme = useSiteTheme()
  const theme = siteTheme.tokens
  const { resolvedTheme, setTheme: setScheme } = useTheme()
  const hydrated = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const dark = hydrated && resolvedTheme === "dark"
  const scheme = dark ? "dark" : "light"
  const [model, setModel] = React.useState<ModelName>("neu")
  const [copied, setCopied] = React.useState(false)

  const surfaceHex =
    siteTheme.surfaces[scheme] ?? (dark ? DARK_SURFACE : LIGHT_SURFACE)
  const set = React.useCallback<SetTheme>(
    (patch) =>
      updateSiteTheme((s) => ({ ...s, tokens: { ...s.tokens, ...patch } })),
    []
  )
  // The docs chrome and code themes follow the scheme class, so a surface is
  // stored under the scheme its own lightness belongs to, and the site follows.
  const setSurface = (hex: string) => {
    const tone = surfaceTone(hex)
    updateSiteTheme((s) => ({ ...s, surfaces: { ...s.surfaces, [tone]: hex } }))
    if (tone !== scheme) setScheme(tone)
  }

  const sw = React.useMemo(
    () =>
      swatches(surfaceHex, {
        shadeDark: theme.shadeDark ?? theme.shade,
        shadeLight: theme.shadeLight ?? theme.shade,
        alpha: theme.alpha,
        face: Math.abs(theme.face),
      }),
    [surfaceHex, theme]
  )

  const reset = () => {
    resetSiteTheme()
    setModel("neu")
  }

  const css = themeCss(siteTheme)
  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const accentL =
    sw.l > 0.5 ? Math.min(0.55, sw.l - 0.33) : Math.max(0.55, sw.l + 0.3)
  const rootStyle = {
    "--ill-accent": rgbToHex(oklchToRgb({ l: accentL, c: 0.17, h: sw.hue })),
  } as React.CSSProperties
  const props = { t: theme, sw, set }
  const shape = shapeOf(model, theme.face)

  return (
    <div className="ill neu-ground" style={rootStyle}>
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10">
        <header
          className="flex flex-wrap items-end justify-between gap-6"
          style={CHROME_STYLE}
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Playground</h1>
            <p className="ill-muted mt-2 max-w-md text-sm text-pretty">
              Shape the slab in 3D and watch the CSS follow. Every handle takes
              the arrow keys, and your theme carries over to every page until
              you reset it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={reset}>
              <RotateCcw />
              Reset
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Copy />
                  Copy theme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl" style={CHROME_STYLE}>
                <DialogHeader>
                  <DialogTitle>Your neu theme</DialogTitle>
                  <DialogDescription>
                    Paste this after the neu-theme import in your global CSS.
                    Every component reads these tokens.
                  </DialogDescription>
                </DialogHeader>
                <pre className="neu-pressed ill-code max-h-96 overflow-auto p-4">
                  <code>{css}</code>
                </pre>
                <div className="flex items-center justify-between gap-3">
                  <span className="ill-muted text-xs">
                    Preview shape: <code className="font-mono">.{shape}</code>
                  </span>
                  <Button onClick={copy}>
                    {copied ? <Check /> : <Copy />}
                    {copied ? "Copied" : "Copy CSS"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-10 lg:mt-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <Hero
              {...props}
              model={model}
              onModelChange={setModel}
              chrome={CHROME_STYLE}
            />
          </div>

          <aside
            aria-label="Theme controls"
            className="ill-panel lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1"
            style={CHROME_STYLE}
          >
            <Group title="Color">
              <SurfaceInstrument
                surfaceHex={surfaceHex}
                sw={sw}
                onChange={setSurface}
              />
              <ShadeInstrument {...props} />
            </Group>
            <Group title="Material">
              <AlphaInstrument {...props} />
              <GlintInstrument {...props} />
              <CurvatureInstrument {...props} model={model} />
            </Group>
          </aside>

          <section aria-label="Components" className="min-w-0 lg:col-start-2">
            <h2 className="ill-group mb-6">Components</h2>
            <Gallery />
          </section>
        </div>
      </div>
    </div>
  )
}
