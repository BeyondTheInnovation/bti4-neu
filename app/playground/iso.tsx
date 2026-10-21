"use client"

import * as React from "react"

import { type Swatches, oklchToRgb, rgbToHex } from "./color"
import type { ModelName } from "./theme"

const COS = Math.cos(Math.PI / 6)
const SIN = 0.5
export const ISO = `matrix(${COS.toFixed(6)} ${SIN} ${(-COS).toFixed(6)} ${SIN} 0 0)`

export const f = (v: number) => Math.round(v * 100) / 100

export type V2 = [number, number]
export type Lamp = { x: number; y: number; z: number }

/* World x runs down-right, y down-left, z up. The page's "up" is world -y. */
export function P(x: number, y: number, z: number): V2 {
  return [f((x - y) * COS), f((x + y) * SIN - z)]
}

export function unproject(sx: number, sy: number, z: number): V2 {
  const a = sx / COS
  const b = (sy + z) / SIN
  return [(a + b) / 2, (b - a) / 2]
}

export function pts(list: V2[]) {
  return list.map((p) => p.join(",")).join(" ")
}

export const LAMP_ELEVATION = (38 * Math.PI) / 180

export function lampFrom(angle: number): Lamp {
  const a = (angle * Math.PI) / 180
  const c = Math.cos(LAMP_ELEVATION)
  return {
    x: Math.sin(a) * c,
    y: -Math.cos(a) * c,
    z: Math.sin(LAMP_ELEVATION),
  }
}

/* A face's flat fill: the surface lightness, stepped toward the theme's own
   shadow lightness when turned away from the lamp and toward its highlight
   when turned into it. */
function tone(sw: Swatches, lamp: Lamp, nx: number, ny: number, nz: number) {
  const len = Math.hypot(nx, ny, nz) || 1
  const d = (nx * lamp.x + ny * lamp.y + nz * lamp.z) / len
  const k = d - lamp.z
  const l =
    k >= 0
      ? sw.l + (sw.lightL - sw.l) * Math.min(1, k / (1 - lamp.z))
      : sw.l + (sw.darkL - sw.l) * Math.min(1, -k / (1 + lamp.z))
  return rgbToHex(
    oklchToRgb({ l: Math.min(1, Math.max(0, l)), c: sw.chroma, h: sw.hue })
  )
}

/* Rounded-rectangle footprint as edges with outward normals. */
function outline(w: number, d: number, r: number, seg = 6) {
  const rr = Math.max(0, Math.min(r, w / 2, d / 2))
  const corners: [number, number, number][] = [
    [1, 1, 0],
    [-1, 1, 1],
    [-1, -1, 2],
    [1, -1, 3],
  ]
  const points: V2[] = []
  for (const [sx, sy, q] of corners) {
    const cx = sx * (w / 2 - rr)
    const cy = sy * (d / 2 - rr)
    const n = rr < 0.5 ? 0 : seg
    for (let i = 0; i <= n; i++) {
      const th = ((q + (n ? i / n : 0.5)) * Math.PI) / 2
      points.push([cx + rr * Math.cos(th), cy + rr * Math.sin(th)])
    }
  }
  const edges: { a: V2; b: V2; n: V2 }[] = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 0.01) continue
    let n: V2 = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len]
    const mid: V2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (n[0] * mid[0] + n[1] * mid[1] < 0) n = [-n[0], -n[1]]
    edges.push({ a, b, n })
  }
  return { edges, r: rr }
}

/* Visible walls of a prism between z0 and z1. Inner walls face into a pocket. */
export function Walls({
  w,
  d,
  r,
  z0,
  z1,
  sw,
  lamp,
  inner,
}: {
  w: number
  d: number
  r: number
  z0: number
  z1: number
  sw: Swatches
  lamp: Lamp
  inner?: boolean
}) {
  const { edges } = outline(w, d, r)
  const shown = (n: V2) => (inner ? n[0] + n[1] < 0 : n[0] + n[1] > 0)
  const start = edges.findIndex(
    (e, i) =>
      shown(e.n) && !shown(edges[(i - 1 + edges.length) % edges.length].n)
  )
  const run: typeof edges = []
  for (let i = 0; start >= 0 && i < edges.length; i++) {
    const e = edges[(start + i) % edges.length]
    if (!shown(e.n)) break
    run.push(e)
  }
  const silhouette =
    !inner && run.length
      ? [
          P(run[0].a[0], run[0].a[1], z1),
          P(run[0].a[0], run[0].a[1], z0),
          ...run.map((e) => P(e.b[0], e.b[1], z0)),
          P(run[run.length - 1].b[0], run[run.length - 1].b[1], z1),
        ]
      : null
  return (
    <g>
      {edges.map(({ a, b, n }, i) => {
        if (!shown(n)) return null
        const s = inner ? -1 : 1
        const fill = tone(sw, lamp, n[0] * s, n[1] * s, 0)
        return (
          <polygon
            key={i}
            points={pts([
              P(a[0], a[1], z0),
              P(b[0], b[1], z0),
              P(b[0], b[1], z1),
              P(a[0], a[1], z1),
            ])}
            fill={fill}
            stroke={fill}
            strokeWidth={0.4}
            strokeLinejoin="round"
          />
        )
      })}
      {silhouette && z1 - z0 > 0.5 && (
        <polyline
          points={pts(silhouette)}
          fill="none"
          className="ill-edge"
          strokeLinejoin="round"
        />
      )}
    </g>
  )
}

type Profile = V2[]

function profileFor(model: ModelName, face: number): Profile {
  if (model === "neu-pressed") {
    return [
      [-20, 0],
      [-20, 14],
      [-11, 14],
      [-11, 5],
      [11, 5],
      [11, 14],
      [20, 14],
      [20, 0],
    ]
  }
  const top: Profile = []
  if (model === "neu" && face !== 0) {
    const sag = Math.sign(face) * (2 + Math.abs(face) * 50)
    for (let i = 0; i <= 10; i++) {
      const x = -11 + (22 * i) / 10
      top.push([x, 16 + sag * (1 - (x / 11) ** 2)])
    }
  } else {
    top.push([-11, 17], [11, 17])
  }
  return [[-20, 0], [-20, 7], [-11, 7], ...top, [11, 7], [20, 7], [20, 0]]
}

/* A block cut open along its front, so the cut face shows the profile. */
export function IsoBlock({
  model,
  sw,
  lamp,
  face,
  cast,
}: {
  model: ModelName
  sw: Swatches
  lamp: Lamp
  face: number
  cast: V2
}) {
  const D = 18
  const profile = profileFor(model, face)
  const top = profile.slice(1, -1)
  const y0 = -D / 2
  const y1 = D / 2
  const strips: { key: number; points: string; fill: string }[] = []
  for (let i = 0; i < top.length - 1; i++) {
    const [ax, az] = top[i]
    const [bx, bz] = top[i + 1]
    const nx = -(bz - az)
    const nz = bx - ax
    if (nx + nz <= 0) continue
    strips.push({
      key: i,
      points: pts([P(ax, y0, az), P(bx, y0, bz), P(bx, y1, bz), P(ax, y1, az)]),
      fill: tone(sw, lamp, nx, 0, nz),
    })
  }
  const draw = (list: typeof strips) =>
    list.map((s) => (
      <polygon
        key={s.key}
        points={s.points}
        fill={s.fill}
        stroke={s.fill}
        strokeWidth={0.3}
        strokeLinejoin="round"
      />
    ))
  const realism = model === "neu-realism"
  const ground = strips.filter((s) => s.key === 0 || s.key === top.length - 2)
  const ridge = strips.filter((s) => !ground.includes(s))
  const rightX = profile[profile.length - 1][0]
  const rightZ = profile[profile.length - 2][1]
  const endFill = tone(sw, lamp, 1, 0, 0)
  const cutFill = tone(sw, lamp, 0, 1, 0)
  const id = "blk" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg viewBox="-27 -38 54 53" className="size-14" aria-hidden>
      {realism && (
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={1.8} />
          </filter>
          <clipPath id={`${id}c`}>
            {ground.map((s) => (
              <polygon key={s.key} points={s.points} />
            ))}
          </clipPath>
        </defs>
      )}
      {draw(strips)}
      {realism && (
        <>
          <g clipPath={`url(#${id}c)`}>
            <g transform={`translate(0 -7) ${ISO}`}>
              <rect
                x={f(-11 + cast[0] * 6)}
                y={f(y0 + cast[1] * 6)}
                width={22}
                height={D}
                fill={sw.dark}
                opacity={0.55}
                filter={`url(#${id})`}
              />
            </g>
          </g>
          {draw(ridge)}
        </>
      )}
      <polygon
        points={pts([
          P(rightX, y0, 0),
          P(rightX, y1, 0),
          P(rightX, y1, rightZ),
          P(rightX, y0, rightZ),
        ])}
        fill={endFill}
      />
      <polygon
        points={pts(profile.map(([x, z]) => P(x, y1, z)))}
        fill={cutFill}
      />
      <polygon
        points={pts(profile.map(([x, z]) => P(x, y1, z)))}
        fill="none"
        className="ill-edge"
        strokeWidth={0.4}
        strokeLinejoin="round"
      />
    </svg>
  )
}
