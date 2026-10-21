import { expect, test } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/registry/neu/ui/neu/sidebar"

import { buildCss } from "./theme-css"

test.use({ viewport: { width: 1024, height: 600 } })

const sidebar = (open: boolean) =>
  renderToStaticMarkup(
    <SidebarProvider defaultOpen={open}>
      <Sidebar>
        <SidebarRail />
      </Sidebar>
      <SidebarInset />
    </SidebarProvider>
  )

/* The rail centers on the container's padding edge, 1px inside the
   border, so it sits at 255 rather than 256. */
const left = {
  expanded: {
    container: [0, 256],
    border: { left: "0px", right: "1px" },
    rail: [247, 263],
    inset: [256, 1024],
    cursor: "w-resize",
  },
  collapsed: {
    container: [-256, 0],
    border: { left: "0px", right: "1px" },
    rail: [-9, 7],
    inset: [0, 1024],
    cursor: "e-resize",
  },
}

const right = {
  expanded: {
    container: [768, 1024],
    border: { left: "1px", right: "0px" },
    rail: [761, 777],
    inset: [0, 768],
    cursor: "e-resize",
  },
  collapsed: {
    container: [1024, 1280],
    border: { left: "1px", right: "0px" },
    rail: [1017, 1033],
    inset: [0, 1024],
    cursor: "w-resize",
  },
}

for (const [where, wrap, edge] of [
  ['a dir="rtl" page', (html: string) => `<div dir="rtl">${html}</div>`, right],
  ['a dir="ltr" page', (html: string) => `<div dir="ltr">${html}</div>`, left],
  [
    'an ltr island on a dir="rtl" page',
    (html: string) => `<div dir="rtl"><div dir="ltr">${html}</div></div>`,
    left,
  ],
] as const) {
  for (const state of ["expanded", "collapsed"] as const) {
    test(`${state} side="left" sidebar on ${where} sits at the ${edge === right ? "right" : "left"} edge`, async ({
      page,
    }) => {
      const html = wrap(sidebar(state === "expanded"))
      await page.setContent(`<style>${await buildCss(html)}</style>${html}`)

      const readings = await page.evaluate(() => {
        const el = (slot: string) =>
          document.querySelector(`[data-slot=${slot}]`)!
        const span = (slot: string) => {
          const { left, right } = el(slot).getBoundingClientRect()
          return [left, right]
        }
        const container = getComputedStyle(el("sidebar-container"))
        return {
          container: span("sidebar-container"),
          border: {
            left: container.borderLeftWidth,
            right: container.borderRightWidth,
          },
          rail: span("sidebar-rail"),
          inset: span("sidebar-inset"),
          cursor: getComputedStyle(el("sidebar-rail")).cursor,
        }
      })

      expect(readings).toEqual(edge[state])
    })
  }
}
