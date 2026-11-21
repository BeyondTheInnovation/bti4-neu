import { expect, test, type Page } from "@playwright/test"
import { renderToStaticMarkup } from "react-dom/server"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/registry/neu/ui/neu/menubar"
import { PaginationLink } from "@/registry/neu/ui/neu/pagination"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/registry/neu/ui/neu/select"
import {
  SidebarMenuButton,
  SidebarProvider,
} from "@/registry/neu/ui/neu/sidebar"
import { Toggle } from "@/registry/neu/ui/neu/toggle"

import { buildCss } from "./theme-css"

async function mount(page: Page, node: React.ReactElement, extraCss = "") {
  const html = renderToStaticMarkup(<div className="p-10">{node}</div>)
  await page.setContent(
    `<style>${await buildCss(html)}${extraCss}</style>${html}`
  )
}

async function holdOn(page: Page, selector: string) {
  const box = (await page.locator(selector).boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
}

const slowPress = ":root { --neu-ease-press: 2s linear; }"

const keys = [
  { name: "raised", node: <Button id="key">Save</Button> },
  {
    name: "ghost",
    node: (
      <Button id="key" variant="ghost">
        Save
      </Button>
    ),
  },
  {
    name: "outline",
    node: (
      <Button id="key" variant="outline">
        Save
      </Button>
    ),
  },
  {
    name: "realism",
    node: (
      <Button id="key" surface="realism">
        Save
      </Button>
    ),
  },
  {
    name: "outline toggle",
    node: (
      <Toggle id="key" variant="outline">
        B
      </Toggle>
    ),
  },
]

for (const { name, node } of keys) {
  test(`the ${name} key eases into its pressed shadow instead of snapping`, async ({
    page,
  }) => {
    await mount(page, node, slowPress)
    const shadow = () =>
      page.locator("#key").evaluate((el) => getComputedStyle(el).boxShadow)
    const rest = await shadow()
    await holdOn(page, "#key")
    await page.waitForTimeout(300)
    const midway = await shadow()
    expect(midway).not.toBe(rest)
    await page.waitForTimeout(400)
    expect(await shadow()).not.toBe(midway)
  })
}

const labelled = [
  { name: "button", node: <Button id="key">Save</Button> },
  {
    name: "button link (asChild)",
    node: (
      <Button id="key" asChild>
        <a href="#">Save</a>
      </Button>
    ),
  },
  { name: "toggle", node: <Toggle id="key">Bold</Toggle> },
  {
    name: "select trigger",
    node: (
      <Select>
        <SelectTrigger id="key">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
      </Select>
    ),
  },
  {
    name: "pagination link",
    node: (
      <PaginationLink id="key" href="#">
        2
      </PaginationLink>
    ),
  },
  {
    name: "menubar trigger",
    node: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger id="key">File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    ),
  },
  {
    name: "sidebar link (asChild)",
    node: (
      <SidebarProvider>
        <SidebarMenuButton id="key" asChild>
          <a href="#">Home</a>
        </SidebarMenuButton>
      </SidebarProvider>
    ),
  },
]

for (const { name, node } of labelled) {
  test(`a pressed ${name} keeps its size while its label sinks toward the lamp`, async ({
    page,
  }) => {
    await mount(
      page,
      node,
      "*, *::before, *::after { transition: none !important; }"
    )
    const rect = () =>
      page.locator("#key").evaluate((el) => {
        const { width, height } = el.getBoundingClientRect()
        return { width, height }
      })
    const label = page.locator('#key > [data-slot="press-label"]')
    const restSize = await rect()

    await holdOn(page, "#key")
    expect(await rect()).toEqual(restSize)
    const [x, y, scale] = await label.evaluate((el) => {
      const s = getComputedStyle(el)
      const [tx, ty] = s.translate.split(" ").map(parseFloat)
      return [tx, ty, parseFloat(s.scale)]
    })
    expect(x).toBeLessThan(0)
    expect(y).toBeLessThan(0)
    expect(scale).toBeLessThan(1)

    await page.mouse.up()
    expect(
      await label.evaluate((el) => [
        getComputedStyle(el).translate,
        getComputedStyle(el).scale,
      ])
    ).toEqual(["none", "none"])
  })
}
