import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { expect, test } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/neu/ui/neu/accordion"

import { buildCss } from "./theme-css"

test.use({ reducedMotion: "reduce" })

test("accordion content runs no animation when opened or closed", async ({
  page,
}) => {
  const html = renderToStaticMarkup(
    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>open</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>closed</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
  await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
  const names = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slot="accordion-content"]')].map(
      (el) => [
        el.getAttribute("data-state"),
        getComputedStyle(el).animationName,
      ]
    )
  )
  expect(names).toEqual([
    ["open", "none"],
    ["closed", "none"],
  ])
})

const uiDir = path.resolve(__dirname, "../registry/neu/ui/neu")
const entries = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .flatMap((file) =>
    [
      ...readFileSync(path.join(uiDir, file), "utf8").matchAll(
        /"([^"]*motion-reduce:[^"]*)"/g
      ),
    ].flatMap(([, classes]) =>
      [...classes.matchAll(/data-\[(\w+)(\^?)=([\w-]+)\]:animate-/g)].map(
        ([, attr, prefix, value]) => ({
          file,
          attr,
          value: prefix ? `${value}x` : value,
          classes,
        })
      )
    )
  )

for (const [i, e] of entries.entries()) {
  test(`${e.file} #${i} stays still under reduced motion in ${e.attr}=${e.value}`, async ({
    page,
  }) => {
    const html = `<div data-${e.attr}="${e.value}" class="${e.classes}"></div>`
    await page.setContent(`<style>${await buildCss(html)}</style>${html}`)
    expect(
      await page.evaluate(
        () => getComputedStyle(document.querySelector("div")!).animationName
      )
    ).toBe("none")
  })
}
