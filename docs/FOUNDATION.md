# Foundation, as shipped

What actually landed in `registry/neu/neu-theme/` and `registry.json`. This file is
the contract.

Verified end to end: `bun run registry:build` + `bunx shadcn registry validate` pass,
a scratch Next 15 + Tailwind v4 consumer received everything verbatim via
`shadcn add`, and the playground screenshots in
`docs/assets/foundation/` show the proof states.

## Tokens

Raw scalars are the whole public API. Everything visible derives from them.

| Token | Syntax | Initial | Role |
| --- | --- | --- | --- |
| `--neu-surface` | `<color>` | `oklch(0.92 0.005 250)` | The one input. Every shadow, face, text and ring color derives from it. Dark mode is `.dark { --neu-surface: oklch(0.25 0.02 250) }` and nothing else. |
| `--neu-distance` | `<length>` | `12px` | Shadow offset magnitude. |
| `--neu-blur` | `<length>` | `24px` | Shadow blur. Default 2x distance. |
| `--neu-depth` | `<number>` | `1` | A control's share of the global depth: a ratio, never a length. It multiplies distance and blur in every derived stack, so a control pinned at `0.25` still follows the global distance. |
| `--neu-shade` | `<number>` | `0.1` | Depth intensity, in oklch lightness units, before the self-scaling clamp. |
| `--neu-face` | `<number>` | `0.03` | Gradient contrast for concave/convex faces. |
| `--neu-light-angle` | `<angle>` | `315deg` | Lamp position, clockwise from top. 315deg = top-left. |
| `--neu-radius` | `<length>` | `16px` in `@property`, `1rem` on `:root` | Corner radius. `@property` initial-value must be computationally independent, so the registration says `16px`; the `:root` declaration restores `1rem` so it tracks root font size. |
| `--neu-alpha` | `<number>` | `0.55` | Shadow translucency. Kept below 1 so shadows tint whatever they fall on. |
| `--neu-dir` | `<number>` | `1` | RTL sign. `[dir='rtl']` sets `-1` and `[dir='ltr']` sets `1`, so the nearest `dir` wins and an ltr island inside an rtl page reads `1`. Directional motion and mirrored icons read it (switch travel, skeleton wave, chevrons); the shadow math does not. Use it instead of Tailwind's `rtl:` variant, whose `[dir="rtl"] *` branch still matches inside a nested `dir="ltr"`. |
| `--neu-resize-start` | plain | `w-resize` | Resize cursor pointing to the inline start. The same `[dir]` rules as `--neu-dir` swap it to `e-resize`, so the nearest `dir` wins. A cursor keyword cannot be flipped by a sign, and `:dir()` is no way out: Lightning CSS rewrites it to a `:lang()` list, which misses `lang="en" dir="rtl"`. The sidebar rail reads it. |
| `--neu-resize-end` | plain | `e-resize` | The mirror of `--neu-resize-start`. |
| `--neu-corner` | plain | `round` | `corner-shape` for every shape; `squircle` for superellipse corners. See the squircle amendment. |
| `--neu-shade-light` | unregistered | follows `--neu-shade` | Optional split intensity for the light half of the pair. Every high-end source ships asymmetric pairs; set this and `--neu-shade-dark` to join them. |
| `--neu-shade-dark` | unregistered | follows `--neu-shade` | Optional split intensity for the dark half. |
| `--neu-drop` | unregistered | derived | Override for `--_drop`, the cast shadow of handles and floating panels. The default is the surface hue at `l * 0.15`, its alpha solved so the shadow lands as deep as `--_dark` on the paper; being near black, it never glows over an accent, an image or a darker card. |
| `--neu-highlight` | `<number>` | `0.3` | Alpha multiplier for the light half of the raised pair, so the lit edge stays softer than the cast shadow. |
| `--neu-glint` | `<number>` | `0.25` | Strength multiplier for the 1px inset edge highlight that fades in on dark surfaces. `0` disables it. |
| `--neu-ring-width` | plain | `2px` | Focus outline width. Not registered; no need to animate. |
| `--neu-ring-offset` | plain | `2px` | Focus outline offset. |
| `--neu-ease-press` | plain | `100ms cubic-bezier(0.55, 0.055, 0.675, 0.19)` | Press-down transition: fast ease-in, like a spring-loaded key going down. Duration plus easing in one token. |
| `--neu-ease-release` | plain | `250ms cubic-bezier(0.215, 0.61, 0.355, 1)` | Release and hover transition: slower ease-out. |

Derived, readable but not meant as inputs:

| Token | Derivation | Where |
| --- | --- | --- |
| `--neu-text` | surface blended toward pure white or black in linear light, at the exact alpha that solves the WCAG formula for a 7.2 target; see the auto-contrast amendment | guaranteed contrast on any surface, clamping to pure white/black where 7.2 is unreachable |
| `--neu-text-muted` | same solve at a 4.6 target, opaque | visibly quieter, never below AA |
| `--neu-ring` | surface hue at the lightness solved for 3:1 against the surface, house lightness 0.55 when that already clears it | focus outlines, checked fills, accents |
| `--neu-knob-ink` | same solve at 4.5:1 | text and icons on the ring color and on caps |
| `--neu-destructive` | same solve at 4.5:1, hue 25 | errors; feeds shadcn's `--destructive` |
| `--neu-edge` | same solve at 3:1, surface chroma | hairlines that must be found by their edge |

`--neu-knob` is the one optional override among them: unset, a knob's face is the
surface; set it to retint the bead (the radio indicator sets it to `--neu-ring`).

All `--neu-*` scalars are registered with `@property` (typed, animatable, and a bad
consumer value falls back to the initial instead of invalidating the declaration),
with one deliberate exception: `--neu-shade-light` and `--neu-shade-dark` stay
unregistered. `@property` initial-value cannot reference `var()`, so registering
them would freeze a literal default and sever the live link to `--neu-shade`. The
derivations read them as `var(--neu-shade-dark, var(--neu-shade))`, which is what
keeps them tracking `--neu-shade` until a consumer sets them.
Private intermediates use `--_` prefixes and are unregistered on purpose: they are
recomputed per element and not part of the API.

## Derivation rules

Composite values never sit on `:root` (they would inherit pre-substituted). The
derivations live on the component selectors so per-element token overrides recompute:

```css
.neu, .neu-pressed, .neu-concave, .neu-convex, .neu-realism, .neu-text-emboss {
  --_dark:  oklch(from var(--neu-surface) calc(l - var(--neu-shade-dark, var(--neu-shade)) * clamp(1, 1.9 - l * 1.5, 1.6)) c h / var(--neu-alpha));
  --_light: oklch(from var(--neu-surface) calc(l + var(--neu-shade-light, var(--neu-shade)) * clamp(1, 1.9 - l * 1.5, 1.6)) c h / var(--neu-alpha));
  --_face-dark:  oklch(from var(--neu-surface) calc(l - var(--neu-face)) c h);
  --_face-light: oklch(from var(--neu-surface) calc(l + var(--neu-face)) c h);
  --_x: calc(var(--neu-distance) * var(--neu-depth) * var(--_lift, 1) * -1 * sin(var(--neu-light-angle)));
  --_y: calc(var(--neu-distance) * var(--neu-depth) * var(--_lift, 1) * cos(var(--neu-light-angle)));
  --_blur: calc(var(--neu-blur) * var(--neu-depth) * var(--_lift, 1));
  --_gx: calc(1px * sin(var(--neu-light-angle)));
  --_gy: calc(-1px * cos(var(--neu-light-angle)));
  --_glint: oklch(from var(--neu-surface) 0.97 c h / calc(clamp(0, (0.62 - l) * 3, 1) * 0.3 * var(--neu-glint)));
}

.neu, .neu-pressed, .neu-concave, .neu-convex, .neu-realism {
  border-radius: var(--neu-radius);
  background: var(--neu-surface);
  box-shadow:
    var(--_x) var(--_y) var(--_blur) var(--_dark),
    calc(var(--_x) * -1) calc(var(--_y) * -1) var(--_blur) var(--_light),
    inset var(--_gx) var(--_gy) 0 var(--_glint);
}
```

Four deliberate mechanisms in there:

1. **Self-scaling shade clamp.** `clamp(1, 1.9 - l * 1.5, 1.6)` multiplies
   `--neu-shade` inline. Light surfaces (l near 0.9) get factor ~1, dark surfaces
   (l near 0.25) get the 1.6 cap, so depth stays legible in dark mode without a
   second token. It has to be inline: `l` only exists inside the relative-color
   context, so this cannot be a standalone property.
2. **Trig light source.** `x = -d * sin(a)`, `y = d * cos(a)`. The angle is the lamp
   position measured clockwise from top; the dark shadow lands opposite it.
   Verified numerically at `135deg`: dark pair at `(-x, -y)` top-left, opposite the
   bottom-right lamp.
3. **`--_lift` multiplier.** Unset defaults to 1. `:active` on `.neu-active-sink`
   sets 0.75 and flips the pair inset. State changes are one number, not a second
   shadow stack. Hover never touches the multiplier: shadow or glint changes on
   hover read as a light source moving, which breaks the neumorphic illusion, so
   hover feedback is a flat bg tint only.
4. **Glint edge.** A third layer appended to every stack, never a swapped stack:
   a 1px inset highlight on the edge facing the lamp (`--_gx`/`--_gy` are the
   1px-normalized toward-lamp offsets). Its alpha is
   `clamp(0, (0.62 - l) * 3, 1) * 0.3 * var(--neu-glint)`, so it computes to 0 on
   light surfaces (stacks stay byte-identical to the pre-glint build) and ramps in
   as surface lightness drops below 0.62. Every good dark implementation in the
   research sells depth with near-black drops plus a lit top edge, not lightened
   shadows; this is that edge. Inset stacks (`.neu-pressed`, `.neu-active-sink`)
   flip the glint to the opposite edge, matching motion-gpu's pressed nuance.

Shapes on top of that base:

| Class | Difference |
| --- | --- |
| `.neu` | base raised pair |
| `.neu-pressed` | same pair, `inset`, glint flipped to the far edge |
| `.neu-concave` | `background: linear-gradient(var(--neu-light-angle), var(--_face-light), var(--_face-dark))` |
| `.neu-convex` | stop order flipped: `(angle, face-dark, face-light)` |
| `.neu-ground` | background + content tokens only, no shadow; put it on the page wrapper so nested surfaces sit on the right color |
| `.neu-realism` | opt-in five-layer dark ramp replacing the raised stack, see below |
| `.neu-text-emboss` | text variant of the pair, see below |

### Realism ramp (`.neu-realism`)

Opt-in class modeled on spasoje.dev's 6-layer stack. Five dark layers with
offsets stepping 0.08 / 0.16 / 0.3 / 0.55 / 1 of `--_x`/`--_y` (near-doubling,
like spasoje's x1.9 growth), blur scaling with them, negative spread keeping each
layer tucked, and alpha decaying toward the widest layer. The big outer light
shadow is dropped on purpose: at this fidelity the light half reads as glow, so
it migrates into two always-on 1px edge insets (light toward the lamp, dark away),
which is exactly what the researched implementations do. Everything still derives
from the same tokens and `--_lift`, so hover-lift scales the whole ramp and
active-sink still wins by specificity and sinks it to the standard inset pair.
It replaces the raised stack rather than appending to it, which is allowed
because it is a shape variant chosen at authoring time, not a state change; the
append-only rule in the contract below is about states.

### Text emboss (`.neu-text-emboss`)

The Kuhn technique: letter color = surface color, then the same shadow pair as
`text-shadow`, light half toward the lamp, dark half away. Derives from the same
`--_dark`/`--_light`/`--_x`/`--_y`, so split shade and light angle apply to type
too. Shadow scale should follow type scale: the defaults are tuned for
container-sized elements, so display text usually wants a local override like
`--neu-distance: 5px; --neu-blur: 8px; --neu-alpha: 1`, which per-element
recomputation makes a one-liner.

### Depth presets

Named personality bundles that only retune raw tokens, modeled on arlan's preset
tuples. Apply to a wrapper (tokens inherit) or an element:

| Class | distance | blur | shade | face | extras |
| --- | --- | --- | --- | --- | --- |
| `.neu-preset-flat` | 5px | 10px | 0.05 | 0.015 | |
| `.neu-preset-soft` | 9px | 22px | 0.08 | 0.025 | |
| `.neu-preset-deep` | 16px | 30px | 0.13 | 0.045 | |
| `.neu-preset-dramatic` | 22px | 36px | split: light 0.2, dark 0.15 | 0.06 | alpha 0.7 |

Dramatic runs the highlight hotter than the shadow, the asymmetry every high-end
source ships. Because presets are just token declarations, they compose with any
shape and with `.neu-realism`.

### Deviation from the bake-off's change #2 (deliberate)

Bakeoff kept `--neu-angle: 145deg` with `gradient(angle, dark, light)`. That is
internally inconsistent with its own trig formula: with `x = -d sin(a)`,
`y = d cos(a)`, the angle is the lamp position, and `145deg` puts the lamp
bottom-right, not the canonical top-left. Shipped instead:

- default `--neu-light-angle: 315deg` (lamp top-left, dark shadow bottom-right)
- concave = `gradient(angle, face-light, face-dark)`, convex flipped

so "concave = dark toward the lamp" actually holds. A CSS gradient's last stop sits
at the direction the angle points, which is the lamp side. Verified computed at
`135deg`: concave resolves to `linear-gradient(135deg, oklch(0.75...), oklch(0.55...))`,
lighter first, darker toward the lamp.

## State, focus, a11y contract

Every future `neu-*` component follows this. No exceptions without updating this file.

- **Depth is state.** Raised = idle/actionable, inset = active/selected/editable.
  `--_lift` is the only mechanism for hover/press depth; do not add ad hoc shadow
  stacks.
- **State = append a layer, never swap the stack.** The glint is the model: a new
  visual channel arrives as one more layer in the existing stacks (with alpha 0
  where it does not apply), not as a parallel stack that states switch between.
  `.neu-realism` replacing the raised stack is not an exception because it is a
  shape chosen at authoring time, not a state.
- **Focus is never depth.** Keyboard focus must survive any surface color and any
  slider extreme, so it is an outline, not a shadow:

  ```css
  :where(.neu, .neu-pressed, .neu-concave, .neu-convex):focus-visible {
    outline: var(--neu-ring-width) solid var(--neu-ring);
    outline-offset: var(--neu-ring-offset);
  }
  ```

  `:where()` keeps specificity at the pseudo-class level so components can restyle
  the ring without fighting the theme. Never write `outline: none` on a neu element.
- **Content color ships with the surface.** `.neu-ground` and the shapes set
  `color: var(--neu-text)`; muted text is `var(--neu-text-muted)`. Components never
  hardcode text colors.
- **Contrast fallbacks.** `@media (prefers-contrast: more)` adds a
  `1px solid var(--neu-text)` border to all shadowed shapes; `@media (forced-colors:
  active)` adds `1px solid ButtonText` (shadows are stripped in forced colors, the
  border keeps the boundary). New components with their own hit areas need the same
  two blocks.
- **Transitions** are opt-in via `.neu-active-sink` / `.neu-state-sink` and
  asymmetric on purpose, like a spring-loaded key: the resting rule carries
  `box-shadow var(--neu-ease-release)` (250ms ease-out) and `:active` overrides to
  `var(--neu-ease-press)` (100ms ease-in), so pressing is fast and settling is
  slow. CSS picks the transition from the state being entered, which is what makes
  two declarations enough. `@media (prefers-reduced-motion: reduce)` sets
  `transition: none` on both classes and their state selectors.

## Distribution shape

`neu-theme` is a `registry:theme` item with **no files**. Everything travels in
`registry.json` itself:

- `cssVars.light` / `cssVars.dark` carry only `neu-surface`. The shadcn CLI writes
  them into `:root` / `.dark` and auto-mirrors a `--color-neu-surface` into
  `@theme inline`, so `bg-neu-surface` works as a Tailwind utility for free.
- The `css` field carries, as JSON, every `@property` block, the `:root` scalars,
  `[dir='rtl']` and `[dir='ltr']`, the whole `@layer components` block, and both
  `@media` fallbacks.
  `shadcn add` appends it to the consumer's `globals.css` verbatim (confirmed
  against a scratch consumer; nothing was rewritten or dropped).
- Non-color scalars go through `css` `:root`, not `cssVars`, to avoid useless
  `@theme` color mirrors for lengths and numbers.

`registry/neu/neu-theme/neu-theme.css` is the same CSS as a real file, imported by
this repo's `app/globals.css` so the playground dogfoods exactly what consumers get.
**The registry.json `css` field is a mirror of that file. Edit both or ship a
divergence.**

The classes live in `@layer components`, so Tailwind utilities on the same element
win by layer order, and the Tailwind v4 `--tw-shadow` `@property` trap is avoided by
using plain `box-shadow` (never the `shadow-*` utilities inside neu classes).

Consumer install:

```bash
bunx shadcn@latest add https://<host>/r/neu-theme.json
```

Browser floor is relative color syntax + `sin()`/`cos()` in `calc()`: Chrome 119+,
Safari 16.4+, Firefox 128+.

## Proof states

Screenshots in `docs/assets/foundation/`:

| File | State | Shows |
| --- | --- | --- |
| `playground-light.png` | defaults | canonical top-left lamp, four shapes, chrome dogfooding the tokens |
| `playground-dark.png` | `.dark` toggle | one-token dark mode, clamp keeping depth legible |
| `playground-teal.png` | surface `#00a4ac` | hue-preserving derivation, no chalky gray overlays |
| `playground-extreme.png` | angle 135deg, high alpha, teal | light source rotation, gradient orientation following the lamp |
| `playground-v2-light.png` | defaults + advanced panel open | realism tile, text emboss sample, depth preset chips, split shade / glint controls |
| `playground-v2-dark.png` | same with `.dark` | glint edges on every raised surface, emboss and realism holding up on the dark ramp |

## Amendments (components pilot)

Contract gaps found while building `neu-button`, `neu-card`, `neu-checkbox`.
Each is now part of the contract.

- **`.neu-state-sink` joins the transition classes.** `:active` cannot express
  "stays pressed": a checked key must hold its sunken depth after release. The
  theme now owns attribute-driven sinking so components never hand-write a
  second shadow stack. Selectors covered: `[data-state="checked"]`,
  `[data-state="on"]`, `[data-state="open"]`, `[aria-pressed="true"]`,
  `[aria-current="page"]`. They
  share the `:active` declarations, so a checked key holds `--_lift: 0.75`.
  Reduced-motion covers them.
- **Ban on `shadow-*`, `ring-*` and `transition-*` utilities on neu elements.**
  Tailwind v4 implements ring and shadow as `box-shadow` from the utilities
  layer, which wins over `@layer components` and silently deletes the neu
  stack; `transition-*` clobbers the asymmetric easing. Focus and invalid
  states use `outline` utilities instead (`aria-invalid:outline-2 ...`).
- **Control-scale retune.** Small controls set `--neu-depth` locally (fields
  `[--neu-depth:0.33]`, checkbox and radio wells `0.25`), a ratio of the
  global distance, so the global depth still reaches them. A pinned length
  would freeze them. Caps (`.neu-cap-lift*`, `.neu-groove`) scale by
  `--neu-distance / 12` and ignore `--neu-depth`, so one cap reads the same
  in every tray. Floor for any interactive key is 26px; below it the ramp has
  no flank and the raised read collapses.
- **Flat-until-pressed via alpha.** Ghost/outline variants set `[--neu-alpha:0]`
  and restore with `active:[--neu-alpha:inherit]` and the state selectors
  (inherit, not a literal, so a consumer's cascade value survives). The stack
  itself never changes. Hover gets only a bg tint
  (`hover:bg-[color-mix(in_oklab,var(--neu-text)_6%,transparent)]`): hover-driven
  shadow or glint fades are off-grammar.
- **Engraved lines.** `.neu-line` (separator) is a pill `--neu-distance / 6`
  thick (2px at the default, clamped to 1px to 4px), sized by the theme: a blended
  gradient, dark crease over a lit edge at 0.3 alpha, both derived from
  `--neu-surface` with the same shade clamp as the shadow pair. Fully rounded
  caps keep the ends smooth; a square-ended, hard-stop
  crease read as pixelated and its lit band too bright. `.neu-line-b` (table
  rows, accordion items) and `.neu-line-t` (table footer) paint the same
  gradient as a no-repeat strip of the same thickness on the container edge, where
  edge-to-edge ends are correct; suppress it on a last child with
  `[background-image:none]`, not border or shadow resets. One element either way; the old 2px
  pressed-pair groove read as two stacked bars.
- **Same-registry `registryDependencies` must be absolute URLs.** The CLI
  resolves `./item.json` against the consumer's cwd (`path.resolve` in
  `shadcn` 4.19.0), not the parent item's URL, so relative refs 404 for real
  consumers. `registry.json` writes `https://<homepage>/r/<item>.json`; when
  the production host changes, these URLs change with it.

## Amendment: auto-contrast text derivation

The original `--neu-text` derivation was a hard lightness flip at surface
l 0.68 with a doubled-chroma tint, and `--neu-text-muted` was the text color
at alpha 0.55. Two failure modes: surfaces near the flip point could land
under 3:1 (a surface at l 0.67 got near-white text at about 2.8:1), and the
translucent muted token both diluted its own contrast and broke the "tokens
are plain opaque colors" assumption that component `color-mix()` tints rely
on.

Both tokens now derive via the CSS-only WCAG solve from Devon Govett's
"Automatic transparent foreground" pen
(https://codepen.io/devongovett/pen/01a01b37-313f-72d7-849a-147f6126ad94),
adapted to the `--neu-*` namespace:

- Relative luminance is computed from the surface inside a
  `color(from var(--neu-surface) srgb-linear ...)` context. The `--_luma`
  intermediate is deliberately written without `calc()` so its `r g b`
  identifiers resolve only at substitution time inside that context.
- `--_flip` snaps to 1 below luminance 0.1791 (the point where black and
  white tie) and 0 above it, choosing white or black text.
- The WCAG ratio formula is solved for the minimum blend alpha that hits the
  target, then the blend is performed manually in linear light so the result
  is an opaque plain color. Real transparency would composite in gamma space
  at paint time and throw off the math, and components need opaque tokens to
  `color-mix()` from.

Targets, chosen and shipped:

- `--neu-text`: solver target **7.2**, so rendered 8-bit colors still measure
  at least 7.0 (AAA body text) after quantization.
- `--neu-text-muted`: solver target **4.6**, rendering at least 4.5 (AA).
  Muted is now quieter via lower contrast, not via alpha, and stays opaque.

Floor behavior: on surfaces where a target is unreachable (mid grays, and
saturated mid tones like the teal preset), the solved alpha clamps to 1 and
the token becomes pure white or pure black, which is the maximum contrast
that surface can support. This is the graceful floor, not a failure.

Measured with Playwright against the playground (rendered 8-bit colors,
ratios per the WCAG formula). `tests/contrast.spec.ts` re-measures every
row on each CI run:

| Surface | `--neu-text` | ratio | `--neu-text-muted` | ratio |
| --- | --- | --- | --- | --- |
| `oklch(0.97 0.005 250)` very light | near-black gray | 7.17 | dark gray | 4.61 |
| `oklch(0.15 0.02 250)` very dark | light gray | 7.17 | mid gray | 4.58 |
| `oklch(0.55 0.005 250)` mid, worst case | pure white (clamp) | 4.84, the maximum possible | near-white | 4.60 |
| `#00a4ac` teal | pure black (clamp) | 6.91, the maximum possible | near-black teal | 4.58 |

Proof screenshots: `docs/assets/foundation/contrast-{light,dark,mid,hue}.png`
and `contrast-components-{light,dark}.png` (components demo, no regressions).

Notes and consequences:

- The dark-mode story is unchanged and simpler than it looks: `.dark` still
  only swaps `--neu-surface`, and the derivation flips sides on its own at
  the luminance threshold. No dark override for text exists or is needed.
- The old hue tint (`calc(c * 2)`) is gone as a mechanism; hue now survives
  as the unblended remainder of the surface in the mix, which fades toward
  pure white/black exactly when contrast demands it.
- `.neu-text-emboss` is exempt by design: its letters are surface-colored and
  read through the shadow pair, so it is decorative, not body text.
- `--neu-ring` was a fixed mid-lightness derivation when this amendment
  landed. It is now solved for 3:1 against the surface (see Tokens).
- Browser floor is unchanged: relative color syntax with math functions,
  Chrome 119+, Safari 16.4+, Firefox 128+.

## Amendment: squircle corners (2026-08-25)

`--neu-corner` (default `round`) feeds `corner-shape: var(--neu-corner)`,
declared alongside every `border-radius` in the theme. Set it to `squircle`
for superellipse corners. The
property is new (Chrome 139+); unsupported browsers drop the declaration and
render normal round corners, so no fallback logic is needed. Adoption:
https://caniuse.com/mdn-css_properties_corner-shape_squircle

## Amendment: field edges, curvature and the rise

- **Tonal field edge.** `.neu-field` draws `--neu-edge` mixed 30% into the
  surface (about 1.4:1), not the full 3:1 line. Full-contrast lines boxed
  every field and read as flat UI, so this knowingly trades WCAG 1.4.11 for
  the material. `prefers-contrast: more` and forced colors still draw a
  full-contrast border on every shape.
- **Curvature reaches every control.** Wells (inputs, textarea, OTP slots,
  the command input, radio and checkbox wells, tab, toggle-group, slider and
  progress tracks) carry `.neu-concave`; raised keys (button default,
  secondary and destructive through `surface="auto"`, select trigger, toggle,
  pagination steps) carry `.neu-convex`. A convex key that sinks turns its
  face over. `--neu-face` is a magnitude, so no value turns a well into a dome.
- **Rise, not zoom.** `.neu-rise` reveals a part by fading it in while its
  shadow grows from none (opacity 160ms, shadow 280ms) and sinks it in 140ms.
  The radio cap and checkbox tick stay mounted so the old one sinks while the
  new one rises; nothing scales.
- **Glyph lift.** `.neu-glyph-lift` floats a glyph (the checkbox tick) over
  its well with a contact and a cast `--_drop`, no light, like a handle or a
  dialog. A thin stroke covers little area, so the alpha has a floor (0.35
  contact, 0.18 cast) or the drop vanishes on light surfaces.
