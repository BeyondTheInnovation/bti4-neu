import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { ComponentGrid } from "@/components/component-gallery"
import { ComponentPreview } from "@/components/component-preview"

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ComponentGrid,
    ComponentPreview,
    ...components,
  } satisfies MDXComponents
}
