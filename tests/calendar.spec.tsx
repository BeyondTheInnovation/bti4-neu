import { expect, test, type Page } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import { Calendar } from "@/registry/neu/ui/neu/calendar"

import { buildCss } from "./theme-css"
import { pixels } from "./pixels"

const month = new Date(2026, 4, 1)
const today = new Date(2026, 4, 12)

const single = (props = {}) => (
  <Calendar
    mode="single"
    defaultMonth={month}
    today={today}
    selected={new Date(2026, 4, 31)}
    {...props}
  />
)

const range = (
  <Calendar
    mode="range"
    defaultMonth={month}
    today={new Date(2026, 4, 20)}
    selected={{ from: new Date(2026, 4, 10), to: new Date(2026, 4, 14) }}
  />
)

async function mount(page: Page, dark: boolean) {
  const html = `<div class="${dark ? "dark " : ""}neu-ground" style="padding:24px;display:flex;gap:24px;width:max-content">${renderToStaticMarkup(single())}${renderToStaticMarkup(range)}</div>`
  await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
}

const day = (page: Page, n: number, index = 0) =>
  page.locator("button[data-day]", { hasText: new RegExp(`^${n}$`) }).nth(index)

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

async function look(page: Page, n: number, index = 0) {
  const data = await pixels(page, await day(page, n, index).screenshot())
  const band = [0, 0, 0]
  let count = 0
  for (let y = 4; y < 9; y++)
    for (let x = 6; x < 26; x++) {
      for (let k = 0; k < 3; k++) band[k] += data[(y * 32 + x) * 4 + k]
      count++
    }
  const row = (y: number) => {
    const sum = [0, 0, 0]
    for (let x = 8; x < 24; x++)
      for (let k = 0; k < 3; k++) sum[k] += data[(y * 32 + x) * 4 + k]
    return sum.map((v) => v / 16)
  }
  return {
    data,
    band: band.map((v) => v / count),
    rim: [1, 2, 3, 4, 5, 26, 27, 28, 29, 30].map(row),
  }
}

const worst = (a: number[][], b: number[][]) =>
  Math.min(...a.map((c, i) => ratio(c, b[i])))

for (const dark of [false, true]) {
  test(`selected day reaches 3:1 against unselected days under more contrast, ${dark ? "dark" : "light"}`, async ({
    page,
  }) => {
    await page.emulateMedia({ contrast: "more" })
    await mount(page, dark)
    const plain = await look(page, 15)
    for (const selected of [
      await look(page, 31),
      await look(page, 10, 1),
      await look(page, 14, 1),
    ])
      expect(worst(selected.rim, plain.rim)).toBeGreaterThanOrEqual(3)
  })
}

const differing = (a: Uint8ClampedArray, b: Uint8ClampedArray) =>
  a.reduce((n, v, i) => n + (Math.abs(v - b[i]) > 40 ? 1 : 0), 0)

test("selected, range and plain days are distinct in forced colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" })
  await mount(page, false)
  const plain = await look(page, 15)
  const single = await look(page, 31)
  const start = await look(page, 10, 1)
  const middle = await look(page, 12, 1)
  const end = await look(page, 14, 1)
  expect(ratio(single.band, plain.band)).toBeGreaterThanOrEqual(3)
  expect(ratio(start.band, plain.band)).toBeGreaterThanOrEqual(3)
  expect(ratio(end.band, plain.band)).toBeGreaterThanOrEqual(3)
  expect(differing(middle.data, plain.data)).toBeGreaterThan(20)
  expect(differing(middle.data, single.data)).toBeGreaterThan(20)
})
