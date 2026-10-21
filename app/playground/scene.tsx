"use client"

import * as React from "react"

import type { Theme } from "@/lib/site-theme"
import { cn } from "@/lib/utils"
import { Toggle } from "@/registry/neu/ui/neu/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/neu/ui/neu/toggle-group"

import type { Swatches } from "./color"
import { clamp, stepKey, useDrag } from "./drag"
import {
  ISO,
  IsoBlock,
  LAMP_ELEVATION,
  P,
  type V2,
  Walls,
  f,
  lampFrom,
  pts,
  unproject,
} from "./iso"
import { useSvgId } from "./parts"
import {
  MAX_FACE,
  MODELS,
  type ModelName,
  SHAPE_LABEL,
  type SetTheme,
  shapeOf,
} from "./theme"

const K = 1.3
const RK = 0.875
const W = 112
const D = 84
const SHEET = 190
const SHEET_R = 22
const SHEET_T = 7
const RING = 84
const SUN_Z = 30
const VB = { x: -170, y: -108, w: 340, h: 214 }
const TAN = Math.tan(LAMP_ELEVATION)
const S2 = Math.SQRT1_2
const DOME = 130
const RINGS = [1, 0.8, 0.6, 0.4, 0.2]

const DIRECTIONS = [
  "Top",
  "Top right",
  "Right",
  "Bottom right",
  "Bottom",
  "Bottom left",
  "Left",
  "Top left",
]

type Mode = "sun" | "lift" | "radius"

function rrPath(x: number, y: number, w: number, h: number, r: number) {
  const q = Math.max(0, Math.min(r, w / 2, h / 2))
  return [
    `M${f(x + q)},${f(y)}`,
    `H${f(x + w - q)}`,
    `A${f(q)},${f(q)} 0 0 1 ${f(x + w)},${f(y + q)}`,
    `V${f(y + h - q)}`,
    `A${f(q)},${f(q)} 0 0 1 ${f(x + w - q)},${f(y + h)}`,
    `H${f(x + q)}`,
    `A${f(q)},${f(q)} 0 0 1 ${f(x)},${f(y + h - q)}`,
    `V${f(y + q)}`,
    `A${f(q)},${f(q)} 0 0 1 ${f(x + q)},${f(y)}`,
    "Z",
  ].join(" ")
}

const pct = (v: number, o: number, s: number) =>
  `${(((v - o) / s) * 100).toFixed(2)}%`

function Readout({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="min-w-0">
      <div className="ill-label">{label}</div>
      <div className="ill-mid mt-1">{value}</div>
      <div className="ill-caption truncate">{note}</div>
    </div>
  )
}

function Hero({
  t,
  sw,
  set,
  model,
  onModelChange,
  chrome,
}: {
  t: Theme
  sw: Swatches
  set: SetTheme
  model: ModelName
  onModelChange: (m: ModelName) => void
  chrome: React.CSSProperties
}) {
  const id = useSvgId("scene")
  const lamp = lampFrom(t.angle)
  const ux = f(Math.sin((t.angle * Math.PI) / 180) * 1e4) / 1e4
  const uy = -f(Math.cos((t.angle * Math.PI) / 180) * 1e4) / 1e4
  const c: V2 = [-ux, -uy]
  const shape = shapeOf(model, t.face)
  const pressed = model === "neu-pressed"
  const signed = pressed ? -t.distance : t.distance
  const h = t.distance * K
  // A dish cannot be cut deeper than the slab is thick, so a thin slab gets a shallower curve.
  const sag =
    model === "neu" ? (t.face / MAX_FACE) * Math.min(h, MAX_FACE * DOME) : 0
  const off = h / TAN
  const sigma = f((t.blur * K) / 2)
  const r = Math.min(t.radius * RK, D / 2)
  const topZ = pressed ? 0 : h
  const sun = P(ux * RING, uy * RING, SUN_Z)
  const foot = P(ux * RING, uy * RING, 0)
  const sunInFront = ux + uy > 0
  const target = P(0, 0, pressed ? -h : h + sag)
  const name = DIRECTIONS[Math.round(t.angle / 45) % 8]

  const apexW: V2 = [W / 2 - r + r * S2, D / 2 - r + r * S2]
  const apex = P(apexW[0], apexW[1], topZ)
  const cornerTip = P(W / 2, D / 2, topZ)

  const commitLift = (v: number) => {
    const d = Math.abs(v)
    set({ distance: d, blur: d * 2 })
    if (v < 0 && !pressed) onModelChange("neu-pressed")
    if (v > 0 && pressed) onModelChange("neu")
  }

  const mode = React.useRef<Mode>("lift")
  const origin = React.useRef({ y: 0, v: 0, z: 0 })

  const { ref, handlers } = useDrag<HTMLDivElement>(({ x, y, start, el }) => {
    const vx = VB.x + x * VB.w
    const vy = VB.y + y * VB.h
    if (start) {
      const near = (p: V2) => Math.hypot(vx - p[0], vy - p[1])
      const picks: [Mode, number][] = [
        ["radius", near(apex)],
        ["sun", near(sun)],
        ["lift", near(target)],
      ]
      const best = picks.reduce((a, b) => (b[1] < a[1] ? b : a))
      if (best[1] < 14) mode.current = best[0]
      else {
        const [gx, gy] = unproject(vx, vy, 0)
        const [tx, ty] = unproject(vx, vy, pressed ? -h : h)
        const onSlab = Math.abs(tx) < W / 2 + 8 && Math.abs(ty) < D / 2 + 8
        mode.current =
          !onSlab && Math.hypot(gx, gy) > RING - 22 ? "sun" : "lift"
      }
      origin.current = {
        y: vy,
        v: signed,
        z:
          mode.current === "sun" && best[0] === "sun" && best[1] < 14
            ? SUN_Z
            : 0,
      }
      el.querySelector<HTMLElement>(`[data-handle=${mode.current}]`)?.focus({
        preventScroll: true,
        focusVisible: false,
      } as FocusOptions)
    }
    if (mode.current === "sun") {
      const [gx, gy] = unproject(vx, vy, origin.current.z)
      if (Math.hypot(gx, gy) < 8) return
      let a = ((Math.atan2(gx, -gy) * 180) / Math.PI + 360) % 360
      const snap = Math.round(a / 45) * 45
      a = Math.abs(a - snap) < 4 ? snap % 360 : Math.round(a)
      set({ angle: a })
    } else if (mode.current === "radius") {
      const [gx, gy] = unproject(vx, vy, topZ)
      const d = (W / 2 - gx + (D / 2 - gy)) * S2
      set({ radius: clamp(Math.round(d / (Math.SQRT2 - 1) / RK), 0, 48) })
    } else {
      commitLift(
        clamp(
          Math.round(origin.current.v + (origin.current.y - vy) / K),
          -32,
          32
        )
      )
    }
  })

  const onSunKey = (e: React.KeyboardEvent) => {
    const dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[
      e.key
    ]
    if (!dir) return
    e.preventDefault()
    const next = e.shiftKey
      ? (Math.round(t.angle / 45) * 45 + dir * 45 + 360) % 360
      : (t.angle + dir * 5 + 360) % 360
    set({ angle: next })
  }

  const layers = model === "neu-realism" ? [0.3, 0.65, 1.3] : [1]
  const bigRect = "M-260,-260 H260 V260 H-260 Z"

  const sunNode = (
    <g>
      <line
        x1={foot[0]}
        y1={foot[1]}
        x2={sun[0]}
        y2={sun[1]}
        className="ill-ink"
        strokeWidth={0.7}
        strokeDasharray="1.5 2.5"
        opacity={0.6}
      />
      <g transform={`translate(${foot[0]} ${foot[1]}) ${ISO}`}>
        <circle r={3.2} className="ill-ink-fill" opacity={0.35} />
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return (
          <line
            key={i}
            x1={f(sun[0] + Math.sin(a) * 9)}
            y1={f(sun[1] - Math.cos(a) * 9)}
            x2={f(sun[0] + Math.sin(a) * 12.5)}
            y2={f(sun[1] - Math.cos(a) * 12.5)}
            className="ill-accent"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={sun[0]} cy={sun[1]} r={6.5} className="ill-accent-fill" />
    </g>
  )

  const cast: V2 = [c[0], c[1]]
  const top = rrPath(-W / 2, -D / 2, W, D, r)
  const span = D / 2 - 2
  const rimL = P(-span, span, h)
  const rimR = P(span, -span, h)
  const section = Array.from({ length: 21 }, (_, i) => {
    const k = i / 10 - 1
    return P(k * span, -k * span, h + sag * (1 - k * k))
  })

  return (
    <section aria-label="Model and result" className="ill-hero">
      <div className="ill-hero-grid">
        <figure className="ill-hero-model">
          <div
            ref={ref}
            {...handlers}
            className="ill-stage ill-scene"
            style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
          >
            <svg
              viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
              className="size-full"
              aria-hidden
            >
              <defs>
                <filter
                  id={`${id}b`}
                  filterUnits="userSpaceOnUse"
                  x={-260}
                  y={-260}
                  width={520}
                  height={520}
                >
                  <feGaussianBlur stdDeviation={sigma} />
                </filter>
                {layers.length > 1 &&
                  layers.map((k) => (
                    <filter
                      key={k}
                      id={`${id}b${Math.round(k * 100)}`}
                      filterUnits="userSpaceOnUse"
                      x={-260}
                      y={-260}
                      width={520}
                      height={520}
                    >
                      <feGaussianBlur stdDeviation={f(sigma * k)} />
                    </filter>
                  ))}
                <clipPath id={`${id}s`}>
                  <rect
                    transform={ISO}
                    x={-SHEET / 2}
                    y={-SHEET / 2}
                    width={SHEET}
                    height={SHEET}
                    rx={SHEET_R}
                  />
                </clipPath>
                <clipPath id={`${id}h`}>
                  <path transform={ISO} d={top} />
                </clipPath>
                <clipPath id={`${id}t`}>
                  <path transform={`translate(0 ${f(-h)}) ${ISO}`} d={top} />
                </clipPath>
                <linearGradient
                  id={`${id}g`}
                  gradientUnits="userSpaceOnUse"
                  x1={f(ux * W * 0.5)}
                  y1={f(uy * D * 0.5)}
                  x2={f(-ux * W * 0.5)}
                  y2={f(-uy * D * 0.5)}
                >
                  <stop
                    offset="0"
                    stopColor={sag < 0 ? sw.faceDark : sw.faceLight}
                  />
                  <stop
                    offset="1"
                    stopColor={sag < 0 ? sw.faceLight : sw.faceDark}
                  />
                </linearGradient>
              </defs>

              <Walls
                w={SHEET}
                d={SHEET}
                r={SHEET_R}
                z0={-SHEET_T}
                z1={0}
                sw={sw}
                lamp={lamp}
              />
              <rect
                transform={ISO}
                x={-SHEET / 2}
                y={-SHEET / 2}
                width={SHEET}
                height={SHEET}
                rx={SHEET_R}
                fill={sw.surface}
                className="ill-edge"
              />

              <g transform={ISO}>
                <circle
                  r={RING}
                  fill="none"
                  className="ill-ink"
                  strokeWidth={0.7}
                  strokeDasharray="2 4"
                  opacity={0.45}
                />
                {Array.from({ length: 8 }, (_, i) => (
                  <circle
                    key={i}
                    cx={f(Math.sin((i * Math.PI) / 4) * RING)}
                    cy={f(-Math.cos((i * Math.PI) / 4) * RING)}
                    r={i % 2 ? 1.4 : 2.2}
                    className="ill-ink-fill"
                    opacity={0.45}
                  />
                ))}
              </g>

              {!pressed && (
                <g clipPath={`url(#${id}s)`}>
                  <g transform={ISO}>
                    <path
                      d={rrPath(
                        -W / 2 - off * c[0],
                        -D / 2 - off * c[1],
                        W,
                        D,
                        r
                      )}
                      fill={sw.light}
                      opacity={t.alpha}
                      filter={`url(#${id}b)`}
                    />
                    {layers.map((k) => (
                      <path
                        key={k}
                        d={rrPath(
                          -W / 2 + off * c[0] * k,
                          -D / 2 + off * c[1] * k,
                          W,
                          D,
                          r
                        )}
                        fill={sw.dark}
                        opacity={
                          layers.length > 1
                            ? t.alpha * (0.9 - k * 0.3)
                            : t.alpha
                        }
                        filter={`url(#${id}b${layers.length > 1 ? Math.round(k * 100) : ""})`}
                      />
                    ))}
                  </g>
                </g>
              )}

              {!sunInFront && sunNode}

              {pressed ? (
                <>
                  <g clipPath={`url(#${id}h)`}>
                    <g transform={`translate(0 ${f(h)}) ${ISO}`}>
                      <path
                        d={rrPath(-W / 2, -D / 2, W, D, r)}
                        fill={sw.surface}
                      />
                      <path
                        d={`${bigRect} ${rrPath(-W / 2 + off * c[0], -D / 2 + off * c[1], W, D, r)}`}
                        fillRule="evenodd"
                        fill={sw.dark}
                        opacity={t.alpha}
                        filter={`url(#${id}b)`}
                      />
                      <path
                        d={`${bigRect} ${rrPath(-W / 2 - off * c[0], -D / 2 - off * c[1], W, D, r)}`}
                        fillRule="evenodd"
                        fill={sw.light}
                        opacity={t.alpha}
                        filter={`url(#${id}b)`}
                      />
                    </g>
                    <Walls
                      w={W}
                      d={D}
                      r={r}
                      z0={-h}
                      z1={0}
                      sw={sw}
                      lamp={lamp}
                      inner
                    />
                  </g>
                  <path
                    transform={ISO}
                    d={top}
                    fill="none"
                    className="ill-edge"
                  />
                </>
              ) : (
                <>
                  <Walls w={W} d={D} r={r} z0={0} z1={h} sw={sw} lamp={lamp} />
                  <g clipPath={sag < 0 ? `url(#${id}t)` : undefined}>
                    {(sag === 0 ? [1] : RINGS).map((k) => (
                      <path
                        key={k}
                        transform={`translate(0 ${f(-h - sag * (1 - k * k))}) ${ISO}`}
                        d={rrPath(
                          (-W / 2) * k,
                          (-D / 2) * k,
                          W * k,
                          D * k,
                          r * k
                        )}
                        fill={sag === 0 ? sw.surface : `url(#${id}g)`}
                        className="ill-edge"
                        strokeOpacity={k === 1 ? undefined : 0.55}
                      />
                    ))}
                  </g>
                  {sag < 0 && (
                    <path
                      transform={`translate(0 ${f(-h)}) ${ISO}`}
                      d={top}
                      fill="none"
                      className="ill-edge"
                    />
                  )}
                  {sag !== 0 && (
                    <g className="ill-accent" fill="none" strokeLinecap="round">
                      <line
                        x1={rimL[0]}
                        y1={rimL[1]}
                        x2={rimR[0]}
                        y2={rimR[1]}
                        strokeWidth={0.6}
                        strokeDasharray="2 3"
                        opacity={0.55}
                      />
                      <polyline
                        points={pts(section)}
                        strokeWidth={1.1}
                        opacity={0.8}
                      />
                    </g>
                  )}
                </>
              )}

              {sunInFront && sunNode}

              <line
                x1={sun[0]}
                y1={sun[1]}
                x2={target[0]}
                y2={target[1]}
                className="ill-accent"
                strokeWidth={0.8}
                strokeDasharray="2 3"
                opacity={0.5}
              />

              <g
                className="ill-accent"
                strokeWidth={1.4}
                strokeLinecap="round"
                fill="none"
              >
                <line
                  x1={cornerTip[0]}
                  y1={cornerTip[1]}
                  x2={apex[0]}
                  y2={apex[1]}
                  strokeDasharray="1.5 2"
                  opacity={0.7}
                />
                <circle
                  cx={apex[0]}
                  cy={apex[1]}
                  r={4.2}
                  className="ill-hero-dot"
                />
                <text
                  x={apex[0] + 8}
                  y={apex[1] + 10}
                  className="ill-svg-text ill-halo"
                >
                  r {t.radius}
                </text>
              </g>

              <g
                className="ill-accent"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <circle
                  cx={target[0]}
                  cy={target[1]}
                  r={3}
                  className="ill-accent-fill"
                  stroke="none"
                />
                <polyline
                  points={`${target[0] - 4},${target[1] - 7} ${target[0]},${target[1] - 11} ${target[0] + 4},${target[1] - 7}`}
                />
                <polyline
                  points={`${target[0] - 4},${target[1] + 7} ${target[0]},${target[1] + 11} ${target[0] + 4},${target[1] + 7}`}
                />
              </g>
            </svg>

            <span
              data-handle="sun"
              role="slider"
              tabIndex={0}
              aria-label="Light direction"
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuenow={t.angle}
              aria-valuetext={`${t.angle} degrees, ${name}`}
              onKeyDown={onSunKey}
              className="ill-handle cursor-grab"
              style={{
                left: pct(sun[0], VB.x, VB.w),
                top: pct(sun[1], VB.y, VB.h),
              }}
            />
            <span
              data-handle="lift"
              role="slider"
              tabIndex={0}
              aria-label="Elevation"
              aria-valuemin={-32}
              aria-valuemax={32}
              aria-valuenow={signed}
              aria-valuetext={
                signed < 0
                  ? `Pressed ${-signed} pixels into the sheet`
                  : `Raised ${signed} pixels`
              }
              onKeyDown={(e) => {
                const v = stepKey(e, signed, { min: -32, max: 32, step: 1 })
                if (v !== null) commitLift(v)
              }}
              className="ill-handle cursor-ns-resize"
              style={{
                left: pct(target[0], VB.x, VB.w),
                top: pct(target[1], VB.y, VB.h),
              }}
            />
            <span
              data-handle="radius"
              role="slider"
              tabIndex={0}
              aria-label="Corner radius"
              aria-valuemin={0}
              aria-valuemax={48}
              aria-valuenow={t.radius}
              aria-valuetext={`${t.radius} pixels`}
              onKeyDown={(e) => {
                const v = stepKey(e, t.radius, { min: 0, max: 48, step: 1 })
                if (v !== null) set({ radius: v })
              }}
              className="ill-handle ill-handle-sm cursor-nwse-resize"
              style={{
                left: pct(apex[0], VB.x, VB.w),
                top: pct(apex[1], VB.y, VB.h),
              }}
            />
          </div>
          <figcaption className="ill-caption">
            <span className="ill-label mr-2">Model</span>
            Drag the sun, lift or sink the slab, pull the corner for radius.
          </figcaption>
        </figure>

        <figure className="ill-hero-result">
          <div className="ill-specimen-stage">
            <div className={cn(shape, "ill-specimen")}>
              <span className="text-xl font-bold tracking-tight">
                {SHAPE_LABEL[shape]}
              </span>
            </div>
          </div>
          <figcaption className="ill-caption">
            <span className="ill-label mr-2">CSS</span>
            The same tokens on <code className="ill-read">.{shape}</code>, seen
            from above.
          </figcaption>
        </figure>
      </div>

      <div className="ill-hero-controls" style={chrome}>
        <ToggleGroup
          type="single"
          aria-label="Model"
          value={model}
          onValueChange={(v) => {
            const next = MODELS.find((m) => m.cls === v)
            if (next) onModelChange(next.cls)
          }}
          className="ill-hero-shapes w-full rounded-[22px] p-1.5 [&>[data-slot=sliding-key]]:rounded-2xl"
        >
          {MODELS.map((m) => (
            <ToggleGroupItem
              key={m.cls}
              value={m.cls}
              className="h-auto min-w-0 flex-col gap-1 rounded-2xl px-0.5 pt-1.5 pb-2 text-[0.6875rem]"
            >
              <IsoBlock
                model={m.cls}
                face={t.face}
                sw={sw}
                lamp={lamp}
                cast={cast}
              />
              <span>{m.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="ill-hero-reads">
          <Readout
            label="Light"
            value={`${t.angle}°`}
            note={
              t.angle % 45 === 0
                ? name.toLowerCase()
                : `near ${name.toLowerCase()}`
            }
          />
          <Readout
            label="Elevation"
            value={`${signed}`}
            note={signed === 0 ? "flat" : signed < 0 ? "pressed in" : "raised"}
          />
          <Readout label="Blur" value={`${t.blur}`} note="2x elevation" />
          <Readout
            label="Radius"
            value={`${t.radius}`}
            note={t.squircle ? "squircle" : "round"}
          />
        </div>

        <div className="ill-hero-tools">
          <Toggle
            size="sm"
            className="size-7 min-w-7"
            pressed={t.squircle}
            onPressedChange={(v) => set({ squircle: v })}
            aria-label="Squircle corners (needs CSS corner-shape)"
            title="Squircle corners (needs CSS corner-shape)"
          >
            <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden>
              <path
                d="M1.5 11 L1.5 6 C1.5 2 2 1.5 6 1.5 L11 1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
          </Toggle>
        </div>
      </div>
    </section>
  )
}

export { Hero }
