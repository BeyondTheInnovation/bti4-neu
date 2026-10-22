# Neu

A neumorphic component library distributed as a shadcn registry, with a documentation and playground site built on the same components. It is for React and Tailwind projects that install components through the `shadcn` CLI. It is not an npm package.

## Stack

- Bun, Next.js 16 (App Router, Turbopack dev), React 19, TypeScript, Tailwind 4.
- shadcn CLI (`registry.json`, `shadcn build`) with Radix UI primitives.
- Fumadocs (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`) for docs and search.
- ESLint with `eslint-config-next`.

## Structure

- `registry.json`: the catalog of registry items; `registry/neu/` holds their source (`neu-theme`, `ui`, `hooks`, `examples`).
- `public/r/`: built registry JSON served as static files.
- `app/`: the site. `(docs)` serves `content/docs` from the root (`/`, `/components` gallery, `/components/<slug>`), beside `playground`, `inspiration` and `api/search`.
- `components/`: site-only components (shell, previews, example frame); `lib/catalog.ts` lists every component and `lib/examples.tsx` maps example names to code.
- `content/docs/`: MDX docs; one page per component under `components/`.
- `docs/`: `FOUNDATION.md` (shadow token rules), `STRUCTURE.md`, `assets/` (proof screenshots).

## Commands

- `bun install`, `bun run dev`.
- `bun run registry:build` regenerates `public/r/` from `registry.json`.
- `bun run typecheck` runs `tsc --noEmit`; it needs `.source/`, so run `bunx fumadocs-mdx` first on a fresh clone.
- `bun run test` runs the Playwright tests in `tests/` (RTL direction, contrast); install the browser once with `bunx playwright install chromium`.
- `bun run scorecard:measure` measures the WCAG scorecard in Google Chrome against a running dev server (`--base`, default `http://localhost:3000`) and writes `docs/assets/readme/wcag-scorecard.json`, the figures behind the README accessibility table.
- Before pushing: `bun run lint`, `bun run typecheck`, `bun run test` and `bun run build`. CI (`.github/workflows/ci.yml`) runs the same plus `registry:build` and fails if `public/r` is stale.

## Conventions

- Read `docs/FOUNDATION.md` before touching the shadow tokens; every component derives its shadows from the shared `--neu-*` variables.
- A new component needs a `registry.json` item, a `lib/catalog.ts` entry, an example mapped in `lib/examples.tsx`, and an MDX page listed in `content/docs/components/meta.json`. Internal primitives (`neu-knob`, `neu-sliding-key`, `neu-menu`) need only the registry item.
- The theme CSS exists twice: `registry/neu/neu-theme/neu-theme.css` and the `neu-theme` item's `css` field in `registry.json`. Change both together.

## Gotchas

- Next.js here may differ from your training data; read `node_modules/next/dist/docs/` before relying on an API.
- `public/r/` is build output that is tracked: run `bun run registry:build` and commit it with any registry change.
- `.source/` is fumadocs-mdx codegen and is ignored; it regenerates on `dev` and `build`.

## Deployment

`main` is the default branch. No `DEPLOYMENT.md` exists yet; hosting details live on the BTI OS record.

<!-- >>> bti-os-project (managed by BTI OS — refresh with `bti sync`; edit app/public/onboarding/TEAM.md in the bti-os repo, not here) >>> -->
<!-- bti-os-project: BTI4 · 1206ebf2685e · rendered 2026-09-28 -->

# BTI4 — Neumorphism UI Registry

This checkout is a Beyond The Innovation project and its code is `BTI4`. Tasks are `BTI4-<n>`; branches are `type/bti4-<n>-short-slug` and commits `BTI4-<n>: imperative description`, with no AI or tool attribution.

- **Status**: ongoing

Ops notes, domains and ids live on the BTI OS record, not here: `bti call projects.fetch id=BTI4 include_metadata=true`. How we work: https://os.beyondtheinnovation.com/onboarding/TEAM.md

<!-- <<< bti-os-project <<< -->
