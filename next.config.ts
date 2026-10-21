import type { NextConfig } from "next"
import { codeInspectorPlugin } from "code-inspector-plugin"
import { createMDX } from "fumadocs-mdx/next"

const stampSources =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_TOOLS === "true"

type LoaderRules = Record<string, { loaders: { loader: string }[] }>

// Stamps `data-insp-path` (file:line:column:tag) on every JSX element for the
// Ask Claude dev tool. The OG image route stays out, since Satori renders its
// JSX to an image. Plain strings only: Turbopack serialises loader options, so
// a RegExp here fails the dev server.
const inspectorRules: LoaderRules = codeInspectorPlugin({
  bundler: "turbopack",
  dev: stampSources,
  hotKeys: false,
  showSwitch: false,
  hideConsole: true,
  server: "close",
  exclude: ["opengraph-image"],
})

// Only the stamping loader runs. The inject loader adds a client element as an
// extra child in whichever file compiles first, which breaks Radix parts that
// slot onto a single child, and the tool never uses that element.
const sourceStampRules = Object.fromEntries(
  Object.entries(inspectorRules).map(([glob, rule]) => [
    glob,
    {
      ...rule,
      loaders: rule.loaders.filter(
        ({ loader }) => !loader.endsWith("/inject-loader.js")
      ),
    },
  ])
)

const nextConfig: NextConfig = {
  agentRules: false,
  // Always defined, so the gate folds to a literal and prod drops the tools.
  env: { DEV_TOOLS: String(stampSources) },
  turbopack: {
    rules: sourceStampRules,
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
