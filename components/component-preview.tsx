import { readFile } from "node:fs/promises"
import path from "node:path"
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

import { ExampleFrame } from "@/components/example-frame"
import { catalogEntry } from "@/lib/catalog"
import { CODE_THEMES } from "@/lib/site"

// Inset, because the Tabs root clips overflow.
const PANEL_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fd-ring"

async function readExampleSource(name: string) {
  const file = path.join(process.cwd(), "registry/neu/examples", `${name}.tsx`)
  const source = await readFile(file, "utf8")
  return source.replaceAll("@/registry/neu/ui/neu/", "@/components/ui/neu/")
}

export async function ComponentPreview({ name }: { name: string }) {
  const code = await readExampleSource(name)
  const framed = catalogEntry(name.replace(/-demo$/, ""))?.framed

  return (
    <Tabs items={["Preview", "Code"]} className="not-prose neu-preview">
      <Tab value="Preview" className={`p-0 ${PANEL_FOCUS}`}>
        <div className="neu-ground rounded-b-xl">
          <ExampleFrame
            name={name}
            className={framed ? "rounded-b-xl" : "min-h-72 rounded-b-xl p-6"}
          />
        </div>
      </Tab>
      <Tab value="Code" className={PANEL_FOCUS}>
        <ServerCodeBlock code={code} lang="tsx" themes={CODE_THEMES} />
      </Tab>
    </Tabs>
  )
}
