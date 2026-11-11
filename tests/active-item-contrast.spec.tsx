import { expect, test, type Page } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import { Tabs, TabsList, TabsTrigger } from "@/registry/neu/ui/neu/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/neu/ui/neu/toggle-group"

import { pixels } from "./pixels"
import { buildCss } from "./theme-css"

const widgets = {
  tabs: (
    <Tabs defaultValue="b">
      <TabsList>
        <TabsTrigger value="a">One</TabsTrigger>
        <TabsTrigger value="b">Two</TabsTrigger>
        <TabsTrigger value="c">Three</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
  "toggle group": (
    <ToggleGroup type="single" defaultValue="b">
      <ToggleGroupItem value="a">One</ToggleGroupItem>
      <ToggleGroupItem value="b">Two</ToggleGroupItem>
      <ToggleGroupItem value="c">Three</ToggleGroupItem>
    </ToggleGroup>
  ),
}

const items = {
  tabs: "[data-slot=tabs-trigger]",
  "toggle group": "[data-slot=toggle-group-item]",
}

const trays = {
  tabs: "[data-slot=tabs-list]",
  "toggle group": "[data-slot=toggle-group]",
}

async function mount(page: Page, widget: React.ReactElement, dark: boolean) {
  const html = `<div class="${dark ? "dark " : ""}neu-ground" style="padding:24px;width:max-content">${renderToStaticMarkup(widget)}</div>`
  await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
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

async function look(page: Page, name: keyof typeof widgets) {
  const tray = page.locator(trays[name])
  const trayBox = (await tray.boundingBox())!
  const data = await pixels(page, await tray.screenshot())
  const width = Math.round(trayBox.width)
  const pick = (x: number, y: number) => {
    const i = (Math.round(y) * width + Math.round(x)) * 4
    return [data[i], data[i + 1], data[i + 2]]
  }
  const topEdge = async (nth: number) => {
    const box = (await page.locator(items[name]).nth(nth).boundingBox())!
    return pick(box.x - trayBox.x + box.width / 2, box.y - trayBox.y + 0.25)
  }
  return {
    tray: pick(2, trayBox.height / 2),
    active: await topEdge(1),
    inactive: await topEdge(0),
  }
}

for (const [name, widget] of Object.entries(widgets) as [
  keyof typeof widgets,
  React.ReactElement,
][]) {
  for (const dark of [false, true]) {
    test(`active ${name} item reaches 3:1 under more contrast, ${dark ? "dark" : "light"}`, async ({
      page,
    }) => {
      await page.emulateMedia({ contrast: "more" })
      await mount(page, widget, dark)
      const { tray, active, inactive } = await look(page, name)
      expect(ratio(active, tray)).toBeGreaterThanOrEqual(3)
      expect(ratio(active, inactive)).toBeGreaterThanOrEqual(3)
    })
  }
}

for (const [name, widget] of Object.entries(widgets) as [
  keyof typeof widgets,
  React.ReactElement,
][]) {
  test(`active ${name} item is distinct in forced colors`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" })
    await mount(page, widget, false)
    const style = (nth: number) =>
      page
        .locator(items[name])
        .nth(nth)
        .evaluate((el) => {
          const s = getComputedStyle(el)
          return { bg: s.backgroundColor, border: s.borderTopColor }
        })
    const active = await style(1)
    const inactive = await style(0)
    expect(active).not.toEqual(inactive)
  })
}
