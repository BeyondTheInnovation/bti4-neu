"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card as NeuCard } from "@/registry/neu/ui/neu/card"
import { knobFaceClasses, knobLiftSmClasses } from "@/registry/neu/ui/neu/knob"

function Card({
  title,
  value,
  action,
  wide,
  caption,
  children,
}: {
  title: string
  value?: React.ReactNode
  action?: React.ReactNode
  wide?: boolean
  caption?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <NeuCard className={cn("min-w-0 gap-3 p-3.5", wide && "col-span-2")}>
      <header className="flex min-h-6 items-center justify-between gap-2">
        <h3 className="ill-label">{title}</h3>
        <div className="flex items-center gap-2">
          {action}
          {value !== undefined && <output className="ill-read">{value}</output>}
        </div>
      </header>
      {children}
      {caption && <p className="ill-caption">{caption}</p>}
    </NeuCard>
  )
}

function Knob({
  x,
  y,
  size = 18,
  tint,
  className,
  children,
  ...props
}: {
  x: number
  y: number
  size?: number
  tint?: string
} & React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(knobFaceClasses, knobLiftSmClasses, "ill-knob", className)}
      style={
        {
          left: `${(x * 100).toFixed(2)}%`,
          top: `${(y * 100).toFixed(2)}%`,
          width: size,
          height: size,
          "--ill-dot": tint ?? "var(--ill-accent)",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </span>
  )
}

/* A row of engraved ticks that fills with the accent up to the value. */
function Gauge({ value, count = 24 }: { value: number; count?: number }) {
  const lit = Math.round(value * (count - 1))
  return (
    <span aria-hidden className="ill-gauge">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          data-on={i <= lit && value > 0 ? "" : undefined}
          data-major={i % 4 === 0 ? "" : undefined}
        />
      ))}
    </span>
  )
}

function useSvgId(prefix: string) {
  return prefix + React.useId().replace(/[^a-zA-Z0-9]/g, "")
}

export { Card, Gauge, Knob, useSvgId }
