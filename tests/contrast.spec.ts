import { expect, test } from "@playwright/test"

import { buildCss } from "./theme-css"

const surfaces = [
  {
    name: "very light",
    surface: "oklch(0.97 0.005 250)",
    text: 7.17,
    muted: 4.61,
  },
  {
    name: "very dark",
    surface: "oklch(0.15 0.02 250)",
    text: 7.17,
    muted: 4.58,
  },
  {
    name: "mid",
    surface: "oklch(0.55 0.005 250)",
    text: 4.84,
    muted: 4.6,
    possible: 4.85,
  },
  { name: "teal", surface: "#00a4ac", text: 6.91, muted: 4.58, possible: 6.92 },
]

test.beforeEach(async ({ page }) => {
  const html = surfaces
    .map(
      (s, i) =>
        `<div id="s${i}" class="neu-ground" style="--neu-surface:${s.surface}"><span id="t${i}">text</span><span id="m${i}" style="color:var(--neu-text-muted)">muted</span></div>`
    )
    .join("")
  await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
})

for (const [i, s] of surfaces.entries()) {
  test(`contrast on ${s.name} surface matches FOUNDATION.md`, async ({
    page,
  }) => {
    const ratios = await page.evaluate((i) => {
      const rgb = (css: string) => {
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!
        ctx.fillStyle = css
        ctx.fillRect(0, 0, 1, 1)
        return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)]
      }
      const luminance = (c: number[]) => {
        const [r, g, b] = c.map((v) => {
          const x = v / 255
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const ratio = (a: number[], b: number[]) => {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
        return (hi + 0.05) / (lo + 0.05)
      }
      const color = (id: string) =>
        rgb(getComputedStyle(document.getElementById(id)!).color)
      const bg = rgb(
        getComputedStyle(document.getElementById(`s${i}`)!).backgroundColor
      )
      return {
        text: ratio(color(`t${i}`), bg),
        muted: ratio(color(`m${i}`), bg),
        possible: Math.max(ratio([255, 255, 255], bg), ratio([0, 0, 0], bg)),
      }
    }, i)

    expect(ratios.text).toBeCloseTo(s.text, 1)
    expect(ratios.muted).toBeCloseTo(s.muted, 1)
    if (s.possible) expect(ratios.possible).toBeCloseTo(s.possible, 1)
    else expect(ratios.text).toBeGreaterThanOrEqual(7)
    expect(ratios.muted).toBeGreaterThanOrEqual(4.5)
  })
}
