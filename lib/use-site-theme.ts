import { useSyncExternalStore } from "react"

import {
  DEFAULT_SITE_THEME,
  SITE_SELECTORS,
  SITE_THEME_KEY,
  type SiteTheme,
  paintSiteTheme,
  themeCss,
} from "@/lib/site-theme"

let current: SiteTheme | null | undefined
const listeners = new Set<() => void>()

function read(): SiteTheme | null {
  try {
    const saved = JSON.parse(localStorage.getItem(SITE_THEME_KEY) ?? "null")
    if (!saved?.theme) return null
    return {
      tokens: { ...DEFAULT_SITE_THEME.tokens, ...saved.theme.tokens },
      surfaces: { ...DEFAULT_SITE_THEME.surfaces, ...saved.theme.surfaces },
    }
  } catch {
    return null
  }
}

function emit(next: SiteTheme | null) {
  current = next
  for (const listener of listeners) listener()
}

/* Another tab saved a theme: the pre-paint script repaints the page, this
   keeps mounted controls in step. */
function onStorage(event: StorageEvent) {
  if (event.key === SITE_THEME_KEY || event.key === null) emit(read())
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot() {
  if (current === undefined) current = read()
  return current ?? DEFAULT_SITE_THEME
}

const getServerSnapshot = () => DEFAULT_SITE_THEME

/** The visitor's theme, saved in localStorage and painted on every page. */
export function useSiteTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function updateSiteTheme(update: (theme: SiteTheme) => SiteTheme) {
  const next = update(getSnapshot())
  localStorage.setItem(
    SITE_THEME_KEY,
    JSON.stringify({ theme: next, css: themeCss(next, SITE_SELECTORS) })
  )
  paintSiteTheme(SITE_THEME_KEY)
  emit(next)
}

export function resetSiteTheme() {
  localStorage.removeItem(SITE_THEME_KEY)
  paintSiteTheme(SITE_THEME_KEY)
  emit(null)
}
