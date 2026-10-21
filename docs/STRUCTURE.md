# Repo structure

Started from `shadcn-ui/registry-template` (Tailwind v4 variant) and converted to
Bun.

## File tree

```
registry.json            source of truth: every registry item, including the
                         theme CSS inlined under neu-theme's `css` field
components.json          shadcn consumer config for the site
                         (style: new-york, css: app/globals.css, aliases @/...)
source.config.ts         fumadocs-mdx collections (content/docs)
next.config.ts           createMDX wrap, code-inspector stamps for the dev tools
mdx-components.tsx       MDX components: ComponentGrid, ComponentPreview

app/
  layout.tsx             root layout: fonts, metadata, SiteThemeScript in head
  (docs)/                docs served from the root in the fumadocs notebook
                         layout: [[...slug]]/page.tsx renders content/docs;
                         unknown slugs 404 at routing (dynamicParams = false)
  playground/            theme generator: an isometric slab (scene, iso) with
                         instruments for each token; edits persist site-wide
  inspiration/page.tsx   reference sites the shadow grammar came from
  api/search/            fumadocs search route
  not-found.tsx          the one 404 page, prerendered
  opengraph-image.tsx, robots.ts, sitemap.ts
  globals.css            Tailwind entry, shadcn tokens, neu-theme.css, and the
                         fd-* palette tinted from --neu-surface
components/
  site-header.tsx        the one top bar (skip link, links, search, theme
                         switch); docs-header.tsx adds the drawer trigger and
                         the drawer's keyboard handling
  site-shell.tsx         header, main and footer for non-docs pages
  site-footer.tsx, site-provider.tsx (fumadocs RootProvider)
  search-dialog.tsx      fumadocs search dialog that returns focus on close
  site-theme-script.tsx  paints the visitor's saved playground theme before
                         first paint and on changes from other tabs
  component-gallery.tsx  <ComponentGrid category="..."/>: live tiles on
                         /components
  component-preview.tsx  <ComponentPreview name="..."/>: Preview/Code tabs,
                         code read from registry/neu/examples on disk
  example-frame.tsx      one example on a neu ground; contains fixed chrome
lib/
  catalog.ts             the component list: slug, title, category, example,
                         wide/framed flags. Drives the gallery and previews
  examples.tsx           example name -> component map
  site-theme.ts          theme model shared by server and client: defaults,
                         token pairs, CSS output, the pre-paint function
  use-site-theme.ts      useSiteTheme / updateSiteTheme / resetSiteTheme over
                         localStorage
  layout.shared.tsx      shared fumadocs options; links feed the mobile drawer
  source.ts              fumadocs loader, baseUrl /
  site.ts                SITE_URL, BTI_URL
  dev/                   dev-only tools (Ask Claude), off in production builds
  utils.ts               cn()
content/docs/            MDX. components/<slug>.mdx is frontmatter, preview,
                         Installation, Usage. components/meta.json orders the
                         sidebar with ---Category--- separators

registry/neu/            registry source files
  neu-theme/neu-theme.css  token foundation; mirrored into registry.json
  ui/neu/                components, installed to components/ui/neu/
  examples/              one demo per component (neu-<name>-demo.tsx)
  hooks/                 hooks shipped with items (use-mobile)

public/r/                build output, committed: registry.json plus one JSON
                         per item with file contents inlined. Never hand-edit;
                         regenerate with bun run registry:build

docs/                    FOUNDATION.md (shadow token rules), assets/,
                         this file
```

## Adding a component to the site

1. Source in `registry/neu/ui/neu/<name>.tsx`, example in
   `registry/neu/examples/neu-<name>-demo.tsx`, both registered in registry.json.
2. Map the example in `lib/examples.tsx` and add a `CATALOG` entry in
   `lib/catalog.ts` (`wide` for full-width tiles, `framed` for fixed chrome).
3. `content/docs/components/neu-<name>.mdx` with
   `<ComponentPreview name="neu-<name>-demo" />`, then add the slug to
   `components/meta.json` under its category.

Internal primitives that only other components use (`neu-knob`,
`neu-sliding-key`, `neu-menu`) get a registry item but no catalog entry.

## Registry pipeline

```
registry.json  ->  bun run registry:build (shadcn build)  ->  public/r/{name}.json
                                                              public/r/registry.json
                   Next serves public/ statically          ->  https://host/r/{name}.json
```

`shadcn build` reads each item's `files[].path`, inlines the file content into
`public/r/<name>.json`, and emits the flattened catalog. Consumers install with
`bunx shadcn add https://host/r/<item>.json`, or `@neu/<item>` once the namespace
is registered. Imports inside registry files must use `@/registry/...` paths; the
CLI rewrites them to the consumer's aliases on install.

The theme CSS lives twice: `neu-theme.css` (imported by the site) and the
`css` field of the `neu-theme` item (what consumers get). Change both together.

## Where new things go

Per the survey (8bitcn naming, 1st-pouf theme delivery, RetroUI cssVars):

- **Components**: `registry:ui` with `"target": "components/ui/neu/<name>.tsx"`,
  so installs land in a namespaced dir and never overwrite stock shadcn files.
  Same exported names and props as the shadcn counterpart wherever one exists.
- **Theme**: one `neu-theme` item (`registry:theme`) carrying the whole token
  foundation: `cssVars.light`/`dark` for the surface defaults and `css` for the
  `@property` registrations, shadow formulas, state variants and utilities.
  Every component lists it in `registryDependencies`, so it installs once.
- **Demos**: one `registry:example` per component. The gallery and the docs
  render the same files, so demos never drift from docs.
- **Preset themes later** (`neu-slate`, `neu-warm`, ...): `registry:style` items
  that only override the base tokens.

## Commands

```bash
bun install
bun run dev                                            # localhost:3000
bun run registry:build                                 # registry.json -> public/r
bunx shadcn@latest registry validate ./registry.json   # schema + files check
bun run lint
bun run build
```

Rebuild `public/r` and commit it with any registry source change; the served
JSON is whatever was last built, not what the source says.
