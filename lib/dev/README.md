# Dev tools

## Ask Claude

Toggle with `Cmd/Ctrl + O`. Hover to highlight an element, click to select it,
type what should change, then press Enter (or **Copy prompt**). The clipboard
gets the source location, the element and your note, ready to paste into
Claude Code:

```
@registry/neu/ui/neu/button.tsx:52:5
<button class="inline-flex items-center justify-center">

Make the hover state darker
```

`Esc` clears the selection; a second `Esc` turns the tool off. The on/off state
persists in `localStorage`.

## How it works

Element sources come from `code-inspector-plugin`, wired into
`turbopack.rules` in `next.config.ts`. It stamps
`data-insp-path="file:line:column:tag"` on every JSX element (paths relative to
the git root), and the tool reads the nearest stamped ancestor of the clicked
element. Without the plugin it reports `source unknown`. A `next.config.ts`
change needs a dev server restart.

`DevTools` (`dev-tools.tsx`) is mounted in `app/layout.tsx`. It loads in
development, and in a deployed build only when `NEXT_PUBLIC_DEV_TOOLS=true` was
set at build time; `next.config.ts` reads it once and inlines the result as
`process.env.DEV_TOOLS` (staging only: it stamps source paths into the HTML).
Production builds include neither the tool nor the stamps.
