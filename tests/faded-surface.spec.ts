import { expect, test } from "@playwright/test"
import { buildCss } from "./theme-css"
import { countYellow } from "./pixels"

for (const opacity of [0.5, 0.99]) {
  test(`a .neu tile at opacity ${opacity} on white draws no yellow`, async ({
    page,
  }) => {
    const html = `<div style="background:#fff;padding:80px;width:300px"><div class="neu" style="width:120px;height:48px;opacity:${opacity}"></div></div>`
    await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
    expect(await countYellow(page, await page.screenshot())).toBe(0)
  })
}
