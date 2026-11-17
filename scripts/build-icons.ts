/**
 * Builds the favicon set: app/icon.svg, app/favicon.ico (16, 32, 48),
 * app/apple-icon.png and the manifest icons in public/icons/. Rerun it after
 * changing the mark, the palette in lib/og.tsx or DARK_SURFACE.
 *
 *   bun scripts/build-icons.ts
 *
 * The mark is a raised tile on the surface carrying Geist's lowercase n,
 * outlined from the geist package so no file needs the font. The 180px and
 * larger icons raise the tile with the site's soft shadow pair. Soft shadows
 * vanish at favicon sizes, so those draw the tile with a hard lit and shaded
 * edge and fit the n's stems and baseline to whole pixels: icon.svg on a 16
 * grid, which stays sharp at 16 and 32, the ICO's 32 and 48px frames on their
 * own grids, and its 16px frame drawn pixel by pixel.
 */
import { mkdir, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { openSync, type Font } from "fontkit"
import sharp from "sharp"

import { INK, SURFACE } from "@/lib/og"
import { DARK_SURFACE } from "@/lib/site-theme"

const root = fileURLToPath(new URL("..", import.meta.url))

const LIGHT = "#ffffff"
const SHADE = "#bcc1c7"

type Palette = { face: string; ink: string; light: string; shade: string }

/** The bevel's shade is darker than the soft shadow's, so the tile's edge holds on a white tab bar. */
const SMALL_LIGHT: Palette = {
  face: SURFACE,
  ink: INK,
  light: LIGHT,
  shade: "#9ea6af",
}
const SMALL_DARK: Palette = {
  face: DARK_SURFACE,
  ink: SURFACE,
  light: "#36424f",
  shade: "#0b0f13",
}

function geistN() {
  const font = openSync(
    `${root}node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf`
  ) as Font
  const [glyph] = font.glyphsForString("n")
  if (!glyph) throw new Error("Geist SemiBold has no n")
  return glyph.path
}

const N = geistN()

/** The n with its left stem at `x`, its baseline at `y`, `scale` grid units per font unit. */
function n(x: number, y: number, scale: number, className = "n") {
  const d = N.translate(-N.bbox.minX, 0).scale(scale, -scale).translate(x, y)
  return `<path class="${className}" d="${d.toSVG()}"/>`
}

/** The tile filling a `grid`-unit square: lit edge top left, shaded edge bottom right, `bevel` units wide. */
function bevelTile(grid: number, radius: number, bevel = 1) {
  return [
    `<rect class="s" width="${grid}" height="${grid}" rx="${radius}"/>`,
    `<rect class="l" width="${grid - bevel}" height="${grid - bevel}" rx="${radius - bevel / 2}"/>`,
    `<rect class="f" x="${bevel}" y="${bevel}" width="${grid - 2 * bevel}" height="${grid - 2 * bevel}" rx="${radius - bevel}"/>`,
  ].join("")
}

function classes({ face, ink, light, shade }: Palette) {
  return `.s{fill:${shade}}.l{fill:${light}}.f{fill:${face}}.n{fill:${ink}}`
}

function smallSvg(grid: number, body: string, style = classes(SMALL_LIGHT)) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${grid} ${grid}"><style>${style}</style>${body}</svg>`
}

/**
 * 16 grid: 2px stems 5px apart, x-height 8px, baseline on row 12. The n is
 * 7px wide on a 16px tile, so it cannot sit dead centre; it sits a pixel
 * right in light mode, where the white lit edge melts into the tab, and a
 * pixel left in dark mode, where the shaded edge does.
 */
function mark16() {
  const style = [
    classes(SMALL_LIGHT),
    ".nd{display:none}",
    `@media (prefers-color-scheme:dark){${classes(SMALL_DARK)}.n{display:none}.nd{display:inline;fill:${SMALL_DARK.ink}}}`,
  ].join("")
  return smallSvg(
    16,
    bevelTile(16, 3.5) + n(5, 12, 0.015) + n(4, 12, 0.015, "nd"),
    style
  )
}

/** 32 grid: 4px stems 10px apart, x-height 16px, baseline on row 24. */
function mark32() {
  return smallSvg(32, bevelTile(32, 7) + n(9, 24, 0.03))
}

/** 48 grid: 6px stems 15px apart, x-height 24px, baseline on row 36. */
function mark48() {
  return smallSvg(48, bevelTile(48, 10.5, 2) + n(14, 36, 0.045))
}

// One character per pixel: l lit edge, s shaded edge, f face, n ink, m a half-inked pixel where the arch meets each stem.
const PIXELS16 = [
  "..llllllllllll..",
  ".lffffffffffffs.",
  "lffffffffffffffs",
  "lffffffffffffffs",
  "lffffnmnnnmffffs",
  "lffffnnnfmnnfffs",
  "lffffnnfffnnfffs",
  "lffffnnfffnnfffs",
  "lffffnnfffnnfffs",
  "lffffnnfffnnfffs",
  "lffffnnfffnnfffs",
  "lffffnnfffnnfffs",
  "lffffffffffffffs",
  "lffffffffffffffs",
  ".lffffffffffffs.",
  "..ssssssssssss..",
]

/** The 16px frame drawn pixel by pixel, its n placed like the vector's light-mode n. */
function pixelMark16() {
  const fills: Record<string, string> = {
    l: SMALL_LIGHT.light,
    s: SMALL_LIGHT.shade,
    f: SMALL_LIGHT.face,
    n: SMALL_LIGHT.ink,
    m: "#7d858e",
  }
  const rects: string[] = []
  PIXELS16.forEach((row, y) => {
    for (const run of row.matchAll(/([lsfnm])\1*/g)) {
      rects.push(
        `<rect x="${run.index}" y="${y}" width="${run[0].length}" height="1" fill="${fills[run[1] ?? "f"]}"/>`
      )
    }
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">${rects.join("")}</svg>`
}

/** The soft mark on a 512 square: the tile raised off an opaque surface by the site's shadow pair. */
function softMark(inset = 1) {
  const size = 300
  const at = (512 - size) / 2
  const radius = 88
  const distance = 22
  const scale = 0.25
  const width = (N.bbox.maxX - N.bbox.minX) * scale
  const height = N.bbox.maxY * scale
  const tile = (fill: string, offset: number, blur: boolean) =>
    `<rect x="${at + offset}" y="${at + offset}" width="${size}" height="${size}" rx="${radius}" fill="${fill}"${blur ? ' filter="url(#b)"' : ""}/>`
  const body = [
    tile(SHADE, distance, true),
    tile(LIGHT, -distance, true),
    tile(SURFACE, 0, false),
    n(256 - width / 2, 256 + height / 2, scale),
  ].join("")
  const scaled =
    inset === 1
      ? body
      : `<g transform="translate(256 256) scale(${inset}) translate(-256 -256)">${body}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><style>.n{fill:${INK}}</style><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${distance}"/></filter></defs><rect width="512" height="512" fill="${SURFACE}"/>${scaled}</svg>`
}

function render(svg: string, size: number, grid: number) {
  return sharp(Buffer.from(svg), { density: (72 * size) / grid })
    .resize(size, size)
    .ensureAlpha()
    .png()
    .toBuffer()
}

/** The soft mark at `size`, without an alpha channel, as iOS and the manifest want. */
function renderSoft(svg: string, size: number) {
  return sharp(Buffer.from(svg), { density: (72 * size) / 512 })
    .resize(size, size)
    .removeAlpha()
    .png()
    .toBuffer()
}

/** An ICO holding each PNG as is, which every browser since IE 9 reads. */
function ico(images: { size: number; png: Buffer }[]) {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i
    header.writeUInt8(size % 256, entry)
    header.writeUInt8(size % 256, entry + 1)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(png.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...images.map(({ png }) => png)])
}

const soft = softMark()

await mkdir(`${root}public/icons`, { recursive: true })
await writeFile(`${root}app/icon.svg`, `${mark16()}\n`)
await writeFile(
  `${root}app/favicon.ico`,
  ico([
    { size: 16, png: await render(pixelMark16(), 16, 16) },
    { size: 32, png: await render(mark32(), 32, 32) },
    { size: 48, png: await render(mark48(), 48, 48) },
  ])
)
await writeFile(`${root}app/apple-icon.png`, await renderSoft(soft, 180))
await writeFile(`${root}public/icons/192.png`, await renderSoft(soft, 192))
await writeFile(`${root}public/icons/512.png`, await renderSoft(soft, 512))
await writeFile(
  `${root}public/icons/maskable-512.png`,
  await renderSoft(softMark(0.8), 512)
)
