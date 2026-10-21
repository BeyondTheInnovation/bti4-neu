import type * as React from "react"

import {
  DARK_SURFACE,
  LIGHT_SURFACE,
  type Theme,
  tokenPairs,
} from "@/lib/site-theme"

export type ModelName = "neu" | "neu-pressed" | "neu-realism"
export type ShapeName = ModelName | "neu-concave" | "neu-convex"

export type SetTheme = (patch: Partial<Theme>) => void

export const MAX_SHADE = 0.25
export const MAX_FACE = 0.12

export const MODELS: { cls: ModelName; label: string }[] = [
  { cls: "neu", label: "Raised" },
  { cls: "neu-pressed", label: "Pressed" },
  { cls: "neu-realism", label: "Realism" },
]

/* Theme face is signed in the playground only: below zero dishes in, above
   domes out. The token itself is a magnitude, so the sign picks the class. */
export function shapeOf(model: ModelName, face: number): ShapeName {
  if (model !== "neu" || face === 0) return model
  return face < 0 ? "neu-concave" : "neu-convex"
}

export const SHAPE_LABEL: Record<ShapeName, string> = {
  neu: "Raised",
  "neu-pressed": "Pressed",
  "neu-concave": "Concave",
  "neu-convex": "Convex",
  "neu-realism": "Realism",
}

export function curvatureText(face: number) {
  if (face === 0) return "flat"
  return `${face < 0 ? "concave" : "convex"} ${Math.abs(face).toFixed(3)}`
}

export const PALETTE = [
  { name: "Fog", hex: LIGHT_SURFACE },
  { name: "Paper", hex: "#f8f8f2" },
  { name: "Sand", hex: "#e8dfd1" },
  { name: "Blush", hex: "#efdcdc" },
  { name: "Sage", hex: "#d6e0d6" },
  { name: "Teal", hex: "#00a4ac" },
  { name: "Slate", hex: "#262c38" },
  { name: "Night", hex: DARK_SURFACE },
] as const

/* Instrument chrome keeps a fixed depth so an extreme theme cannot hide the
   controls that would fix it. Only the surface follows the user. Distance
   stays at the stock 12px so caps and lines inside keep their stock size;
   the depth ratio sinks the panels to 7px. */
export const CHROME_STYLE = {
  "--neu-distance": "12px",
  "--neu-blur": "24px",
  "--neu-depth": "0.58",
  "--neu-shade": "0.1",
  "--neu-shade-light": "0.1",
  "--neu-shade-dark": "0.1",
  "--neu-face": "0.03",
  "--neu-light-angle": "315deg",
  "--neu-radius": "20px",
  "--neu-alpha": "0.55",
  "--neu-glint": "0.4",
  "--neu-corner": "round",
} as React.CSSProperties

/* The live token set for an element nested inside the fixed chrome; depth
   resets so the chrome's ratio does not leak into the live specimen. */
export function liveStyle(t: Theme): React.CSSProperties {
  return {
    ...Object.fromEntries(tokenPairs(t)),
    "--neu-depth": "1",
    "--neu-shade-light": String(t.shadeLight ?? t.shade),
    "--neu-shade-dark": String(t.shadeDark ?? t.shade),
    "--neu-corner": t.squircle ? "squircle" : "round",
  } as React.CSSProperties
}
