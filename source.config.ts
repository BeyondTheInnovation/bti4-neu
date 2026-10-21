import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { CODE_THEMES } from "./lib/site"

export const docs = defineDocs({
  dir: "content/docs",
})

export default defineConfig({
  mdxOptions: { rehypeCodeOptions: { themes: CODE_THEMES } },
})
