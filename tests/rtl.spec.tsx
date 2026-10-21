import { expect, test } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import { BreadcrumbSeparator } from "@/registry/neu/ui/neu/breadcrumb"
import { PaginationNext } from "@/registry/neu/ui/neu/pagination"
import { Switch } from "@/registry/neu/ui/neu/switch"

import { buildCss } from "./theme-css"

const sample = renderToStaticMarkup(
  <>
    <Switch defaultChecked />
    <PaginationNext href="#" />
    <BreadcrumbSeparator />
  </>
)

test.beforeEach(async ({ page }) => {
  const html = `<div dir="rtl"><div id="page">${sample}</div><div id="island" dir="ltr">${sample}</div></div>`
  await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
})

for (const [scope, sign] of [
  ["#page", -1],
  ["#island", 1],
] as const) {
  test(`${scope} inside dir="rtl" resolves direction ${sign}`, async ({
    page,
  }) => {
    const readings = await page.evaluate((scope) => {
      const el = (selector: string) =>
        document.querySelector(`${scope} ${selector}`)!
      const mirror = (selector: string) => {
        const style = getComputedStyle(el(selector))
        const turn = style.rotate === "none" ? 0 : parseFloat(style.rotate)
        const scaleX = style.scale === "none" ? 1 : parseFloat(style.scale)
        return Math.sign(Math.cos((turn * Math.PI) / 180) * scaleX)
      }
      return {
        dir: Number(
          getComputedStyle(el("[data-slot=switch]")).getPropertyValue(
            "--neu-dir"
          )
        ),
        thumb: Math.sign(
          parseFloat(getComputedStyle(el("[data-slot=switch-thumb]")).translate)
        ),
        nextIcon: mirror('[aria-label="Go to next page"] svg'),
        separator: mirror("[data-slot=breadcrumb-separator] svg"),
      }
    }, scope)

    expect(readings).toEqual({
      dir: sign,
      thumb: sign,
      nextIcon: sign,
      separator: sign,
    })
  })
}
