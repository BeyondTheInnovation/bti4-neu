# neu

Neumorphic components for React and Tailwind v4, distributed as a shadcn
registry. The components keep the shadcn/ui APIs. One token, `--neu-surface`,
drives the shadows, faces, focus ring and text colors, and text contrast is
solved against the surface.

Docs, the components gallery and the playground:
[neu.beyondtheinnovation.com](https://neu.beyondtheinnovation.com).

## Install

Add the theme, then any component. Each component pulls the theme in through
its registry dependencies.

```bash
bunx --bun shadcn@latest add https://neu.beyondtheinnovation.com/r/neu-theme.json
bunx --bun shadcn@latest add https://neu.beyondtheinnovation.com/r/neu-button.json
```

Components install under `components/ui/neu/`, next to the stock shadcn
components. Put `.neu-ground` on a page or section wrapper so they sit on their
own surface. The [installation guide](https://neu.beyondtheinnovation.com/installation)
covers the rest.

The theme needs Chrome 119, Safari 16.4 or Firefox 128 (relative color syntax
and trigonometric functions in `calc()`).

## Develop

```bash
bun install
bun run dev
```

`registry.json` lists the registry items and `registry/neu/` holds their
source. `bun run registry:build` regenerates the served JSON in `public/r/`.
Structure, conventions and checks are in [AGENTS.md](AGENTS.md).
