import type { Page } from "@playwright/test"

export async function pixels(page: Page, png: Buffer) {
  const base64 = png.toString("base64")
  const decoded = await page.evaluate(async (src) => {
    const image = new Image()
    image.src = `data:image/png;base64,${src}`
    await image.decode()
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!
    ctx.drawImage(image, 0, 0)
    return Array.from(ctx.getImageData(0, 0, image.width, image.height).data)
  }, base64)
  return Uint8ClampedArray.from(decoded)
}

export async function countYellow(page: Page, png: Buffer) {
  const data = await pixels(page, png)
  let count = 0
  for (let i = 0; i < data.length; i += 4)
    if (data[i] > 200 && data[i + 2] < 120) count++
  return count
}
