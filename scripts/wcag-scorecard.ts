/**
 * WCAG 2.2 scorecard for the Neu components, measured in Chrome through
 * Playwright against a running dev server, light and dark, and written as JSON
 * to --out (docs/assets/readme/wcag-scorecard.json by default).
 *
 *   bun scripts/wcag-scorecard.ts [--base http://localhost:3000] [--out <file>]
 *     [--evidence <dir>] [--only tokens,focus,...] [--commit <sha>]
 *
 * Contrast comes from real screenshot pixels at 1440x900 and device scale 1,
 * or from computed opaque colors where those are exact (a glyph's own color).
 * Ratios use the WCAG relative luminance formula. --evidence saves a cropped
 * screenshot of each reading under 3:1, a focus stop with no visible change,
 * and the input field edge into that directory.
 *
 * A check that finds nothing to measure is listed under "errors" and the exit
 * code is 1, so a missing element or a page that failed to load never reads
 * as a pass.
 */
import { execSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"
import { inflateSync } from "node:zlib"

import AxeBuilder from "@axe-core/playwright"
import {
  type Browser,
  type BrowserContextOptions,
  chromium,
  type Page,
} from "@playwright/test"

import { CATALOG } from "@/lib/catalog"
import { DARK_SURFACE, LIGHT_SURFACE, type Scheme } from "@/lib/site-theme"

const SECTIONS = [
  "tokens",
  "states",
  "overlays",
  "fields",
  "targets",
  "names",
  "focus",
  "modes",
  "motion",
  "axe",
] as const
type Section = (typeof SECTIONS)[number]

const { values: flags } = parseArgs({
  args: process.argv.slice(2),
  options: {
    base: { type: "string", default: "http://localhost:3000" },
    out: {
      type: "string",
      default: path.join(
        import.meta.dirname,
        "../docs/assets/readme/wcag-scorecard.json"
      ),
    },
    evidence: { type: "string" },
    only: { type: "string" },
    commit: { type: "string" },
  },
})
const ONLY = flags.only?.split(",")
const unknownSections = (ONLY ?? []).filter(
  (s) => !(SECTIONS as readonly string[]).includes(s)
)
if (unknownSections.length)
  throw new Error(
    `--only takes ${SECTIONS.join(", ")}; got ${unknownSections.join(", ")}`
  )

const BASE = flags.base.replace(/\/$/, "")
const EVIDENCE = flags.evidence
const COMMIT =
  flags.commit ??
  execSync("git rev-parse --short HEAD", {
    cwd: import.meta.dirname,
    timeout: 5000,
  })
    .toString()
    .trim()
const run = (section: Section) => !ONLY || ONLY.includes(section)
const log = (...m: unknown[]) => console.error("[scorecard]", ...m)

const GALLERY = "/components"
const VIEWPORT = { width: 1440, height: 900 }
const SCHEMES: Scheme[] = ["light", "dark"]

const SURFACES = [
  { name: "very light", css: "oklch(0.97 0.005 250)" },
  { name: "Paper", css: "#f8f8f2" },
  { name: "Fog (site light)", css: LIGHT_SURFACE },
  { name: "Sand", css: "#e8dfd1" },
  { name: "Blush", css: "#efdcdc" },
  { name: "Sage", css: "#d6e0d6" },
  { name: "teal", css: "#00a4ac" },
  { name: "mid gray", css: "oklch(0.55 0.005 250)" },
  { name: "Slate", css: "#262c38" },
  { name: "Night (site dark)", css: DARK_SURFACE },
  { name: "very dark", css: "oklch(0.15 0.02 250)" },
]

const errors: string[] = []
type Unmeasured = { error: string }

function report(name: string, message: string) {
  errors.push(`${name}: ${message}`)
  log("error:", name, message)
}

/** Runs one measurement; any failure is reported and returned as its result. */
async function check<T>(
  name: string,
  measure: () => Promise<T>
): Promise<T | Unmeasured> {
  try {
    return await measure()
  } catch (e) {
    const message = (e instanceof Error ? e.message : String(e)).split("\n")[0]
    report(name, message)
    return { error: message }
  }
}

function need<T>(value: T | null | undefined, selector: string): T {
  if (value === null || value === undefined)
    throw new Error(`nothing rendered matches ${selector}`)
  return value
}

type RGB = [number, number, number]
type Img = { width: number; height: number; data: Uint8Array }
type Rect = { x: number; y: number; width: number; height: number }

function decodePng(buf: Buffer): Img {
  let pos = 8
  let width = 0
  let height = 0
  let channels = 4
  const idat: Buffer[] = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString("ascii", pos + 4, pos + 8)
    const body = buf.subarray(pos + 8, pos + 8 + len)
    if (type === "IHDR") {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      if (body[8] !== 8 || body[12] !== 0 || ![2, 6].includes(body[9]))
        throw new Error("only 8-bit non-interlaced RGB(A) PNGs are supported")
      channels = body[9] === 6 ? 4 : 3
    } else if (type === "IDAT") idat.push(body)
    else if (type === "IEND") break
    pos += 12 + len
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const data = new Uint8Array(width * height * 4)
  let prev = new Uint8Array(stride)
  let cur = new Uint8Array(stride)
  let p = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[p++]
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0
      const b = prev[x]
      const c = x >= channels ? prev[x - channels] : 0
      let pred = 0
      if (filter === 1) pred = a
      else if (filter === 2) pred = b
      else if (filter === 3) pred = (a + b) >> 1
      else if (filter === 4) {
        const pa = Math.abs(b - c)
        const pb = Math.abs(a - c)
        const pc = Math.abs(a + b - 2 * c)
        pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      cur[x] = (raw[p++] + pred) & 255
    }
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4
      data[o] = cur[x * channels]
      data[o + 1] = cur[x * channels + 1]
      data[o + 2] = cur[x * channels + 2]
      data[o + 3] = channels === 4 ? cur[x * channels + 3] : 255
    }
    ;[prev, cur] = [cur, prev]
  }
  return { width, height, data }
}

function px(img: Img, x: number, y: number): RGB {
  const cx = Math.min(img.width - 1, Math.max(0, Math.floor(x)))
  const cy = Math.min(img.height - 1, Math.max(0, Math.floor(y)))
  const o = (cy * img.width + cx) * 4
  return [img.data[o], img.data[o + 1], img.data[o + 2]]
}

const inside = (img: Img, x: number, y: number) =>
  x >= 0 && y >= 0 && x < img.width && y < img.height

function luminance([r, g, b]: RGB) {
  const lin = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Median color of a square patch, by luminance. */
function patch(img: Img, x: number, y: number, r = 1): RGB {
  const all: RGB[] = []
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) all.push(px(img, x + dx, y + dy))
  all.sort((a, b) => luminance(a) - luminance(b))
  return all[Math.floor(all.length / 2)]
}

const hex = (c: RGB) =>
  `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`
const round = (n: number) => Math.round(n * 100) / 100

type Sample = { ratio: number; where: string; fg?: string; bg?: string }

function worst(samples: Sample[]): Sample | null {
  return samples.reduce<Sample | null>(
    (w, s) => (!w || s.ratio < w.ratio ? s : w),
    null
  )
}

function around(img: Img, c: RGB, points: [number, number, string][]) {
  return points
    .filter(([x, y]) => inside(img, x, y))
    .map(([x, y, where]) => {
      const b = px(img, x, y)
      return { ratio: ratio(c, b), where, fg: hex(c), bg: hex(b) }
    })
}

/** Opens a context with the scheme and media emulation, and closes it after. */
async function withPage<T>(
  browser: Browser,
  scheme: Scheme,
  extra: BrowserContextOptions,
  inPage: (page: Page) => Promise<T>
): Promise<T> {
  const options: BrowserContextOptions = {
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: "no-preference",
    ...extra,
  }
  const context = await browser.newContext(options)
  try {
    context.setDefaultTimeout(10_000)
    context.setDefaultNavigationTimeout(60_000)
    const page = await context.newPage()
    const ignored = await page.evaluate(
      (wanted) =>
        Object.entries(wanted)
          .filter(([query, on]) => matchMedia(query).matches !== on)
          .map(([query]) => query),
      {
        "(prefers-color-scheme: dark)": scheme === "dark",
        "(prefers-contrast: more)": options.contrast === "more",
        "(forced-colors: active)": options.forcedColors === "active",
        "(prefers-reduced-motion: reduce)": options.reducedMotion === "reduce",
      }
    )
    if (ignored.length)
      throw new Error(
        `the browser ignored the emulation of ${ignored.join(", ")}`
      )
    return await inPage(page)
  } finally {
    await context.close()
  }
}

async function visit(page: Page, route: string) {
  const response = await page.goto(BASE + route, { waitUntil: "networkidle" })
  if (!response?.ok())
    throw new Error(`${route} answered ${response?.status() ?? "nothing"}`)
  await page.evaluate(() => document.fonts.ready)
  const themed = await page.evaluate(
    () =>
      document.documentElement.classList.contains("dark") ===
      matchMedia("(prefers-color-scheme: dark)").matches
  )
  if (!themed) throw new Error(`${route} ignored the emulated color scheme`)
  // Tiles use content-visibility:auto, which skips layout off screen and leaves
  // stale rects right after a scroll.
  await page.addStyleTag({
    content:
      "nextjs-portal{display:none!important}" +
      "article{content-visibility:visible!important}",
  })
  await page.waitForTimeout(150)
}

async function viewport(page: Page) {
  return decodePng(
    await page.screenshot({ animations: "disabled", caret: "hide" })
  )
}

/** The first rendered match's rect, scrolled to the center if asked. */
async function rectOf(
  page: Page,
  selector: string,
  scroll = false
): Promise<Rect | null> {
  return page.evaluate(
    ([sel, scroll]) => {
      const el = [...document.querySelectorAll<HTMLElement>(sel)].find(
        (e) => e.getClientRects().length > 0
      )
      if (!el) return null
      if (scroll)
        el.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "instant",
        })
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    },
    [selector, scroll] as const
  )
}

const center = (page: Page, selector: string) => rectOf(page, selector, true)

async function computedValue(page: Page, selector: string, prop: string) {
  return page.evaluate(
    ([sel, p]) => {
      const el = [...document.querySelectorAll(sel)].find(
        (e) => e.getClientRects().length > 0
      )
      return el ? getComputedStyle(el).getPropertyValue(p) : null
    },
    [selector, prop] as const
  )
}

/**
 * A computed color as 8-bit sRGB via a canvas fill, or null when nothing
 * matches or the color is translucent, so the backdrop decides what shows.
 */
async function computedRgb(
  page: Page,
  selector: string,
  prop: string
): Promise<RGB | null> {
  const c = await computedRgba(page, selector, prop)
  return c && c.alpha === 1 ? c.rgb : null
}

/** A computed color with its alpha, folded with every ancestor's opacity. */
async function computedRgba(
  page: Page,
  selector: string,
  prop: string
): Promise<{ rgb: RGB; alpha: number } | null> {
  return page.evaluate(
    ([sel, p]) => {
      const el = [...document.querySelectorAll<HTMLElement>(sel)].find(
        (e) => e.getClientRects().length > 0
      )
      if (!el) return null
      const css = getComputedStyle(el).getPropertyValue(p)
      if (!CSS.supports("color", css)) return null
      let opacity = 1
      for (let e: Element | null = el; e; e = e.parentElement)
        opacity *= Number(getComputedStyle(e).opacity)
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!
      ctx.fillStyle = css
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
      return {
        rgb: [r, g, b] as [number, number, number],
        alpha: (a / 255) * opacity,
      }
    },
    [selector, prop] as const
  )
}

const over = ({ rgb, alpha }: { rgb: RGB; alpha: number }, under: RGB) =>
  rgb.map((v, i) => Math.round(v * alpha + under[i] * (1 - alpha))) as RGB

function clipRect(r: Rect, pad: number) {
  const x = Math.max(0, Math.floor(r.x - pad))
  const y = Math.max(0, Math.floor(r.y - pad))
  const width = Math.min(VIEWPORT.width - x, Math.ceil(r.x + r.width + pad) - x)
  const height = Math.min(
    VIEWPORT.height - y,
    Math.ceil(r.y + r.height + pad) - y
  )
  return width > 2 && height > 2 ? { x, y, width, height } : null
}

let evidenceCount = 0
async function evidence(page: Page, name: string, rect: Rect | null, pad = 24) {
  if (!EVIDENCE || !rect) return
  const clip = clipRect(rect, pad)
  if (!clip) return
  const file = path.join(
    EVIDENCE,
    `${String(++evidenceCount).padStart(2, "0")}-${name}.png`
  )
  await page.screenshot({
    path: file,
    clip,
    animations: "disabled",
    caret: "hide",
  })
}

const TOKENS = [
  "--neu-text",
  "--neu-text-muted",
  "--neu-ring",
  "--neu-destructive",
  "--neu-knob-ink",
  "--neu-edge",
] as const

/** 1.4.3, 1.4.6 and 1.4.11: each token painted on a row of known surfaces. */
async function tokenSweep(page: Page) {
  const setup = await page.evaluate(
    ({ surfaces, tokens }) => {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!
      const host = document.createElement("div")
      host.id = "scorecard-swatches"
      host.style.cssText =
        "position:fixed;inset:0 auto auto 0;z-index:2147483647;display:grid;gap:0"
      const expected = surfaces.map((s) => {
        const row = document.createElement("div")
        row.className = "neu-ground"
        row.style.cssText = `--neu-surface:${s.css};display:flex;gap:8px;padding:8px;width:max-content`
        for (const t of tokens) {
          const sw = document.createElement("div")
          sw.style.cssText = `width:24px;height:24px;background:var(${t})`
          row.append(sw)
        }
        host.append(row)
        ctx.fillStyle = s.css
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        return [r, g, b] as [number, number, number]
      })
      document.body.append(host)
      const style = getComputedStyle(host.firstElementChild!)
      return {
        expected,
        undefinedTokens: tokens.filter(
          (t) => !style.getPropertyValue(t).trim()
        ),
      }
    },
    { surfaces: SURFACES, tokens: [...TOKENS] }
  )
  try {
    if (setup.undefinedTokens.length)
      throw new Error(
        `.neu-ground does not define ${setup.undefinedTokens.join(", ")}`
      )
    await page.waitForTimeout(50)
    const img = await viewport(page)
    return SURFACES.map((s, i) => {
      const y = i * 40 + 20
      const surface = px(img, 4, y)
      const expected = setup.expected[i]
      if (surface.some((v, c) => Math.abs(v - expected[c]) > 2))
        throw new Error(
          `the ${s.name} row painted ${hex(surface)} instead of ${hex(expected)}`
        )
      const tokens = Object.fromEntries(
        TOKENS.map((t, j) => {
          const c = px(img, 8 + j * 32 + 12, y)
          return [t, { color: hex(c), ratio: round(ratio(c, surface)) }]
        })
      )
      return {
        surface: s.name,
        css: s.css,
        rendered: hex(surface),
        maxPossible: round(
          Math.max(ratio([255, 255, 255], surface), ratio([0, 0, 0], surface))
        ),
        tokens,
      }
    })
  } finally {
    await page.evaluate(() =>
      document.getElementById("scorecard-swatches")?.remove()
    )
  }
}

/** 2.4.7 for every Tab stop, focused against blurred; the ring under 1.4.11. */
async function focusSweep(page: Page, scheme: Scheme) {
  const name = `${scheme} focus`
  await page.evaluate(() => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    window.scrollTo(0, 0)
  })
  const stops: {
    n: number
    label: string
    neu: boolean
    visible: boolean
    changed: number
    indicatorContrast: number
    ring: number | null
    ringWhere?: string
    shade?: number
    merged?: string[]
  }[] = []
  const seen = new Set<string>()
  const limit = 800
  let ended: "end of page" | "cycle" | "limit" = "limit"
  for (let n = 1; n <= limit; n++) {
    await page.keyboard.press("Tab")
    const info = await page.evaluate((n) => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body || el === document.documentElement)
        return null
      el.dataset.scorecardStop ??= String(n)
      el.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "instant",
      })
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const slotEl = el.closest("[data-slot]")
      const label = (
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        el.textContent ||
        el.getAttribute("placeholder") ||
        el.tagName
      )
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 32)
      return {
        id: el.dataset.scorecardStop!,
        label: `${slotEl?.getAttribute("data-slot") ?? el.tagName.toLowerCase()}: ${label}`,
        neu: !!el.closest("article[id^='neu-']") && !el.matches("article > a"),
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        outline: {
          style: cs.outlineStyle,
          width: parseFloat(cs.outlineWidth) || 0,
          offset: parseFloat(cs.outlineOffset) || 0,
        },
      }
    }, n)
    if (!info) {
      ended = "end of page"
      break
    }
    if (seen.has(info.id)) {
      ended = "cycle"
      break
    }
    seen.add(info.id)
    await page.waitForTimeout(30)
    const pad = 12
    const clip = clipRect(info.rect, pad)
    if (!clip) {
      stops.push({
        n,
        label: info.label,
        neu: info.neu,
        visible: false,
        changed: 0,
        indicatorContrast: 1,
        ring: null,
      })
      continue
    }
    const focused = decodePng(
      await page.screenshot({ clip, animations: "disabled", caret: "hide" })
    )
    await page.evaluate(() => (document.activeElement as HTMLElement).blur())
    await page.waitForTimeout(30)
    const blurred = decodePng(
      await page.screenshot({ clip, animations: "disabled", caret: "hide" })
    )
    let changed = 0
    let indicatorContrast = 1
    for (let y = 0; y < focused.height; y++)
      for (let x = 0; x < focused.width; x++) {
        const k = ratio(px(focused, x, y), px(blurred, x, y))
        if (k >= 1.2) changed++
        indicatorContrast = Math.max(indicatorContrast, k)
      }
    let ring: number | null = null
    let ringWhere: string | undefined
    let merged: string[] | undefined
    let shade: number | undefined
    if (info.outline.style !== "none" && info.outline.width > 0) {
      const local = {
        x: info.rect.x - clip.x,
        y: info.rect.y - clip.y,
        width: info.rect.width,
        height: info.rect.height,
      }
      const m = ringContrast(
        focused,
        local,
        info.outline.offset,
        info.outline.width
      )
      const main = m.lit ?? m.shade
      if (main) {
        ring = round(main.ratio)
        ringWhere = main.where
      }
      if (m.shade) shade = round(m.shade.ratio)
      if (m.merged.length) merged = m.merged
    }
    stops.push({
      n,
      label: info.label,
      neu: info.neu,
      visible: changed >= 24,
      changed,
      indicatorContrast: round(indicatorContrast),
      ring,
      ringWhere,
      shade,
      merged,
    })
    await page.evaluate((id) => {
      document
        .querySelector<HTMLElement>(`[data-scorecard-stop="${id}"]`)
        ?.focus({ preventScroll: true })
    }, info.id)
  }
  if (!stops.length) throw new Error("Tab never focused an element")
  if (ended === "cycle")
    report(
      name,
      `focus returned to an earlier stop after ${stops.length} stops, so the rest of the page went unvisited`
    )
  if (ended === "limit")
    report(
      name,
      `stopped at the ${limit}-stop limit before the end of the page`
    )
  const missing = stops.filter((s) => !s.visible)
  for (const s of missing.slice(0, 2)) {
    const r = await page.evaluate((n) => {
      const el = document.querySelector<HTMLElement>(
        `[data-scorecard-stop="${n}"]`
      )
      if (!el) return null
      el.focus()
      el.scrollIntoView({ block: "center", behavior: "instant" })
      const b = el.getBoundingClientRect()
      return { x: b.x, y: b.y, width: b.width, height: b.height }
    }, String(s.n))
    await evidence(page, `focus-missing-${scheme}-${s.n}`, r)
  }
  const neuTotal = stops.filter((s) => s.neu).length
  const rings = stops.filter((s) => s.neu && s.ring !== null)
  if (neuTotal && !rings.length)
    report(
      name,
      "no component draws its focus ring as an outline, so ring contrast went unmeasured"
    )
  const worstRing = rings.reduce<(typeof rings)[number] | null>(
    (w, s) => (!w || s.ring! < w.ring! ? s : w),
    null
  )
  return {
    total: stops.length,
    visible: stops.length - missing.length,
    neuTotal,
    neuVisible: stops.filter((s) => s.neu && s.visible).length,
    missing: missing.map((s) => ({
      n: s.n,
      label: s.label,
      changed: s.changed,
    })),
    ringMeasured: rings.length,
    worstRing: worstRing && {
      ratio: worstRing.ring,
      stop: worstRing.label,
      where: worstRing.ringWhere,
    },
    ringsBelow3: rings
      .filter((s) => s.ring! < 3)
      .map((s) => ({ stop: s.label, ratio: s.ring, where: s.ringWhere })),
    shadeSideBelow3: rings
      .filter((s) => s.shade !== undefined && s.shade < 3)
      .map((s) => ({ stop: s.label, ratio: s.shade })),
    ringMergesWithFill: stops
      .filter((s) => s.neu && s.merged)
      .map((s) => ({ stop: s.label, sides: s.merged })),
    weakestIndicator: stops
      .filter((s) => s.visible)
      .sort((a, b) => a.indicatorContrast - b.indicatorContrast)
      .slice(0, 3)
      .map((s) => ({ label: s.label, contrast: s.indicatorContrast })),
  }
}

/**
 * Outline against the surface just outside it, best of three reads per side.
 * Bottom and right cross the cast shadow and are kept apart; a side lost in a
 * fill of the ring's own color is listed as merged.
 */
function ringContrast(img: Img, r: Rect, offset: number, width: number) {
  const top = Math.round(r.y)
  const bottom = Math.round(r.y + r.height)
  const left = Math.round(r.x)
  const right = Math.round(r.x + r.width)
  const along = (a: number, len: number, f: number) => a + len * f
  // d counts pixels outward from the border edge, 0 being the first outside
  const sides = [
    {
      where: "top",
      lit: true,
      at: (d: number, f: number) =>
        [along(r.x, r.width, f), top - 1 - d] as const,
    },
    {
      where: "left",
      lit: true,
      at: (d: number, f: number) =>
        [left - 1 - d, along(r.y, r.height, f)] as const,
    },
    {
      where: "bottom",
      lit: false,
      at: (d: number, f: number) =>
        [along(r.x, r.width, f), bottom + d] as const,
    },
    {
      where: "right",
      lit: false,
      at: (d: number, f: number) =>
        [right + d, along(r.y, r.height, f)] as const,
    },
  ]
  const lit: Sample[] = []
  const shade: Sample[] = []
  const merged: string[] = []
  for (const s of sides) {
    let side: Sample | null = null
    for (const f of [0.25, 0.5, 0.75]) {
      const outer = s.at(offset + width + 1, f)
      if (!inside(img, ...outer)) continue
      const outerC = px(img, ...outer)
      let best: { c: RGB; k: number } | null = null
      for (let d = offset; d < offset + width; d++) {
        const c = px(img, ...s.at(d, f))
        const k = ratio(c, outerC)
        if (!best || k > best.k) best = { c, k }
      }
      if (!best || best.k < 1.15) continue
      if (!side || best.k > side.ratio)
        side = {
          ratio: best.k,
          where: s.where,
          fg: hex(best.c),
          bg: hex(outerC),
        }
    }
    if (!side) merged.push(s.where)
    else (s.lit ? lit : shade).push(side)
  }
  return { lit: worst(lit), shade: worst(shade), merged }
}

type Mode = "default" | "contrast-more" | "forced-colors"
type Reading = { samples: Sample[]; rect: Rect; note?: string }

const ENABLED = ":not([disabled]):not([data-disabled])"
const MENU_TRIGGER = "#neu-dropdown-menu [data-slot=dropdown-menu-trigger]"

/** Opens the dropdown by keyboard, so its first row is highlighted. */
async function openMenu(page: Page, ready: string) {
  need(await center(page, MENU_TRIGGER), MENU_TRIGGER)
  await page.focus(MENU_TRIGGER)
  await page.keyboard.press("Enter")
  await page.waitForSelector(ready, { timeout: 3000 })
}

async function switchOn(page: Page, mode: Mode): Promise<Reading> {
  const sel = `#neu-switch [data-slot=switch][data-state=checked]${ENABLED}`
  const thumbSel = `${sel} [data-slot=switch-thumb]`
  const t = need(await center(page, sel), sel)
  const h = need(await rectOf(page, thumbSel), thumbSel)
  const img = await viewport(page)
  const freeLeft = h.x - t.x > t.x + t.width - (h.x + h.width)
  const fx = freeLeft ? (t.x + h.x) / 2 : (h.x + h.width + t.x + t.width) / 2
  const cy = t.y + t.height / 2
  if (mode === "forced-colors") {
    const track = patch(img, fx, cy)
    const thumbEdge = px(img, freeLeft ? h.x + 0.5 : h.x + h.width - 0.5, cy)
    return {
      samples: [
        {
          ratio: ratio(thumbEdge, track),
          where: "thumb rim vs track",
          fg: hex(thumbEdge),
          bg: hex(track),
        },
      ],
      rect: t,
      note: "forced colors drop the fill; the state reads from the thumb's side",
    }
  }
  const fill = patch(img, fx, cy)
  return {
    samples: around(img, fill, [
      [freeLeft ? t.x - 3 : t.x + t.width + 3, cy, "track end vs page"],
      [fx, t.y - 3, "track top vs page"],
      [fx, t.y + t.height + 3, "track bottom vs page"],
    ]),
    rect: t,
  }
}

async function checkboxChecked(page: Page): Promise<Reading> {
  const sel = `#neu-checkbox [data-slot=checkbox][data-state=checked]${ENABLED}`
  const tickSel = `${sel} [data-slot=checkbox-indicator]`
  const r = need(await center(page, sel), sel)
  const tick = need(await computedRgba(page, tickSel, "color"), tickSel)
  const img = await viewport(page)
  const cx = r.x + r.width / 2
  const cy = r.y + r.height / 2
  // Forced colors keep the tick's alpha, so it is laid over each well pixel it
  // is compared with; with shadows gone the well is flat there.
  const samples = (
    [
      [r.x + 4, cy, "well start"],
      [r.x + r.width - 4, cy, "well end"],
      [cx, r.y + 4, "well top"],
      [cx, r.y + r.height - 4, "well bottom"],
    ] as [number, number, string][]
  )
    .filter(([x, y]) => inside(img, x, y))
    .map(([x, y, where]) => {
      const well = px(img, x, y)
      const ink = over(tick, well)
      return { ratio: ratio(ink, well), where, fg: hex(ink), bg: hex(well) }
    })
  return { samples, rect: r }
}

/** Lit sides only: the bottom and end gaps hold the cap's own cast shadow. */
async function radioChecked(page: Page): Promise<Reading> {
  const sel = `#neu-radio-group [data-slot=radio-group-item][data-state=checked]${ENABLED}`
  const capSel = `${sel} [data-slot=radio-group-indicator]`
  const r = need(await center(page, sel), sel)
  const i = need(await rectOf(page, capSel), capSel)
  const img = await viewport(page)
  const cx = i.x + i.width / 2
  const cy = i.y + i.height / 2
  const cap = patch(img, cx, cy)
  return {
    samples: around(img, cap, [
      [i.x - 2, cy, "well floor start"],
      [cx, i.y - 2, "well floor top"],
    ]),
    rect: r,
  }
}

async function toggleOn(page: Page): Promise<Reading> {
  const sel = `#neu-toggle [data-slot=toggle][data-state=on]${ENABLED}`
  const r = need(await center(page, sel), sel)
  const img = await viewport(page)
  const cx = r.x + r.width / 2
  const cy = r.y + r.height / 2
  const faces = [
    patch(img, r.x + 5, cy),
    patch(img, r.x + r.width - 5, cy),
    patch(img, cx, r.y + 4),
    patch(img, cx, r.y + r.height - 4),
  ].sort((a, b) => luminance(a) - luminance(b))
  return {
    samples: around(img, faces[1], [
      [r.x - 3, cy, "page start"],
      [r.x + r.width + 3, cy, "page end"],
      [cx, r.y - 3, "page top"],
      [cx, r.y + r.height + 3, "page bottom"],
    ]),
    rect: r,
  }
}

/** The active cap of a tab list or toggle group against the tray beside it. */
async function capContrast(
  page: Page,
  list: string,
  item: string,
  active: string
): Promise<Reading> {
  const onSel = `${list} ${item}${active}`
  const offSel = `${list} ${item}:not(${active})`
  const listRect = need(await center(page, list), list)
  const cap = need(
    (await rectOf(page, `${list} [data-slot=sliding-key]`)) ??
      (await rectOf(page, onSel)),
    onSel
  )
  const img = await viewport(page)
  const cy = cap.y + cap.height / 2
  const face = patch(img, cap.x + 6, cy)
  // Lit sides only, since the end and bottom hold the cap's own cast shadow; a
  // solid border (drawn under prefers-contrast) can carry the state instead.
  const capSel = (await rectOf(page, `${list} [data-slot=sliding-key]`))
    ? `${list} [data-slot=sliding-key]`
    : onSel
  const border =
    parseFloat((await computedValue(page, capSel, "border-top-width")) ?? "") >=
    1
      ? await computedRgb(page, capSel, "border-top-color")
      : null
  const samples = (
    [
      [cap.x - 2, cy, "tray start"],
      [cap.x + 6, cap.y - 2, "tray top"],
    ] as [number, number, string][]
  )
    .filter(([x, y]) => inside(img, x, y))
    .map(([x, y, where]) => {
      const tray = px(img, x, y)
      const byFace = {
        ratio: ratio(face, tray),
        where: `${where} (face)`,
        fg: hex(face),
        bg: hex(tray),
      }
      if (!border) return byFace
      const byBorder = {
        ratio: ratio(border, tray),
        where: `${where} (border)`,
        fg: hex(border),
        bg: hex(tray),
      }
      return byBorder.ratio > byFace.ratio ? byBorder : byFace
    })
  const on = await computedRgb(page, onSel, "color")
  const off = await computedRgb(page, offSel, "color")
  const onWeight = await computedValue(page, onSel, "font-weight")
  const offWeight = await computedValue(page, offSel, "font-weight")
  const weight =
    onWeight === offWeight
      ? "same weight"
      : `weight ${onWeight} vs ${offWeight}`
  const note =
    on && off
      ? `active label ${hex(on)} vs inactive ${hex(off)}: ${round(ratio(on, off))}, ${weight}`
      : undefined
  return { samples, rect: listRect, note }
}

async function sliderRange(page: Page): Promise<Reading> {
  const sel = `#neu-slider [data-slot=slider]${ENABLED}:not([data-orientation=vertical])`
  const trackSel = `${sel} [data-slot=slider-track]`
  const rangeSel = `${sel} [data-slot=slider-range]`
  const s = need(await center(page, sel), sel)
  const track = need(await rectOf(page, trackSel), trackSel)
  const range = need(await rectOf(page, rangeSel), rangeSel)
  const img = await viewport(page)
  const cy = track.y + track.height / 2
  const fx = range.x + range.width * 0.35
  const fill = patch(img, fx, cy)
  return {
    samples: around(img, fill, [
      [fx, track.y - 3, "page above"],
      [fx, track.y + track.height + 3, "page below"],
      [track.x + track.width - 6, cy, "empty groove"],
    ]),
    rect: s,
  }
}

async function progressFill(page: Page): Promise<Reading> {
  const sel = "#neu-progress [data-slot=progress]"
  const indSel = "#neu-progress [data-slot=progress-indicator]"
  const p = need(await center(page, sel), sel)
  const ind = need(await rectOf(page, indSel), indSel)
  const img = await viewport(page)
  const cy = p.y + p.height / 2
  const fx = ind.x + ind.width / 2
  const fill = patch(img, fx, cy)
  const points: [number, number, string][] = [
    [fx, p.y - 3, "page above"],
    [fx, p.y + p.height + 3, "page below"],
  ]
  if (p.x + p.width - (ind.x + ind.width) > 12)
    points.push([(ind.x + ind.width + p.x + p.width) / 2, cy, "empty groove"])
  return { samples: around(img, fill, points), rect: p }
}

async function calendarSelected(page: Page): Promise<Reading> {
  const sel =
    "#neu-calendar [data-slot=calendar] button[data-selected-single=true]"
  const r = need(await center(page, sel), sel)
  const img = await viewport(page)
  const cx = r.x + r.width / 2
  const cy = r.y + r.height / 2
  const faces = [
    patch(img, r.x + 5, cy),
    patch(img, r.x + r.width - 5, cy),
    patch(img, cx, r.y + 5),
    patch(img, cx, r.y + r.height - 5),
  ].sort((a, b) => luminance(a) - luminance(b))
  return {
    samples: around(img, faces[1], [
      [r.x - 2, cy, "calendar start"],
      [r.x + r.width + 2, cy, "calendar end"],
      [cx, r.y - 2, "calendar top"],
      [cx, r.y + r.height + 2, "calendar bottom"],
    ]),
    rect: r,
  }
}

async function sidebarActive(page: Page): Promise<Reading> {
  const sel = "#neu-sidebar [data-sidebar=menu-button][data-active=true]"
  const r = need(await center(page, sel), sel)
  const img = await viewport(page)
  const rtl = (await computedValue(page, sel, "direction")) === "rtl"
  const cy = r.y + r.height / 2
  const barX = rtl ? r.x + r.width - 3.5 : r.x + 3.5
  const bar = px(img, barX, cy)
  return {
    samples: around(img, bar, [
      [rtl ? barX - 4 : barX + 4, cy, "chip beside the bar"],
    ]),
    rect: r,
  }
}

async function menuHighlight(page: Page): Promise<Reading> {
  const row = "[data-slot=dropdown-menu-content] [data-highlighted]"
  try {
    await openMenu(page, row)
    const m = need(await rectOf(page, row), row)
    const img = await viewport(page)
    const cy = m.y + m.height / 2
    const ringPx = [px(img, m.x, cy), px(img, m.x + 1, cy)]
    const tint = px(img, m.x + 5, cy)
    const outside = px(img, m.x - 2, cy)
    const ringC = ringPx.sort(
      (a, b) =>
        Math.min(ratio(b, tint), ratio(b, outside)) -
        Math.min(ratio(a, tint), ratio(a, outside))
    )[0]
    return {
      samples: [
        {
          ratio: ratio(ringC, tint),
          where: "inset ring vs row tint",
          fg: hex(ringC),
          bg: hex(tint),
        },
        {
          ratio: ratio(ringC, outside),
          where: "inset ring vs menu",
          fg: hex(ringC),
          bg: hex(outside),
        },
      ],
      rect: m,
      note: `row tint alone vs menu ${round(ratio(tint, outside))}`,
    }
  } finally {
    await page.keyboard.press("Escape")
    await page.waitForTimeout(200)
  }
}

const STATE_READERS: [string, (page: Page, mode: Mode) => Promise<Reading>][] =
  [
    ["switch-on", switchOn],
    ["checkbox-checked", checkboxChecked],
    ["radio-checked", radioChecked],
    ["toggle-on", toggleOn],
    [
      "tabs-active",
      (page) =>
        capContrast(
          page,
          "#neu-tabs [data-slot=tabs-list]",
          "[data-slot=tabs-trigger]",
          "[data-state=active]"
        ),
    ],
    [
      "toggle-group-on",
      (page) =>
        capContrast(
          page,
          "#neu-toggle-group [data-slot=toggle-group]",
          "[data-slot=toggle-group-item]",
          "[data-state=on]"
        ),
    ],
    ["slider-range", sliderRange],
    ["progress-fill", progressFill],
    ["calendar-selected", calendarSelected],
    ["sidebar-active", sidebarActive],
    ["menu-highlight", menuHighlight],
  ]

/** 1.4.11 and 1.4.1: each selected state without its shadow, worst side. */
async function stateContrast(page: Page, scheme: Scheme, mode: Mode) {
  const results: Record<string, (Sample & { note?: string }) | Unmeasured> = {}
  for (const [key, read] of STATE_READERS) {
    results[key] = await check(`${scheme} ${mode} states ${key}`, async () => {
      const { samples, rect, note } = await read(page, mode)
      const w = worst(samples)
      if (!w) throw new Error("every sample point fell outside the viewport")
      if (w.ratio < 3 && mode !== "forced-colors")
        await evidence(page, `state-${key}-${scheme}-${mode}`, rect)
      return { ...w, ratio: round(w.ratio), note }
    })
  }
  return results
}

const STEPS = Array.from({ length: 9 }, (_, i) => 0.3 + i * 0.05)

function peerReading(
  img: Img,
  a: Rect,
  b: Rect,
  how: "center" | "band"
): Sample {
  const at = (r: Rect, fx: number, fy: number, dx = 0, dy = 0) =>
    px(img, r.x + r.width * fx + dx, r.y + r.height * fy + dy)
  let k = 1
  let fg: RGB = [0, 0, 0]
  let bg: RGB = [0, 0, 0]
  if (how === "center") {
    const ref = at(b, 0.5, 0.5)
    for (const fy of STEPS)
      for (const fx of STEPS) {
        const c = at(a, fx, fy)
        const q = ratio(c, ref)
        if (q > k) [k, fg, bg] = [q, c, ref]
      }
  } else {
    const per: { k: number; fg: RGB; bg: RGB }[] = []
    for (const f of [0.3, 0.4, 0.5, 0.6, 0.7])
      for (const [fx, fy, nx, ny] of [
        [f, 0, 0, 1],
        [f, 1, 0, -1],
        [0, f, 1, 0],
        [1, f, -1, 0],
      ]) {
        let best = { k: 1, fg: [0, 0, 0] as RGB, bg: [0, 0, 0] as RGB }
        for (let d = -3; d <= 4; d++) {
          const ca = at(a, fx, fy, nx * (d + 0.5), ny * (d + 0.5))
          const cb = at(b, fx, fy, nx * (d + 0.5), ny * (d + 0.5))
          const q = ratio(ca, cb)
          if (q > best.k) best = { k: q, fg: ca, bg: cb }
        }
        per.push(best)
      }
    per.sort((p, q) => p.k - q.k)
    const mid = per[Math.floor(per.length / 2)]
    ;[k, fg, bg] = [mid.k, mid.fg, mid.bg]
  }
  return {
    ratio: k,
    where: `selected vs unselected (${how})`,
    fg: hex(fg),
    bg: hex(bg),
  }
}

/**
 * Selected against an unselected peer, the reading forced colors cannot erase.
 * Checkbox and radio compare centers, where the mark sits; the rest an edge band.
 */
async function peerContrast(page: Page, scheme: Scheme, mode: Mode) {
  const pairs = [
    [
      "checkbox",
      "#neu-checkbox [data-slot=checkbox]",
      "[data-state=checked]",
      "center",
    ],
    [
      "radio",
      "#neu-radio-group [data-slot=radio-group-item]",
      "[data-state=checked]",
      "center",
    ],
    ["toggle", "#neu-toggle [data-slot=toggle]", "[data-state=on]", "band"],
    [
      "tabs",
      "#neu-tabs [data-slot=tabs-trigger]",
      "[data-state=active]",
      "band",
    ],
    [
      "toggle group",
      "#neu-toggle-group [data-slot=toggle-group-item]",
      "[data-state=on]",
      "band",
    ],
    [
      "calendar day",
      "#neu-calendar [data-slot=calendar] button[data-day]",
      "[data-selected-single=true]",
      "band",
    ],
    [
      "sidebar item",
      "#neu-sidebar [data-sidebar=menu-button]",
      "[data-active=true]",
      "band",
    ],
    [
      "menu highlight",
      "[data-slot=dropdown-menu-content] [role=menuitem]",
      "[data-highlighted]",
      "band",
    ],
  ] as const
  const results: Record<string, Sample | Unmeasured> = {}
  for (const [key, base, on, how] of pairs) {
    results[key] = await check(`${scheme} ${mode} peers ${key}`, async () => {
      const menu = key === "menu highlight"
      const onSel = `${base}${on}${ENABLED}`
      const offSel = `${base}:not(${on})${ENABLED}`
      try {
        if (menu) {
          await openMenu(page, `${base}${on}`)
          await page.waitForTimeout(300)
        } else need(await center(page, onSel), onSel)
        const a = need(await rectOf(page, onSel), onSel)
        const b = need(await rectOf(page, offSel), offSel)
        const reading = peerReading(await viewport(page), a, b, how)
        if (reading.ratio < 3) {
          const box = {
            x: Math.min(a.x, b.x),
            y: Math.min(a.y, b.y),
            width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x),
            height:
              Math.max(a.y + a.height, b.y + b.height) - Math.min(a.y, b.y),
          }
          await evidence(
            page,
            `peer-${key.replace(/ /g, "-")}-${scheme}-${mode}`,
            box,
            16
          )
        }
        return { ...reading, ratio: round(reading.ratio) }
      } finally {
        if (menu) {
          await page.keyboard.press("Escape")
          await page.waitForTimeout(300)
        }
      }
    })
  }
  return results
}

/** 1.4.11: the boundary of each overlay against the page behind it. */
async function overlayEdges(page: Page, scheme: Scheme) {
  const results: Record<
    string,
    (Sample & { lineOnly: number; lampSides: number }) | Unmeasured
  > = {}
  const overlays = [
    {
      key: "dialog",
      trigger: "#neu-dialog [data-slot=dialog-trigger]",
      content: "[data-slot=dialog-content]",
      how: "click",
    },
    {
      key: "popover",
      trigger: "#neu-popover [data-slot=popover-trigger]",
      content: "[data-slot=popover-content]",
      how: "click",
    },
    {
      key: "menu",
      trigger: MENU_TRIGGER,
      content: "[data-slot=dropdown-menu-content]",
      how: "click",
    },
    {
      key: "tooltip",
      trigger: "#neu-tooltip [data-slot=tooltip-trigger]",
      content: "[data-slot=tooltip-content]",
      how: "hover",
    },
  ] as const
  for (const o of overlays) {
    results[o.key] = await check(`${scheme} overlays ${o.key}`, async () => {
      need(await center(page, o.trigger), o.trigger)
      try {
        if (o.how === "hover") await page.hover(o.trigger)
        else await page.click(o.trigger)
        await page.waitForSelector(o.content, { timeout: 3000 })
        await page.waitForTimeout(400)
        const r = need(await rectOf(page, o.content), o.content)
        const img = await viewport(page)
        const samples: (Sample & { line: number; lamp: boolean })[] = []
        const sides = [
          {
            where: "top",
            x: r.x,
            y: r.y,
            ax: 1,
            ay: 0,
            len: r.width,
            nx: 0,
            ny: -1,
            lamp: true,
          },
          {
            where: "start",
            x: r.x,
            y: r.y,
            ax: 0,
            ay: 1,
            len: r.height,
            nx: -1,
            ny: 0,
            lamp: true,
          },
          {
            where: "bottom",
            x: r.x,
            y: r.y + r.height,
            ax: 1,
            ay: 0,
            len: r.width,
            nx: 0,
            ny: 1,
            lamp: false,
          },
          {
            where: "end",
            x: r.x + r.width,
            y: r.y,
            ax: 0,
            ay: 1,
            len: r.height,
            nx: 1,
            ny: 0,
            lamp: false,
          },
        ]
        // two runs per side, clear of the corners and of a centered tooltip arrow
        for (const [from, to] of [
          [0.15, 0.4],
          [0.6, 0.85],
        ]) {
          for (const s of sides) {
            const run = (d: number) => {
              const out: RGB[] = []
              for (let k = 0; k < 12; k++) {
                const t = s.len * (from + ((to - from) * k) / 11)
                // the border is the first pixel inside the box; d counts outward
                const x =
                  s.x +
                  s.ax * t +
                  (s.nx ? s.nx * d + (s.nx > 0 ? -0.5 : 0.5) : 0)
                const y =
                  s.y +
                  s.ay * t +
                  (s.ny ? s.ny * d + (s.ny > 0 ? -0.5 : 0.5) : 0)
                out.push(px(img, x, y))
              }
              out.sort((a, b) => luminance(a) - luminance(b))
              return out[6]
            }
            const outer = run(3)
            const line = run(0)
            const face = run(-4)
            const lineK = ratio(line, outer)
            const faceK = ratio(face, outer)
            samples.push({
              ratio: Math.max(lineK, faceK),
              line: lineK,
              lamp: s.lamp,
              where: `${s.where} ${from * 100}-${to * 100}%`,
              fg: hex(lineK >= faceK ? line : face),
              bg: hex(outer),
            })
          }
        }
        const w = worst(samples)!
        if (w.ratio < 3) await evidence(page, `overlay-${o.key}-${scheme}`, r)
        return {
          ...w,
          ratio: round(w.ratio),
          lineOnly: round(Math.min(...samples.map((s) => s.line))),
          lampSides: round(
            Math.min(...samples.filter((s) => s.lamp).map((s) => s.ratio))
          ),
        }
      } finally {
        await page.keyboard.press("Escape")
        if (o.how === "hover")
          await page.mouse.move(VIEWPORT.width - 2, VIEWPORT.height - 2)
        await page.waitForTimeout(300)
      }
    })
  }
  return results
}

/** 1.4.11: the edge that tells each empty field apart from the page. */
async function fieldEdges(page: Page, scheme: Scheme, mode: Mode) {
  const kinds = [
    ["input", `article [data-slot=input]${ENABLED}`],
    ["textarea", `article [data-slot=textarea]${ENABLED}`],
    ["select", `article [data-slot=select-trigger]${ENABLED}`],
    [
      "checkbox",
      `article [data-slot=checkbox][data-state=unchecked]${ENABLED}`,
    ],
    [
      "radio",
      `article [data-slot=radio-group-item][data-state=unchecked]${ENABLED}`,
    ],
    ["otp slot", "article [data-slot=input-otp-slot]"],
  ] as const
  const results: Record<
    string,
    (Sample & { computedBorder?: string }) | Unmeasured
  > = {}
  for (const [key, sel] of kinds) {
    results[key] = await check(`${scheme} ${mode} fields ${key}`, async () => {
      const r = need(await center(page, sel), sel)
      const img = await viewport(page)
      const border = await computedRgb(page, sel, "border-top-color")
      const cx = r.x + r.width / 2
      const cy = r.y + r.height / 2
      // top and start only: a raised field casts its own shadow past the others
      const sides: [number, number, number, number, string][] = [
        [cx, r.y + 0.5, cx, r.y - 3, "top"],
        [r.x + 0.5, cy, r.x - 3, cy, "start"],
      ]
      const samples = sides.map(([bx, by, ox, oy, where]) => {
        const line = px(img, bx, by)
        const out = px(img, ox, oy)
        return { ratio: ratio(line, out), where, fg: hex(line), bg: hex(out) }
      })
      const w = worst(samples)!
      if (key === "input")
        await evidence(page, `field-edge-${scheme}-${mode}`, r, 16)
      return {
        ...w,
        ratio: round(w.ratio),
        computedBorder: border ? hex(border) : undefined,
      }
    })
  }
  return results
}

async function finishAnimations(page: Page) {
  await page.evaluate(() => {
    for (const anim of document.getAnimations())
      if (
        (anim.effect as KeyframeEffect | null)?.getComputedTiming()
          .iterations !== Infinity
      )
        anim.finish()
  })
}

/** What each running animation changes between its first and last frame. */
async function readMotion(page: Page) {
  return page.evaluate(() => {
    const moved: string[] = []
    const faded: string[] = []
    const read = (t: Element, pseudo: string | null) => {
      const cs = getComputedStyle(t, pseudo)
      const r = t.getBoundingClientRect()
      return {
        transform: cs.transform,
        translate: cs.translate,
        scale: cs.scale,
        rotate: cs.rotate,
        boxShadow: cs.boxShadow,
        filter: cs.filter,
        opacity: cs.opacity,
        rect: pseudo
          ? ""
          : `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`,
      }
    }
    // 2.3.3 does not count color, blur or opacity changes as motion
    const still = ["opacity", "filter"]
    for (const anim of document.getAnimations()) {
      const effect = anim.effect as KeyframeEffect | null
      const target = effect?.target
      if (!effect || !target?.closest("[data-slot]")) continue
      const timing = effect.getComputedTiming()
      if (timing.iterations === Infinity) continue
      const end = Number(timing.endTime ?? 0)
      if (end <= 0) continue
      anim.pause()
      anim.currentTime = 0
      const a = read(target, effect.pseudoElement)
      anim.currentTime = Math.max(0, end - 1)
      const b = read(target, effect.pseudoElement)
      anim.finish()
      const changed = (Object.keys(a) as (keyof typeof a)[]).filter(
        (k) => a[k] !== b[k]
      )
      if (!changed.length) continue
      const name =
        anim instanceof CSSTransition
          ? `transition ${anim.transitionProperty}`
          : anim instanceof CSSAnimation
            ? `animation ${anim.animationName}`
            : "animation"
      const slot = target.closest("[data-slot]")!.getAttribute("data-slot")
      const motion = changed.filter((k) => !still.includes(k))
      if (motion.length)
        moved.push(`${slot}: ${name} moves ${motion.join("+")}`)
      else faded.push(`${slot}: ${name} changes ${changed.join("+")}`)
    }
    return { moved, faded }
  })
}

/** 2.3.3: the motion each interaction starts, and the ambient loops. */
async function motionProbe(page: Page, label: string) {
  const actions: {
    key: string
    run: () => Promise<void>
    undo: () => Promise<void>
  }[] = []
  const click = (sel: string) => async () => {
    need(await center(page, sel), sel)
    await page.click(sel)
  }
  const esc = async () => {
    await page.keyboard.press("Escape")
    await page.waitForTimeout(600)
  }
  const away = () => page.mouse.move(VIEWPORT.width - 2, VIEWPORT.height - 2)
  for (const [key, sel] of [
    ["dialog", "#neu-dialog [data-slot=dialog-trigger]"],
    ["alert dialog", "#neu-alert-dialog [data-slot=alert-dialog-trigger]"],
    ["sheet", "#neu-sheet [data-slot=sheet-trigger]"],
    ["drawer", "#neu-drawer [data-slot=drawer-trigger]"],
    ["popover", "#neu-popover [data-slot=popover-trigger]"],
    ["menu", MENU_TRIGGER],
  ] as const)
    actions.push({ key, run: click(sel), undo: esc })
  actions.push({
    key: "tooltip",
    run: async () => {
      const trigger = "#neu-tooltip [data-slot=tooltip-trigger]"
      need(await center(page, trigger), trigger)
      await page.hover(trigger)
      await page.waitForSelector("[data-slot=tooltip-content]", {
        timeout: 2000,
      })
    },
    undo: async () => {
      await away()
      await page.waitForTimeout(400)
    },
  })
  actions.push({
    key: "navigation menu",
    run: async () => {
      const sel = "#neu-navigation-menu [data-slot=navigation-menu-trigger]"
      need(await center(page, sel), sel)
      const triggers = page.locator(sel)
      await triggers.nth(0).hover()
      await page.waitForTimeout(500)
      await finishAnimations(page)
      await triggers.nth(1).hover()
      await page.waitForTimeout(50)
    },
    undo: async () => {
      await away()
      await esc()
    },
  })
  for (const [key, sel] of [
    ["accordion", "article [data-slot=accordion-trigger][data-state=closed]"],
    ["switch", `article [data-slot=switch][data-state=unchecked]${ENABLED}`],
    [
      "checkbox",
      `article [data-slot=checkbox][data-state=unchecked]${ENABLED}`,
    ],
    [
      "radio",
      `article [data-slot=radio-group-item][data-state=unchecked]${ENABLED}`,
    ],
    ["toggle", `article [data-slot=toggle][data-state=off]${ENABLED}`],
    ["tabs", "article [data-slot=tabs-trigger][data-state=inactive]"],
    ["progress", "article [data-slot=progress]"],
  ] as const)
    actions.push({ key, run: click(sel), undo: () => page.waitForTimeout(500) })
  actions.push({
    key: "button press",
    run: async () => {
      const sel = "article [data-slot=button]"
      const r = need(await center(page, sel), sel)
      await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2)
      await page.mouse.down()
    },
    undo: async () => {
      await page.mouse.up()
      await away()
      await page.waitForTimeout(400)
    },
  })

  const onInteraction: Record<string, string[]> = {}
  const fades: Record<string, string[]> = {}
  const unmeasured: string[] = []
  for (const a of actions) {
    await finishAnimations(page)
    const seen = await check(`${label} motion ${a.key}`, async () => {
      try {
        await a.run()
        return await readMotion(page)
      } finally {
        await a.undo()
      }
    })
    if ("error" in seen) {
      unmeasured.push(a.key)
      continue
    }
    onInteraction[a.key] = seen.moved
    fades[a.key] = seen.faded
  }
  const ambient = await page.evaluate(() => [
    ...new Set(
      document
        .getAnimations()
        .filter(
          (a) =>
            (a.effect as KeyframeEffect | null)?.getComputedTiming()
              .iterations === Infinity
        )
        .filter((a) =>
          (a.effect as KeyframeEffect).target?.closest("[data-slot]")
        )
        .map((a) => {
          const t = (a.effect as KeyframeEffect).target
          const s = getComputedStyle(t as Element)
          return `${t!.closest("[data-slot]")!.getAttribute("data-slot")}: ${a instanceof CSSAnimation ? a.animationName : "animation"} ${s.animationDuration}`
        })
    ),
  ])
  return { onInteraction, fades, ambient, unmeasured }
}

/**
 * 2.5.3 on the calendar day buttons: the accessible name must contain the
 * visible text as a whole word; starting with it is the advised form.
 */
async function dayButtonNames(page: Page, route: string) {
  const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  await visit(page, route)
  const days = page.locator("[data-slot=calendar] button[data-day]")
  const n = await days.count()
  let checked = 0
  let starts = 0
  let contains = 0
  const failing: { visible: string; name: string }[] = []
  let example: { visible: string; name: string } | null = null
  for (let i = 0; i < n; i++) {
    const b = days.nth(i)
    if (!(await b.isVisible())) continue
    checked++
    const visible = (await b.innerText()).trim().replace(/\s+/g, " ")
    const line = (await b.ariaSnapshot({ timeout: 2000 })).split("\n")[0]
    const m =
      line.match(/^- button "((?:[^"\\]|\\.)*)"/) ??
      line.match(/^- button ([^[:]+?)\s*(?:\[|:|$)/)
    const name = m ? m[1].replace(/\\"/g, '"').trim() : ""
    example ??= { visible, name }
    const word = escape(visible) + "(?![\\p{L}\\p{N}])"
    const atStart = new RegExp(`^${word}`, "iu").test(name)
    if (atStart) starts++
    if (atStart || new RegExp(`(?<![\\p{L}\\p{N}])${word}`, "iu").test(name))
      contains++
    else failing.push({ visible, name })
  }
  if (!checked) throw new Error(`no visible calendar day buttons on ${route}`)
  return {
    dayButtons: checked,
    nameContainsVisible: contains,
    nameStartsWithVisible: starts,
    example,
    failing: failing.slice(0, 5),
    failingCount: failing.length,
  }
}

type DayNames = Awaited<ReturnType<typeof dayButtonNames>>

async function labelInName(page: Page, routes: string[]) {
  const pages: ({ route: string } & (DayNames | Unmeasured))[] = []
  for (const route of routes)
    pages.push({
      route,
      ...(await check(`light names ${route}`, () =>
        dayButtonNames(page, route)
      )),
    })
  const sum = (pick: (p: DayNames) => number) =>
    pages.reduce((t, p) => t + ("error" in p ? 0 : pick(p)), 0)
  return {
    test: "accessible name (Playwright aria snapshot) contains the button's visible text as a whole word; nameStartsWithVisible counts the advised form",
    dayButtons: sum((p) => p.dayButtons),
    failing: sum((p) => p.failingCount),
    pages,
  }
}

const CONTROLS =
  "button, a[href], input, select, textarea, [role=button], [role=checkbox], [role=radio], [role=switch], [role=slider], [role=tab], [role=menuitem]"

/** 2.5.8: named small controls, then every gallery target under 24px. */
async function targetSizes(page: Page) {
  const kinds = [
    ["checkbox", `article [data-slot=checkbox]${ENABLED}`],
    ["radio", `article [data-slot=radio-group-item]${ENABLED}`],
    ["switch sm", `article [data-slot=switch][data-size=sm]${ENABLED}`],
    ["switch", `article [data-slot=switch][data-size=default]${ENABLED}`],
    ["slider thumb", `article [data-slot=slider-thumb]:not([data-disabled])`],
  ] as const
  const named: Record<
    string,
    NonNullable<Awaited<ReturnType<typeof hitArea>>> | Unmeasured
  > = {}
  for (const [key, sel] of kinds)
    named[key] = await check(`light targets ${key}`, async () =>
      need(await hitArea(page, sel), sel)
    )
  const sweep = await page.evaluate((controls) => {
    const sel = `article[id^='neu-'] :is(${controls}, [tabindex]:not([tabindex='-1']))`
    const targets = [...document.querySelectorAll<HTMLElement>(sel)]
      .filter((e) => !e.matches("article > a"))
      .filter(
        (e) =>
          e.getClientRects().length > 0 &&
          !e.matches(":disabled,[data-disabled],[aria-disabled=true]")
      )
    const small = targets
      .map((e, i) => {
        e.dataset.scorecardTarget = String(i)
        const r = e.getBoundingClientRect()
        const inline =
          e.tagName === "A" &&
          getComputedStyle(e).display === "inline" &&
          !!e.parentElement?.textContent?.trim().length &&
          e.parentElement!.textContent!.trim().length >
            (e.textContent?.trim().length ?? 0)
        return { i, w: r.width, h: r.height, inline }
      })
      .filter((t) => (t.w < 24 || t.h < 24) && !t.inline)
      .map((t) => t.i)
    return { total: targets.length, small }
  }, CONTROLS)
  if (!sweep.total) throw new Error("no interactive targets in the gallery")
  const small: { label: string; hitArea: string; exception: string | null }[] =
    []
  for (const i of sweep.small) {
    const m = await hitArea(page, `[data-scorecard-target="${i}"]`)
    if (m && m.min < 24)
      small.push({
        label: m.label,
        hitArea: m.hitArea,
        exception: m.spacingOk
          ? "spacing"
          : m.equivalent
            ? "equivalent control"
            : null,
      })
  }
  return {
    named,
    checked: sweep.total,
    undersized: small,
    failing: small.filter((t) => !t.exception),
  }
}

async function hitArea(page: Page, selector: string) {
  await center(page, selector)
  return page.evaluate(
    ([sel, controls]) => {
      const el = [...document.querySelectorAll<HTMLElement>(sel)].find(
        (e) => e.getClientRects().length > 0
      )
      if (!el) return null
      const extent = (t: Element) => {
        const r = t.getBoundingClientRect()
        let x0 = Infinity
        let y0 = Infinity
        let x1 = -Infinity
        let y1 = -Infinity
        for (let y = Math.floor(r.y - 24); y <= r.y + r.height + 24; y++)
          for (let x = Math.floor(r.x - 24); x <= r.x + r.width + 24; x++) {
            const hit = document.elementFromPoint(x + 0.5, y + 0.5)
            if (hit && (hit === t || t.contains(hit))) {
              x0 = Math.min(x0, x)
              y0 = Math.min(y0, y)
              x1 = Math.max(x1, x + 1)
              y1 = Math.max(y1, y + 1)
            }
          }
        return {
          w: Number.isFinite(x0) ? x1 - x0 : 0,
          h: Number.isFinite(y0) ? y1 - y0 : 0,
        }
      }
      const r = el.getBoundingClientRect()
      const { w, h } = extent(el)
      const cx = r.x + r.width / 2
      const cy = r.y + r.height / 2
      const related = (o: Element) =>
        o === el || el.contains(o) || o.contains(el)
      // 2.5.8 spacing exception: a 24px circle on the target's center may touch
      // no other target, nor the circle of another undersized target
      let spacingOk = true
      for (let a = 0; a < 360 && spacingOk; a += 15)
        for (const d of [6, 12]) {
          const hit = document.elementFromPoint(
            cx + d * Math.cos((a * Math.PI) / 180),
            cy + d * Math.sin((a * Math.PI) / 180)
          )
          const other = hit?.closest(controls)
          if (other && !related(other)) spacingOk = false
        }
      if (spacingOk)
        spacingOk = ![...document.querySelectorAll(controls)].some((o) => {
          if (related(o)) return false
          const b = o.getBoundingClientRect()
          if (Math.hypot(b.x + b.width / 2 - cx, b.y + b.height / 2 - cy) >= 24)
            return false
          const e = extent(o)
          const side = Math.min(e.w, e.h)
          return side > 0 && side < 24
        })
      const name = (e: Element) =>
        (e.getAttribute("aria-label") || e.textContent || "").trim()
      const label =
        `${el.closest("[data-slot]")?.getAttribute("data-slot") ?? el.tagName.toLowerCase()}: ` +
        name(el).slice(0, 24)
      // 2.5.8 equivalent exception: a keyboard-hidden copy of a full-size control
      const equivalent =
        el.tabIndex === -1 &&
        [...document.querySelectorAll("button, [role=button]")].some((o) => {
          const b = o.getBoundingClientRect()
          return (
            o !== el && name(o) === name(el) && b.width >= 24 && b.height >= 24
          )
        })
      return {
        equivalent,
        label,
        visible: `${Math.round(r.width)}x${Math.round(r.height)}`,
        hitArea: `${w}x${h}`,
        min: Math.min(w, h),
        spacingOk,
      }
    },
    [selector, CONTROLS] as const
  )
}

/** 4.1.2 and the other axe-core WCAG 2.2 A and AA rules on every page. */
async function axeSweep(browser: Browser, scheme: Scheme) {
  const routes = [GALLERY, ...CATALOG.map((c) => `/components/${c.slug}`)]
  const byRule: Record<
    string,
    {
      impact: string | null
      criteria: string[]
      nodes: number
      pages: string[]
      where: Record<string, number>
      example: string
    }
  > = {}
  const needsReview: Record<string, number> = {}
  let engine = ""
  let rules412 = 0
  let pages = 0
  const queue = [...routes]
  const worker = () =>
    withPage(browser, scheme, {}, async (page) => {
      for (;;) {
        const route = queue.shift()
        if (!route) break
        await check(`${scheme} axe ${route}`, async () => {
          await visit(page, route)
          const res = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .exclude("nextjs-portal")
            .analyze()
          engine = `${res.testEngine.name} ${res.testEngine.version}`
          pages++
          rules412 = Math.max(
            rules412,
            [
              ...res.passes,
              ...res.incomplete,
              ...res.violations,
              ...res.inapplicable,
            ].filter((r) => r.tags.includes("wcag412")).length
          )
          for (const v of res.incomplete)
            needsReview[v.id] = (needsReview[v.id] ?? 0) + v.nodes.length
          for (const v of res.violations) {
            const where = await page.evaluate(
              (targets) =>
                targets.map((t) => {
                  let el: Element | null = null
                  try {
                    el = document.querySelector(t)
                  } catch {
                    return "unknown"
                  }
                  if (!el) return "unknown"
                  if (el.closest("pre, figure code")) return "docs code block"
                  if (
                    el.querySelector(
                      ":disabled, [data-disabled], [aria-disabled=true]"
                    )
                  )
                    return "label of a disabled control (inactive, exempt)"
                  return el.closest("[data-slot]") ? "component" : "site chrome"
                }),
              v.nodes.map((n) => String(n.target[0]))
            )
            const rule = (byRule[v.id] ??= {
              impact: v.impact ?? null,
              criteria: v.tags.filter((t) => /^wcag\d{3,}$/.test(t)),
              nodes: 0,
              pages: [],
              where: {},
              example: `${v.nodes[0].html.slice(0, 120)} : ${(v.nodes[0].any[0] ?? v.nodes[0].all[0])?.message ?? ""}`,
            })
            rule.nodes += v.nodes.length
            rule.pages.push(route)
            for (const w of where) rule.where[w] = (rule.where[w] ?? 0) + 1
          }
        })
      }
    })
  await Promise.all([worker(), worker(), worker()])
  if (!rules412) report(`${scheme} axe`, "no wcag412 rule ran on any page")
  const rules = Object.values(byRule)
  return {
    engine,
    pages,
    violations: rules.reduce((n, r) => n + r.nodes, 0),
    wcag412RulesRun: rules412,
    wcag412Violations: rules
      .filter((r) => r.criteria.includes("wcag412"))
      .reduce((n, r) => n + r.nodes, 0),
    byRule,
    needsReview,
  }
}

async function main() {
  if (EVIDENCE) mkdirSync(EVIDENCE, { recursive: true })
  const browser = await chromium.launch({ channel: "chrome" })
  const out: Record<string, unknown> = {
    measuredAt: new Date().toISOString(),
    commit: COMMIT,
    browser: `Chrome ${browser.version()}`,
    viewport: `${VIEWPORT.width}x${VIEWPORT.height} at device scale 1`,
    base: BASE,
    errors,
  }

  try {
    if (run("tokens")) {
      log("token sweep")
      out.tokens = await withPage(browser, "light", {}, async (page) => {
        await visit(page, GALLERY)
        return check("tokens", () => tokenSweep(page))
      })
    }

    for (const scheme of SCHEMES) {
      const r: Record<string, unknown> = {}
      await withPage(browser, scheme, {}, async (page) => {
        await visit(page, GALLERY)
        r.pageSurface = hex(px(await viewport(page), 280, 600))
        if (run("states")) {
          log(scheme, "states")
          r.states = await stateContrast(page, scheme, "default")
        }
        if (run("overlays")) {
          log(scheme, "overlays")
          r.overlays = await overlayEdges(page, scheme)
        }
        if (run("fields")) {
          log(scheme, "fields")
          r.fields = await fieldEdges(page, scheme, "default")
        }
        if (run("targets") && scheme === "light") {
          log(scheme, "targets")
          r.targets = await check("light targets", () => targetSizes(page))
        }
        if (run("names") && scheme === "light") {
          log(scheme, "label in name")
          r.labelInName = await labelInName(page, [
            GALLERY,
            "/components/neu-calendar",
          ])
        }
        if (run("focus")) {
          log(scheme, "focus sweep")
          await visit(page, GALLERY)
          r.focus = await check(`${scheme} focus`, () =>
            focusSweep(page, scheme)
          )
        }
      })

      if (run("modes")) {
        for (const [mode, opts] of [
          ["contrast-more", { contrast: "more" }],
          ["forced-colors", { forcedColors: "active" }],
        ] as const) {
          log(scheme, mode)
          r[mode] = await withPage(browser, scheme, opts, async (page) => {
            await visit(page, GALLERY)
            return {
              fields: await fieldEdges(page, scheme, mode),
              states: await stateContrast(page, scheme, mode),
              ...(mode === "forced-colors" && {
                peers: await peerContrast(page, scheme, mode),
                note: "states are raw fill-vs-surround readings; under forced colors the selected-vs-unselected peers decide",
              }),
            }
          })
        }
      }

      if (run("motion")) {
        log(scheme, "motion")
        const probe = (reducedMotion: "no-preference" | "reduce") =>
          withPage(browser, scheme, { reducedMotion }, async (page) => {
            await visit(page, GALLERY)
            return motionProbe(page, `${scheme} ${reducedMotion}`)
          })
        const off = await probe("no-preference")
        const on = await probe("reduce")
        if (!Object.values(off.onInteraction).some((m) => m.length))
          report(
            `${scheme} motion`,
            "nothing moved without reduced motion, so the reduce run proves nothing"
          )
        r.motion = {
          "no-preference": off,
          reduce: on,
          removedUnderReduce: Object.keys(off.onInteraction).filter(
            (k) =>
              k in on.onInteraction &&
              off.onInteraction[k].length &&
              !on.onInteraction[k].length
          ),
          stillMovesUnderReduce: Object.fromEntries(
            Object.entries(on.onInteraction).filter(([, v]) => v.length)
          ),
          stillFadesUnderReduce: Object.fromEntries(
            Object.entries(on.fades).filter(([, v]) => v.length)
          ),
          ambientUnderReduce: on.ambient,
        }
      }

      if (run("axe")) {
        log(scheme, "axe")
        r.axe = await axeSweep(browser, scheme)
      }
      out[scheme] = r
    }
  } finally {
    await browser.close()
  }

  mkdirSync(path.dirname(flags.out), { recursive: true })
  writeFileSync(flags.out, JSON.stringify(out, null, 2) + "\n")
  log("wrote", flags.out)
  if (errors.length) process.exitCode = 1
}

await main()
