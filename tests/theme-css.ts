import { readFile } from "node:fs/promises"
import path from "node:path"

import { compile } from "tailwindcss"

const root = path.resolve(__dirname, "..")

export async function buildCss(html: string) {
  const compiler = await compile(
    '@import "tailwindcss"; @import "tw-animate-css"; @import "./registry/neu/neu-theme/neu-theme.css";',
    {
      base: root,
      loadStylesheet: async (id, base) => {
        const file =
          id === "tailwindcss"
            ? require.resolve("tailwindcss/index.css")
            : id === "tw-animate-css"
              ? path.resolve(
                  root,
                  "node_modules/tw-animate-css/dist/tw-animate.css"
                )
              : path.resolve(base, id)
        return {
          path: file,
          base: path.dirname(file),
          content: await readFile(file, "utf8"),
        }
      },
    }
  )
  const classes = [...html.matchAll(/class="([^"]*)"/g)].flatMap(([, list]) =>
    list
      .replaceAll("&amp;", "&")
      .replaceAll("&gt;", ">")
      .replaceAll("&lt;", "<")
      .split(/\s+/)
  )
  return compiler.build(classes)
}
