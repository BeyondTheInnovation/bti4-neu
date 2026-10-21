"use client"

import * as React from "react"
import { Link2, TriangleAlert, Unlink2 } from "lucide-react"

import type { Theme } from "@/lib/site-theme"
import { Toggle } from "@/registry/neu/ui/neu/toggle"

import { type Swatches, oklchToRgb, rgbToHex } from "./color"
import { clamp, round, stepKey, useDrag } from "./drag"
import { Card, Gauge, Knob, useSvgId } from "./parts"
import {
  MAX_FACE,
  MAX_SHADE,
  type ModelName,
  type SetTheme,
  curvatureText,
  liveStyle,
} from "./theme"

type Props = { t: Theme; sw: Swatches; set: SetTheme }

const rad = (deg: number) => (deg * Math.PI) / 180

const n6 = (v: number) => Math.round(v * 1e6) / 1e6

/* Unit vector the dark shadow is cast along; the lamp sits opposite. */
function castDir(angle: number) {
  return { x: -n6(Math.sin(rad(angle))), y: n6(Math.cos(rad(angle))) }
}

function sliderProps(
  label: string,
  value: number,
  min: number,
  max: number,
  text?: string
) {
  return {
    role: "slider" as const,
    tabIndex: 0,
    "aria-label": label,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-valuetext": text,
  }
}

function ShadeInstrument({ t, sw, set }: Props) {
  const split = t.shadeLight !== null || t.shadeDark !== null
  const sd = t.shadeDark ?? t.shade
  const sl = t.shadeLight ?? t.shade
  const side = React.useRef<"dark" | "light">("dark")
  const pos = (l: number) => clamp(l, 0, 1)

  const commit = (which: "dark" | "light", v: number) => {
    const val = round(clamp(v, 0, MAX_SHADE), 0.005)
    if (!split) set({ shade: val })
    else set(which === "dark" ? { shadeDark: val } : { shadeLight: val })
  }

  const { ref, handlers } = useDrag<HTMLDivElement>(
    ({ x, start, el: stage }) => {
      if (start) {
        side.current = split
          ? Math.abs(x - pos(sw.darkL)) < Math.abs(x - pos(sw.lightL))
            ? "dark"
            : "light"
          : x < sw.l
            ? "dark"
            : "light"
        stage
          .querySelector<HTMLElement>(`[data-side=${side.current}]`)
          ?.focus({ preventScroll: true, focusVisible: false } as FocusOptions)
      }
      commit(side.current, Math.abs(x - sw.l) / sw.boost)
    }
  )

  const toggleSplit = (v: boolean) =>
    set(
      v
        ? { shadeLight: t.shade, shadeDark: t.shade }
        : { shadeLight: null, shadeDark: null }
    )

  const ramp = `linear-gradient(to right in oklch, oklch(0 ${sw.chroma.toFixed(3)} ${sw.hue.toFixed(1)}), oklch(1 ${sw.chroma.toFixed(3)} ${sw.hue.toFixed(1)}))`
  const left = pos(sw.darkL)
  const right = pos(sw.lightL)

  const chips = [
    { label: "Shadow", color: sw.darkSeen, ratio: sw.darkContrast },
    { label: "Surface", color: sw.surface, ratio: null },
    { label: "Highlight", color: sw.lightSeen, ratio: sw.lightContrast },
  ]

  return (
    <Card
      title="Shade"
      wide
      value={split ? `${sd.toFixed(3)} / ${sl.toFixed(3)}` : t.shade.toFixed(3)}
      action={
        <Toggle
          size="sm"
          className="size-7 min-w-7"
          pressed={!split}
          onPressedChange={(v) => toggleSplit(!v)}
          aria-label="Move shadow and highlight together"
          title="Move shadow and highlight together"
        >
          {split ? (
            <Unlink2 className="size-3.5" />
          ) : (
            <Link2 className="size-3.5" />
          )}
        </Toggle>
      }
      caption={
        sw.boost > 1.01
          ? `Dark surface: depth is boosted ${sw.boost.toFixed(2)}x so it stays visible.`
          : sw.lightClipped
            ? "The highlight is already white here. Shade adds depth on the shadow side only."
            : "Contrast of each half against the surface, at the current opacity."
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {chips.map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-1.5">
            <span
              className="neu-pressed ill-chip [--neu-depth:0.25]"
              style={{ background: c.color }}
            />
            <span className="ill-caption leading-none">{c.label}</span>
            <span className="ill-read leading-none">
              {c.ratio === null
                ? `L ${sw.l.toFixed(2)}`
                : `${c.ratio.toFixed(2)}:1`}
            </span>
          </div>
        ))}
      </div>
      <div
        ref={ref}
        {...handlers}
        className="ill-stage ill-ruler cursor-ew-resize"
      >
        <span
          className="neu-pressed ill-ruler-track [--neu-depth:0.25]"
          style={{ background: ramp }}
        />
        <span
          className="ill-ruler-band"
          style={{ left: `${left * 100}%`, width: `${(right - left) * 100}%` }}
          data-clip-light={sw.lightClipped ? "" : undefined}
          data-clip-dark={sw.darkClipped ? "" : undefined}
        />
        <span className="ill-ruler-mark" style={{ left: `${sw.l * 100}%` }} />
        {(["dark", "light"] as const).map((s) => {
          const v = s === "dark" ? sd : sl
          return (
            <Knob
              key={s}
              data-side={s}
              aria-hidden={false}
              x={s === "dark" ? left : right}
              y={0.5}
              size={20}
              tint={s === "dark" ? sw.dark : sw.light}
              {...sliderProps(
                s === "dark" ? "Shadow depth" : "Highlight depth",
                v,
                0,
                MAX_SHADE
              )}
              onKeyDown={(e: React.KeyboardEvent) => {
                const n = stepKey(e, v, { min: 0, max: MAX_SHADE, step: 0.005 })
                if (n !== null) commit(s, n)
              }}
              className="ill-focusable"
            />
          )
        })}
        {sw.lightClipped && (
          <span className="ill-clip-flag" title="Highlight clipped at white">
            <TriangleAlert className="size-3" aria-hidden />
            clipped
          </span>
        )}
      </div>
    </Card>
  )
}

function AlphaInstrument({ t, sw, set }: Props) {
  const id = useSvgId("alpha")
  const cast = castDir(t.angle)
  const { ref, handlers } = useDrag<HTMLDivElement>(({ x }) =>
    set({ alpha: round(clamp((x - 0.08) / 0.84, 0, 1), 0.05) })
  )
  return (
    <Card title="Opacity" value={t.alpha.toFixed(2)}>
      <div
        ref={ref}
        {...handlers}
        {...sliderProps("Shadow opacity", t.alpha, 0, 1)}
        onKeyDown={(e) => {
          const v = stepKey(e, t.alpha, { min: 0, max: 1, step: 0.05 })
          if (v !== null) set({ alpha: v })
        }}
        className="ill-stage flex aspect-[4/3] cursor-ew-resize flex-col"
      >
        <svg viewBox="0 0 160 104" className="min-h-0 flex-1" aria-hidden>
          <defs>
            <pattern
              id={`${id}p`}
              width={9}
              height={9}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect
                width={4}
                height={9}
                className="ill-ink-fill"
                opacity={0.16}
              />
            </pattern>
            <filter id={`${id}b`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation={3} />
            </filter>
            <clipPath id={`${id}c`}>
              <rect x={6} y={6} width={148} height={92} rx={10} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}c)`}>
            <rect x={0} y={0} width={160} height={104} fill={`url(#${id}p)`} />
            <rect
              x={40 + cast.x * 18}
              y={24 + cast.y * 18}
              width={80}
              height={48}
              rx={10}
              fill={sw.dark}
              opacity={t.alpha}
              filter={`url(#${id}b)`}
            />
            <rect
              x={40 - cast.x * 18}
              y={24 - cast.y * 18}
              width={80}
              height={48}
              rx={10}
              fill={sw.light}
              opacity={t.alpha}
              filter={`url(#${id}b)`}
            />
            <rect
              x={40}
              y={24}
              width={80}
              height={48}
              rx={10}
              fill={sw.surface}
              className="ill-edge"
            />
          </g>
        </svg>
        <Gauge value={t.alpha} />
      </div>
    </Card>
  )
}

const FACE_TOP = 38
const FACE_PX = 220

function CurvatureInstrument({
  t,
  sw,
  set,
  model,
}: Props & { model: ModelName }) {
  const active = model === "neu"
  const peak = FACE_TOP - t.face * FACE_PX
  const id = useSvgId("face")
  const lampLeft = Math.sin(rad(t.angle)) < 0
  const [a, b] =
    t.face < 0 ? [sw.faceDark, sw.faceLight] : [sw.faceLight, sw.faceDark]
  const [from, to] = lampLeft ? [a, b] : [b, a]
  const commit = (v: number) =>
    set({ face: round(clamp(v, -MAX_FACE, MAX_FACE), 0.005) })

  const { ref, handlers } = useDrag<HTMLDivElement>(({ y }) => {
    const lift = FACE_TOP - y * 80
    commit(Math.abs(lift) < 2.5 ? 0 : lift / FACE_PX)
  })

  return (
    <Card
      title="Curvature"
      wide
      value={curvatureText(t.face)}
      caption={
        active
          ? "Exports the depth only. Each element picks .neu-concave or .neu-convex."
          : "Raised only. Pressed and Realism keep a flat top."
      }
    >
      <div
        ref={ref}
        {...handlers}
        {...sliderProps(
          "Face curvature",
          t.face,
          -MAX_FACE,
          MAX_FACE,
          curvatureText(t.face)
        )}
        onKeyDown={(e) => {
          const v = stepKey(e, t.face, {
            min: -MAX_FACE,
            max: MAX_FACE,
            step: 0.005,
          })
          if (v !== null) commit(v)
        }}
        className="ill-stage h-20 cursor-ns-resize"
        data-ghost={active ? undefined : ""}
      >
        <svg
          viewBox="0 0 320 80"
          className="size-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          <line
            x1={20}
            x2={300}
            y1={70.5}
            y2={70.5}
            className="ill-ink"
            strokeWidth={0.6}
            opacity={0.35}
          />
          <path
            d={`M52,${FACE_TOP} Q160,${2 * peak - FACE_TOP} 268,${FACE_TOP} L268,70 L52,70 Z`}
            fill={`url(#${id})`}
            className="ill-edge"
          />
          <line
            x1={44}
            x2={276}
            y1={FACE_TOP}
            y2={FACE_TOP}
            className="ill-ink"
            strokeWidth={0.5}
            strokeDasharray="2 3"
            opacity={0.4}
          />
        </svg>
        <Knob x={0.5} y={peak / 80} />
      </div>
    </Card>
  )
}

function darkSample(sw: Swatches) {
  return sw.l < 0.62
    ? sw.surface
    : rgbToHex(oklchToRgb({ l: 0.3, c: Math.min(sw.chroma, 0.05), h: sw.hue }))
}

function GlintInstrument({ t, sw, set }: Props) {
  const { ref, handlers } = useDrag<HTMLDivElement>(({ x }) =>
    set({ glint: round(clamp(((x - 0.08) / 0.84) * 1.5, 0, 1.5), 0.05) })
  )
  const onLight = sw.l >= 0.62
  const lamp = { x: n6(Math.sin(rad(t.angle))), y: -n6(Math.cos(rad(t.angle))) }
  const toward = (v: number) => (Math.abs(v) < 0.38 ? 0 : Math.sign(v))
  const shift = { x: -toward(lamp.x) * 40, y: -toward(lamp.y) * 40 }
  return (
    <Card
      title="Glint"
      value={t.glint.toFixed(2)}
      caption={
        onLight ? "Dark surfaces only. Shown on a dark sample." : undefined
      }
    >
      <div
        ref={ref}
        {...handlers}
        {...sliderProps("Edge glint", t.glint, 0, 1.5)}
        onKeyDown={(e) => {
          const v = stepKey(e, t.glint, { min: 0, max: 1.5, step: 0.05 })
          if (v !== null) set({ glint: v })
        }}
        className="ill-stage flex aspect-[4/3] cursor-ew-resize flex-col items-center"
      >
        <div className="flex min-h-0 flex-1 items-center">
          <div
            className="ill-loupe neu-pressed"
            style={{ "--neu-surface": darkSample(sw) } as React.CSSProperties}
          >
            <div
              className="ill-loupe-lens"
              style={{ background: darkSample(sw) }}
            >
              <span
                className="neu absolute"
                style={
                  {
                    ...liveStyle(t),
                    "--neu-surface": darkSample(sw),
                    "--neu-distance": "3px",
                    "--neu-blur": "6px",
                    "--neu-radius": "10px",
                    "--neu-corner": "round",
                    width: 40,
                    height: 40,
                    left: `calc(50% - 20px + ${shift.x}px)`,
                    top: `calc(50% - 20px + ${shift.y}px)`,
                    scale: "3.4",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>
        <Gauge value={t.glint / 1.5} />
      </div>
    </Card>
  )
}

export {
  AlphaInstrument,
  CurvatureInstrument,
  GlintInstrument,
  ShadeInstrument,
}
