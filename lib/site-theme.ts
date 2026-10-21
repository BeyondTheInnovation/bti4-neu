export type Theme = {
  distance: number
  blur: number
  shade: number
  face: number
  angle: number
  radius: number
  alpha: number
  shadeLight: number | null
  shadeDark: number | null
  glint: number
  squircle: boolean
}

export type Scheme = "light" | "dark"

/** A visitor's theme: the token values plus a surface per color scheme
 * (null keeps that scheme's default). */
export type SiteTheme = {
  tokens: Theme
  surfaces: Record<Scheme, string | null>
}

/* Must equal the :root and .dark defaults in neu-theme.css, so an untouched
   playground shows the site exactly as it ships. */
export const DEFAULT_THEME: Theme = {
  distance: 12,
  blur: 24,
  shade: 0.1,
  face: 0.03,
  angle: 315,
  radius: 16,
  alpha: 0.55,
  shadeLight: null,
  shadeDark: null,
  glint: 0.25,
  squircle: false,
}
export const LIGHT_SURFACE = "#e2e5e8"
export const DARK_SURFACE = "#1a222b"

export const DEFAULT_SITE_THEME: SiteTheme = {
  tokens: DEFAULT_THEME,
  surfaces: { light: null, dark: null },
}

export const SITE_THEME_KEY = "neu-site-theme"

export function tokenPairs(t: Theme): [string, string][] {
  return [
    ["--neu-distance", `${t.distance}px`],
    ["--neu-blur", `${t.blur}px`],
    ["--neu-shade", String(t.shade)],
    ["--neu-face", String(Math.abs(t.face))],
    ["--neu-light-angle", `${t.angle}deg`],
    ["--neu-radius", `${t.radius}px`],
    ["--neu-alpha", String(t.alpha)],
    ["--neu-glint", String(t.glint)],
    ...(t.squircle ? [["--neu-corner", "squircle"] as [string, string]] : []),
    ...(t.shadeLight !== null
      ? [["--neu-shade-light", String(t.shadeLight)] as [string, string]]
      : []),
    ...(t.shadeDark !== null
      ? [["--neu-shade-dark", String(t.shadeDark)] as [string, string]]
      : []),
  ]
}

/**
 * The theme as CSS to paste after the neu-theme import. A custom light
 * surface on :root would also win in dark mode (same specificity, later in
 * the file), so any custom surface emits the .dark one too.
 */
export function themeCss(
  { tokens, surfaces }: SiteTheme,
  selectors = { root: ":root", dark: ".dark" }
) {
  const darkSurface =
    surfaces.light || surfaces.dark ? (surfaces.dark ?? DARK_SURFACE) : null
  return [
    `${selectors.root} {`,
    ...(surfaces.light ? [`  --neu-surface: ${surfaces.light};`] : []),
    ...tokenPairs(tokens).map(([k, v]) => `  ${k}: ${v};`),
    "}",
    ...(darkSurface
      ? ["", `${selectors.dark} {`, `  --neu-surface: ${darkSurface};`, "}"]
      : []),
  ].join("\n")
}

/* The site paints the saved theme with doubled :root so it outranks
   neu-theme.css and any route stylesheet appended after it. */
export const SITE_SELECTORS = { root: ":root:root", dark: ":root:root.dark" }

/**
 * Writes the saved theme CSS into a <style> in <head>, or removes it.
 * Serialised into the pre-paint script, so it must stay self-contained:
 * no imports, no closures, nothing newer than the browsers we support.
 */
export function paintSiteTheme(key: string) {
  let css: string | null = null
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null")
    css = saved && typeof saved.css === "string" ? saved.css : null
  } catch {}
  let style = document.getElementById(key)
  if (!css) {
    if (style) style.remove()
    return
  }
  if (!style) {
    style = document.createElement("style")
    style.id = key
    document.head.appendChild(style)
  }
  style.textContent = css
}
