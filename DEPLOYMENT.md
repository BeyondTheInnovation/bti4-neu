# Deployment

The site is a static Next.js export served by a Cloudflare Worker, `bti4-neu`, configured in `wrangler.jsonc`. The Worker has no script: Workers static assets serve `out/` directly.

- **Target**: Cloudflare Workers static assets, custom domain `neu.beyondtheinnovation.com`. Ids live on the BTI OS record for BTI4.
- **Watched ref**: Workers Builds builds `main` for production.
- **Build**: `bun install --frozen-lockfile && bun run build`. `output: "export"` in `next.config.ts` writes the site to `out/`, including `public/_headers`. Search is a static index at `/api/search` that the dialog downloads and queries in the browser.
- **Deploy**: Workers Builds runs `bunx wrangler deploy` after the build on `main`.
- **Health**: `GET /` returns 200, and `/r/registry.json` returns the registry as `application/json`.
- **Environment**: none. A `NEXT_PUBLIC_*` variable added later is baked into the export at build time.

## Build on Linux

Build the export on Linux (CI, Workers Builds or a container). On Windows, Next.js writes the per-segment prefetch files into nested folders instead of the dotted names the router requests, so client-side navigation falls back to full page loads.

## URL rules

`wrangler.jsonc` and `public/_headers` set them:

- `/page` serves `page.html`; a trailing slash redirects to the clean URL.
- An unknown path returns `404.html` with status 404.
- `/_next/static/*` is cached for a year as immutable; everything else is `no-cache` and revalidates by ETag.
- `/opengraph-image` and `/api/search` have no file extension, so `_headers` sets their content types.
- `public/_redirects` sends `/index`, `/index.html` and any `*.html` to the clean URL.
- Each docs page has its own share image at `/og/<slug>/image.png`.

## Local preview

```sh
bun run build
bun run start
```

`bun run dev` runs the Next.js dev server as before.
