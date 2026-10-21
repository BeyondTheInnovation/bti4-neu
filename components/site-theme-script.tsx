import { SITE_THEME_KEY, paintSiteTheme } from "@/lib/site-theme"

const script = `(function (paint, key) {
  paint(key)
  addEventListener("storage", function (e) {
    if (e.key === key || e.key === null) paint(key)
  })
})(${paintSiteTheme}, ${JSON.stringify(SITE_THEME_KEY)})`

/** Paints the visitor's saved theme before first paint, and again when
 * another tab changes it. Render once, in the root layout's head. */
export function SiteThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
